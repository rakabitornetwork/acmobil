<?php

namespace App\Services;

use Symfony\Component\Process\PhpExecutableFinder;
use Symfony\Component\Process\Process;

class GitDeployService
{
    protected string $basePath;

    public function __construct()
    {
        $this->basePath = base_path();
    }

    public function isGitRepository(): bool
    {
        return is_dir($this->basePath.'/.git');
    }

    public function getStatus(): array
    {
        if (! $this->isGitRepository()) {
            return [
                'available' => false,
                'message' => 'Folder ini bukan repository Git.',
            ];
        }

        $remote = config('deploy.remote', 'origin');
        $branch = (string) config('deploy.branch', 'main');
        $remoteUrl = trim($this->runGit('remote get-url '.$remote)['output'] ?? '');

        $localSha = $this->gitRevParse('HEAD');
        $trackedDirtyFiles = $this->getTrackedDirtyFiles();
        $dirty = count($trackedDirtyFiles) > 0;
        $hasBlockingChanges = $this->hasBlockingLocalChanges();

        $remoteSha = null;
        $fetchError = null;
        $fetch = $this->runGit('fetch '.$remote.' '.$branch.' --tags --force');
        if (! $fetch['success']) {
            $fetchError = trim($fetch['output']) ?: 'git fetch gagal';
        } else {
            $remoteSha = $this->gitRevParse($remote.'/'.$branch);
        }

        $hasUpdate = $localSha !== null && $remoteSha !== null && $localSha !== $remoteSha;
        $localVersion = $this->gitDescribe('HEAD');
        $remoteVersion = $remoteSha !== null ? $this->gitDescribe($remote.'/'.$branch) : null;
        $commitsBehind = ($hasUpdate && $localSha !== null && $remoteSha !== null)
            ? $this->commitsBehind($branch)
            : 0;
        $pendingCommits = $hasUpdate ? $this->pendingCommits($branch) : [];
        $compareUrl = ($hasUpdate && $localSha !== null && $remoteSha !== null)
            ? $this->buildCompareUrl($localSha, $remoteSha)
            : null;

        $allowDirty = (bool) config('deploy.allow_dirty_working_tree');

        return [
            'available' => true,
            'enabled' => (bool) config('deploy.enabled'),
            'remote' => $remote,
            'remote_url' => $remoteUrl !== '' ? $remoteUrl : 'https://github.com/rakabitornetwork/acmobil.git',
            'branch' => $branch,
            'local_sha' => $localSha,
            'remote_sha' => $remoteSha,
            'local_version' => $localVersion,
            'remote_version' => $remoteVersion,
            'has_update' => $hasUpdate,
            'commits_behind' => $commitsBehind,
            'pending_commits' => $pendingCommits,
            'compare_url' => $compareUrl,
            'has_release_tags' => $this->hasReleaseTags(),
            'fetch_error' => $fetchError,
            'fetch_ok' => $fetchError === null,
            'dirty' => $dirty,
            'dirty_files' => $trackedDirtyFiles,
            'has_blocking_changes' => $hasBlockingChanges,
            'blocking_changes' => $this->getBlockingLocalChangePaths(),
            'ignored_local_changes' => $this->getIgnoredLocalChangePaths(),
            'allow_dirty' => $allowDirty,
            'can_deploy' => $fetchError === null
                && ($remoteSha !== null)
                && (! $hasBlockingChanges || $allowDirty),
        ];
    }

