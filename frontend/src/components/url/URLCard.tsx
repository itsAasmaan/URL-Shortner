import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Copy, Check, BarChart3, Trash2, MoreVertical, Calendar, MousePointerClick } from "lucide-react";
import type { URL } from "../../types";
import { useDeleteURL } from "../../hooks/useURLs";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

interface URLCardProps {
  url: URL;
}

const URLCard = ({ url }: URLCardProps) => {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteURL = useDeleteURL();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url.shortUrl);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleDelete = () => {
    deleteURL.mutate(url.shortCode);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 relative">
      <div className="absolute top-4 right-4">
        <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            <Link
              to={`/analytics/${url.shortCode}`}
              className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors"
              onClick={() => setShowMenu(false)}
            >
              <BarChart3 className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">View Analytics</span>
            </Link>
            <button
              onClick={() => {
                setShowDeleteConfirm(true);
                setShowMenu(false);
              }}
              className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600">Delete URL</span>
            </button>
          </div>
        )}
      </div>
      <div className="mb-4 pr-8">
        <div className="flex items-start justify-between mb-2">
          <a
            href={url.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 font-medium text-lg break-all"
          >
            {url.shortUrl}
          </a>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
          <ExternalLink className="w-4 h-4 shrink-0" />
          <span className="truncate">{url.originalUrl}</span>
        </div>
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDistanceToNow(new Date(url.createdAt), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MousePointerClick className="w-3 h-3" />
            <span>{url.totalClicks || 0} clicks</span>
          </div>
        </div>
        {url.expiresAt && new Date(url.expiresAt) > new Date() && (
          <div className="mt-2 text-xs text-orange-600 flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Expires {formatDistanceToNow(new Date(url.expiresAt), { addSuffix: true })}</span>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
        <button
          onClick={copyToClipboard}
          className="flex-1 btn-secondary py-2 flex items-center justify-center space-x-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
        <Link
          to={`/analytics/${url.shortCode}`}
          className="flex-1 btn-primary py-2 flex items-center justify-center space-x-2"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Stats</span>
        </Link>
      </div>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete URL?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this shortened URL? This action cannot be undone.
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn-secondary"
                disabled={deleteURL.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={deleteURL.isPending}
              >
                {deleteURL.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default URLCard;
