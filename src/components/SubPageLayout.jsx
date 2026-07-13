import { Link } from 'react-router-dom';

function SubPageLayout({ title, titleClass = 'text-cyan-300', badge, children, action }) {
    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-purple-900/50 px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <Link
                        to="/"
                        className="shrink-0 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5"
                    >
                        ← <span className="hidden sm:inline">Back to</span> Home
                    </Link>
                    <span className={`text-base sm:text-lg font-semibold truncate ${titleClass}`}>
                        {title}
                    </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {badge && (
                        <span className="hidden sm:block text-xs text-gray-500">{badge}</span>
                    )}
                    {action}
                </div>
            </header>
            <main className="flex-1 pt-14">
                {children}
            </main>
        </div>
    );
}

export default SubPageLayout;