    public function deploy(array $options = []): array
    {
        $runComposer = $options['composer'] ?? false;
        $runMigrate = $options['migrate'] ?? false;
        $runNpm = $options['npm'] ?? false;
        $runOptimize = $options['optimize'] ?? true;

        $logs = [];
        $remote = config('deploy.remote', 'origin');
        $branch = (string) config('deploy.branch', 'main');

        if (! $this->isGitRepository()) {
            return $this->fail($logs, 'Bukan repository Git.');
        }

        if ($this->hasBlockingLocalChanges() && ! config('deploy.allow_dirty_working_tree')) {
            $files = implode(', ', $this->getBlockingLocalChangePaths());

            return $this->fail($logs, 'Ada perubahan lokal pada file penting: '.$files.'. Commit/stash dulu, atau set DEPLOY_ALLOW_DIRTY=true di .env');
        }

        $fetchResult = $this->runGit('fetch '.$remote.' '.$branch.' --tags --force');
        $logs[] = $this->logEntry('Git fetch', $fetchResult);
        if (! $fetchResult['success']) {
            return $this->result(false, $logs, 'Gagal mengambil perubahan dari GitHub.');
        }

        $localSha = $this->gitRevParse('HEAD');
        $remoteSha = $this->gitRevParse($remote.'/'.$branch);
        if ($localSha !== null && $remoteSha !== null && $localSha === $remoteSha) {
            return $this->result(false, $logs, 'Sudah pada commit yang sama dengan '.$remote.'/'.$branch.'. Tidak ada update untuk dipasang.');
        }

        $ignoredDirty = $this->getIgnoredLocalChangePaths();
        if ($ignoredDirty !== []) {
            $checkoutArgs = implode(' ', array_map('escapeshellarg', $ignoredDirty));
            $checkout = $this->runGit('checkout -- '.$checkoutArgs);
            $logs[] = $this->logEntry('Bersihkan file ignored yang berubah ('.count($ignoredDirty).' file)', $checkout);
        }

        $pull = $this->runGit('pull --ff-only '.$remote.' '.$branch.' --tags');
        $logs[] = $this->logEntry('Git pull', $pull);
        if (! $pull['success']) {
            return $this->result(false, $logs, 'Gagal menarik perubahan dari GitHub. Pastikan tidak ada konflik merge.');
        }

        $remoteVersion = $this->gitDescribe('HEAD') ?? $branch;

        if ($runComposer && file_exists($this->basePath.'/composer.json')) {
            $composer = $this->runComposerInstall();
            $logs[] = $this->logEntry('Composer install (--no-dev)', $composer);
            if (! $composer['success']) {
                return $this->result(false, $logs, 'Composer install gagal. Pastikan DEPLOY_PHP_BINARY mengarah ke PHP CLI (bukan php-fpm).');
            }

            $discover = $this->runPhp('package:discover --ansi');
            $logs[] = $this->logEntry('Artisan package:discover', $discover);
            if (! $discover['success']) {
                return $this->result(false, $logs, 'package:discover gagal. Set DEPLOY_PHP_BINARY=/usr/bin/php8.3 di .env VPS.');
            }
        }

        if ($runMigrate && file_exists($this->basePath.'/artisan')) {
            $migrate = $this->runPhp('migrate --force');
            $logs[] = $this->logEntry('Database migrate', $migrate);
            if (! $migrate['success']) {
                return $this->result(false, $logs, 'Migrasi database gagal.');
            }
        }

        if ($runNpm && file_exists($this->basePath.'/package.json')) {
            $npmInstall = $this->runShell('npm install --ignore-scripts --no-audit --no-fund');
            $logs[] = $this->logEntry('NPM install', $npmInstall);
            if (! $npmInstall['success']) {
                return $this->result(false, $logs, 'NPM install gagal. Di VPS tanpa Node, uncentang opsi npm (aset public/build sudah di-commit).');
            }

            $npmBuild = $this->runShell('npm run build');
            $logs[] = $this->logEntry('NPM build', $npmBuild);
            if (! $npmBuild['success']) {
                return $this->result(false, $logs, 'NPM build gagal.');
            }
        }

        if ($runOptimize) {
            foreach ([
                'Optimize' => 'optimize',
                'Config cache' => 'config:cache',
                'Route cache' => 'route:cache',
                'View cache' => 'view:cache',
            ] as $label => $cmd) {
                $opt = $this->runPhp($cmd);
                $logs[] = $this->logEntry($label, $opt);
            }
        }

        return $this->result(true, $logs, 'Aplikasi berhasil diperbarui ('.$remoteVersion.').');
    }

