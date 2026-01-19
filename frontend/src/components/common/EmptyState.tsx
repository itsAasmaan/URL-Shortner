import { Link2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  icon?: React.ReactNode;
}

const EmptyState = ({ title, description, actionLabel, actionLink = "/", icon }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gray-100 rounded-full p-6 mb-6">{icon || <Link2 className="w-16 h-16 text-gray-400" />}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 text-center max-w-md">{description}</p>
      {actionLabel && (
        <Link to={actionLink} className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
