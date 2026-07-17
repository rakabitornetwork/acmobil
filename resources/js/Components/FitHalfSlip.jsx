import { useLayoutEffect, useRef } from 'react';

/**
 * Fit slip into one half-A4 area by scaling uniformly (no horizontal squash).
 */
export default function FitHalfSlip({ children }) {
    const hostRef = useRef(null);
    const slipRef = useRef(null);

    useLayoutEffect(() => {
        const fit = () => {
            const host = hostRef.current;
            const slip = slipRef.current;
            if (!host || !slip) return;

            slip.style.transform = 'none';
            slip.style.width = '100%';
            slip.style.maxWidth = '100%';

            const available = host.clientHeight;
            const needed = slip.scrollHeight;
            if (needed <= available || available <= 0) return;

            // Scale uniformly from top-center so column widths stay proportional
            const scale = Math.max(0.58, available / needed);
            slip.style.transformOrigin = 'top center';
            slip.style.transform = `scale(${scale})`;
            // Keep layout width at 100% — do NOT widen, which crushed table columns
            slip.style.width = '100%';
        };

        fit();
        const id = requestAnimationFrame(fit);
        const t = setTimeout(fit, 50);
        window.addEventListener('resize', fit);
        return () => {
            cancelAnimationFrame(id);
            clearTimeout(t);
            window.removeEventListener('resize', fit);
        };
    }, [children]);

    return (
        <div className="spk-fit-host" ref={hostRef}>
            <div className="spk-slip" ref={slipRef}>
                {children}
            </div>
        </div>
    );
}
