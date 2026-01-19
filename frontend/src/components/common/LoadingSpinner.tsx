interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const LoadingSpinner = ({ size = "md", text, className = "" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-16 w-16 border-[6px]",
  };

  return (
    <>
      <div
        className={`flex flex-col items-center justify-center gap-3 ${className}`}
        role="status"
        aria-label="loading"
      >
        <div className={`animate-spin rounded-full border-gray-200 border-t-blue-600 ${sizeClasses[size]}`}>
          {text && <span className="text-gray-500 text-sm font-medium animate-pulse">{text}</span>}
        </div>
      </div>
    </>
  );
};

export default LoadingSpinner;