    /**
     * @return array{success: bool, message: string, logs: list<array{step: string, success: bool, output: string}>}
     */
    public function discardLocalChanges(): array
    {
        $logs = [];

        if (! $this->isGitRepository()) {
            return $this->fail($logs, 'Bukan repository Git.');
        }

        $reset = $this->runGit('reset --hard HEAD');
        $logs[] = $this->logEntry('Git reset', $reset);
        if (! $reset['success']) {
            return $this->result(false, $logs, 'Gagal reset perubahan lokal.');
        }

        $clean = $this->runGit('clean -fd -e public/storage -e storage');
        $logs[] = $this->logEntry('Git clean', $clean);
        if (! $clean['success']) {
            return $this->result(false, $logs, 'Gagal membersihkan file tidak terlacak.');
        }

        return $this->result(true, $logs, 'Perubahan lokal berhasil dibuang (upload di public/storage tetap aman).');
    }

    protected function gitRevParse(string $ref): ?string
    {
        $result = $this->runGit('rev-parse '.escapeshellarg($ref));
        if (! $result['success']) {
            return null;
        }

        $sha = trim($result['output']);

        return $sha !== '' ? $sha : null;
    }

    protected function gitDescribe(string $ref): ?string
    {
        $result = $this->runGit('describe --tags --always '.escapeshellarg($ref));
        if (! $result['success']) {
            return null;
        }

        $label = trim($result['output']);
        if ($label === '') {
            return null;
        }

        return preg_replace('/-g[0-9a-f]+$/i', '', $label);
    }

    protected function commitsBehind(string $branch): int
    {
        $remote = config('deploy.remote', 'origin');
        $result = $this->runGit('rev-list --count HEAD..'.$remote.'/'.$branch);
        if (! $result['success']) {
            return 0;
        }

        return max(0, (int) trim($result['output']));
    }

