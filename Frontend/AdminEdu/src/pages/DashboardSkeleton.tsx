export const DashboardSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div className="h-40 bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="h-52 bg-gray-200 rounded-xl" />
            ))}
        </div>
        <div className="h-32 bg-gray-200 rounded-xl" />
    </div>
);