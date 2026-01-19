interface SkeletonLoaderProps {
  count?: number;
}

const SkeletonCard = () => (
  <div className="card animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-8 w-8 bg-gray-200 rounded"></div>
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <div className="h-3 bg-gray-200 rounded w-24"></div>
      <div className="h-3 bg-gray-200 rounded w-32"></div>
    </div>
  </div>
);

const SkeletonLoader = ({ count = 3 }: SkeletonLoaderProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
