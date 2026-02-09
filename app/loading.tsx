export default function Loading() {
    return (
        <div className="flex flex-col w-full min-h-screen">
            {/* Hero Skeleton */}
            <div className="w-full h-[300px] md:h-[400px] bg-slate-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-slate-100 via-slate-50 to-slate-100 animate-[shimmer_2s_infinite]" />
                <div className="container mx-auto px-4 relative z-10 text-center space-y-4">
                    <div className="h-12 w-2/3 md:w-1/3 rounded-2xl mx-auto skeleton" />
                    <div className="h-6 w-3/4 md:w-1/2 rounded-xl mx-auto skeleton" />
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col h-[480px]">
                            <div className="h-60 relative overflow-hidden skeleton" />
                            <div className="p-6 flex flex-col flex-1 space-y-6">
                                <div className="space-y-3">
                                    <div className="h-6 w-3/4 rounded-lg skeleton" />
                                    <div className="h-4 w-full rounded-md skeleton" />
                                    <div className="h-4 w-2/3 rounded-md skeleton" />
                                </div>
                                <div className="mt-auto pt-6 border-t border-slate-50 flex gap-4">
                                    <div className="h-4 w-12 rounded-full skeleton" />
                                    <div className="h-4 w-12 rounded-full skeleton" />
                                </div>
                                <div className="h-12 w-full rounded-xl skeleton" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