    /**
     * @return list<array{short_sha: string, subject: string, date: string}>
     */
    protected function pendingCommits(string $branch, int $limit = 15): array
    {
        $remote = config('deploy.remote', 'origin');
        $result = $this->runGit(
            'log HEAD..'.$remote.'/'.$branch.' --pretty=format:%h|%s|%ci -n '.$limit
        );

        if (! $result['success']) {
            return [];
        }

        $commits = [];
        foreach (explode("\n", trim($result['output'])) as $line) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }
            $parts = explode('|', $line, 3);
            if (count($parts) < 2) {
                continue;
            }
            $commits[] = [
                'short_sha' => $parts[0],
                'subject' => $parts[1],
                'date' => $parts[2] ?? '',
            ];
        }

        return $commits;
    }

    protected function buildCompareUrl(string $localSha, string $remoteSha): ?string
    {
        $base = $this->githubCompareBaseUrl();
        if ($base === null) {
            return null;
        }

        return rtrim($base, '/').'/compare/'.$localSha.'...'.$remoteSha;
    }

    protected function githubCompareBaseUrl(): ?string
    {
        $configured = config('deploy.github_compare_base');
        if (is_string($configured) && trim($configured) !== '') {
            return rtrim(trim($configured), '/');
        }

        $remote = config('deploy.remote', 'origin');
        $result = $this->runGit('remote get-url '.$remote);
        if (! $result['success']) {
            return null;
        }

        $url = trim($result['output']);
        if ($url === '') {
            return null;
        }

        if (preg_match('#^git@github\.com:(.+/.+?)(?:\.git)?$#i', $url, $m)) {
            return 'https://github.com/'.$m[1];
        }
        if (preg_match('#^https?://github\.com/(.+?)(?:\.git)?/?$#i', $url, $m)) {
            return 'https://github.com/'.$m[1];
        }

        return null;
    }

    protected function hasReleaseTags(): bool
    {
        $result = $this->runGit('tag -l --sort=-v:refname');

        return $result['success'] && trim($result['output']) !== '';
    }

    /** @return list<string> */
    protected function getTrackedDirtyFiles(): array
    {
        $status = $this->runGit('status --porcelain --untracked-files=no');
        $output = trim($status['output'] ?? '');

        if ($output === '') {
            return [];
        }

        $files = [];
        foreach (explode("\n", $output) as $line) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }
            $parts = preg_split('/\s+/', $line, 2);
            if (isset($parts[1])) {
                $files[] = $parts[1];
            }
        }

        return $files;
    }

    /** @return list<string> */
    protected function getLocalChangePaths(): array
    {
        $status = $this->runGit('status --porcelain');
        $output = trim($status['output'] ?? '');

        if ($output === '') {
            return [];
        }

        $paths = [];
        foreach (explode("\n", $output) as $line) {
            if (strlen($line) < 4) {
                continue;
            }

            $path = trim(substr($line, 3));
            if (str_contains($path, ' -> ')) {
                $path = trim(substr($path, strpos($path, ' -> ') + 4));
            }

            $paths[] = $path;
        }

        return $paths;
    }

    protected function isIgnoredDirtyPath(string $path): bool
    {
        $normalized = str_replace('\\', '/', $path);

        foreach (config('deploy.ignore_dirty_paths', []) as $ignore) {
            $ignore = rtrim(str_replace('\\', '/', (string) $ignore), '/');
            if ($normalized === $ignore || str_starts_with($normalized, $ignore.'/')) {
                return true;
            }
        }

        return false;
    }

    /** @return list<string> */
    protected function getBlockingLocalChangePaths(): array
    {
        return array_values(array_filter(
            $this->getLocalChangePaths(),
            fn (string $path) => ! $this->isIgnoredDirtyPath($path)
        ));
    }

    protected function hasBlockingLocalChanges(): bool
    {
        return $this->getBlockingLocalChangePaths() !== [];
    }

    /** @return list<string> */
    protected function getIgnoredLocalChangePaths(): array
    {
        return array_values(array_filter(
            $this->getLocalChangePaths(),
            fn (string $path) => $this->isIgnoredDirtyPath($path)
        ));
    }

    protected function runGit(string $args): array
    {
        return $this->runShell('git '.$args, $this->basePath);
    }

    protected function runComposerInstall(): array
    {
        $composer = (string) config('deploy.composer_binary', 'composer');

        return $this->runShell(
            escapeshellarg($composer).' install --no-dev --no-interaction --prefer-dist --optimize-autoloader',
            $this->basePath,
            $this->deployProcessEnv(),
        );
    }

    protected function runPhp(string $args): array
    {
        $php = $this->resolvePhpCliBinary();

        return $this->runShell(
            escapeshellarg($php).' artisan '.$args,
            $this->basePath,
            $this->deployProcessEnv(),
        );
    }

    /** @return array<string, string> */
    protected function deployProcessEnv(): array
    {
        return array_filter([
            'COMPOSER_PHP' => $this->resolvePhpCliBinary(),
            'COMPOSER_ALLOW_SUPERUSER' => '1',
        ]);
    }

    protected function resolvePhpCliBinary(): string
    {
        if ($configured = config('deploy.php_binary')) {
            return (string) $configured;
        }

        $binary = PHP_BINARY ?: '';
        if ($binary !== '' && ! str_contains($binary, 'fpm')) {
            return $binary;
        }

        $finder = new PhpExecutableFinder;
        $found = $finder->find(false);
        if (is_string($found) && $found !== '' && ! str_contains($found, 'fpm')) {
            return $found;
        }

        foreach (['php8.4', 'php8.3', 'php8.2', 'php'] as $candidate) {
            $which = trim((string) shell_exec('command -v '.$candidate.' 2>/dev/null'));
            if ($which !== '' && ! str_contains($which, 'fpm')) {
                return $which;
            }
        }

        return 'php';
    }

    protected function runShell(string $command, ?string $cwd = null, array $env = []): array
    {
        $timeout = (int) config('deploy.timeout', 300);

        try {
            $processEnv = $env === [] ? null : array_merge($_ENV, $_SERVER, $env);
            $process = Process::fromShellCommandline($command, $cwd ?? $this->basePath, $processEnv);
            $process->setTimeout($timeout);
            $process->run();

            return [
                'success' => $process->isSuccessful(),
                'output' => trim($process->getOutput()."\n".$process->getErrorOutput()),
                'exit_code' => $process->getExitCode(),
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'output' => $e->getMessage(),
                'exit_code' => -1,
            ];
        }
    }

    protected function logEntry(string $step, array $result): array
    {
        return [
            'step' => $step,
            'success' => $result['success'],
            'output' => $result['output'],
        ];
    }

    protected function fail(array $logs, string $message): array
    {
        return $this->result(false, $logs, $message);
    }

    protected function result(bool $success, array $logs, string $message): array
    {
        return [
            'success' => $success,
            'message' => $message,
            'logs' => $logs,
        ];
    }
}
