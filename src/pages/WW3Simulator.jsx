import { useState } from 'react';
import SubPageLayout from '../components/SubPageLayout';

function WW3Simulator() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <SubPageLayout title="WW3 Simulator" titleClass="text-emerald-300" badge="Python / OOP Project">
            <div className="relative flex-1 min-h-[calc(100vh-56px)]">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-400">Loading game...</p>
                        </div>
                    </div>
                )}

                <iframe
                    src="/ww3/index.html"
                    className="w-full h-[calc(100vh-56px)] border-0"
                    title="WW3 Simulator - Turn-based Strategy Game"
                    onLoad={() => setIsLoading(false)}
                />
            </div>
        </SubPageLayout>
    );
}

export default WW3Simulator;