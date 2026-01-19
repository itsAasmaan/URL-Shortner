import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  title?: string;
}

const ErrorMessage = ({ message, onRetry, title = "Error! Something went wrong" }: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-200 blur-2xl opacity-30 rounded-full" />
        <div className="relative bg-white border border-red-100 shadow-sm rounded-2xl p-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-gray-500 mb-8 text-center max-w-sm leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="group flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-all active:scale-95 shadow-lg shadow-gray-200"
        >
          <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
