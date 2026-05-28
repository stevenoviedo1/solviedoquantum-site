import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 text-center">
            <div className="max-w-md">
                <h1 className="text-[120px] md:text-[160px] font-bold leading-none bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                    404
                </h1>
                
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                    Page Not Found
                </h2>
                
                <p className="text-xl text-gray-400 mb-10">
                    Looks like you drifted into the quantum void. This page doesn't exist.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        to="/" 
                        className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full hover:scale-105 transition"
                    >
                        Return to Homepage
                    </Link>
                    
                    <a 
                        href="#portfolio" 
                        onClick={() => window.location.href = '/#portfolio'}
                        className="px-8 py-4 text-lg font-semibold border border-purple-700 hover:bg-purple-900/30 rounded-full transition"
                    >
                        View Portfolio
                    </a>
                </div>

                <p className="mt-12 text-sm text-gray-500">
                    Or contact me directly at{' '}
                    <a href="mailto:Steven.oviedo1@gmail.com" className="text-cyan-400 hover:underline">
                        Steven.oviedo1@gmail.com
                    </a>
                </p>
            </div>
        </div>
    );
}

export default NotFound;
