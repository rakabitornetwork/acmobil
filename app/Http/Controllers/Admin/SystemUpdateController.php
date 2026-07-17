<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\GitDeployService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SystemUpdateController extends Controller
{
    public function index(GitDeployService $deploy): Response
    {
        return Inertia::render('Admin/SystemUpdate/Index', [
            'status' => fn () => $deploy->getStatus(),
            'config' => fn () => [
                'enabled' => (bool) config('deploy.enabled'),
                'branch' => config('deploy.branch', 'main'),
                'remote' => config('deploy.remote'),
                'repo' => 'https://github.com/rakabitornetwork/acmobil',
            ],
        ]);
    }

    public function deploy(Request $request, GitDeployService $deploy)
    {
        if (! config('deploy.enabled')) {
            return back()->with('error', 'Fitur update GitHub belum diaktifkan. Set DEPLOY_GITHUB_ENABLED=true di file .env');
        }

        $request->validate([
            'confirm' => 'accepted',
            'run_composer' => 'boolean',
            'run_migrate' => 'boolean',
            'run_npm' => 'boolean',
            'run_optimize' => 'boolean',
        ]);

        $result = $deploy->deploy([
            'composer' => $request->boolean('run_composer', true),
            'migrate' => $request->boolean('run_migrate', true),
            'npm' => $request->boolean('run_npm', false),
            'optimize' => $request->boolean('run_optimize', true),
        ]);

        if ($result['success']) {
            return back()->with([
                'success' => $result['message'],
                'deploy_logs' => $result['logs'],
            ]);
        }

        return back()->with([
            'error' => $result['message'],
            'deploy_logs' => $result['logs'],
        ]);
    }

    public function discardChanges(GitDeployService $deploy)
    {
        if (! config('deploy.enabled')) {
            return back()->with('error', 'Fitur update GitHub belum diaktifkan.');
        }

        $result = $deploy->discardLocalChanges();

        if ($result['success']) {
            return back()->with([
                'success' => $result['message'],
                'deploy_logs' => $result['logs'],
            ]);
        }

        return back()->with([
            'error' => $result['message'],
            'deploy_logs' => $result['logs'],
        ]);
    }
}
