import { useState } from "react";
import { Copy, Check, ExternalLink, QrCode, BarChart3, PartyPopper } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import type { CreateURLResponse } from "../../types";

interface URLResultProps {
  data: CreateURLResponse;
}

const URLResult = ({ data }: URLResultProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(data.shortUrl);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        <div className="bg-emerald-50 px-6 py-3 flex items-center space-x-2">
          <PartyPopper className="w-5 h-5 text-emerald-600" />
          <p className="text-sm font-bold text-emerald-700">Your link is ready and live!</p>
        </div>

        <div className="p-8">
          <div className="relative group mb-8">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
              Shortened URL
            </label>
            <div className="flex items-center p-1 bg-slate-50 border border-slate-200 rounded-2xl group-hover:border-primary-300 transition-colors">
              <div className="flex-1 px-4 py-3 font-mono text-lg font-bold text-slate-900 truncate">
                {data.shortUrl}
              </div>
              <button
                onClick={copyToClipboard}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  copied
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                    : "bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-200 active:scale-95"
                }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-t border-slate-100">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                Original Destination
              </label>
              <a
                href={data.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 text-slate-600 hover:text-primary-600 transition-colors"
              >
                <span className="text-sm font-medium truncate max-w-50">{data.originalUrl}</span>
                <ExternalLink className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Short Code</label>
                <span className="text-sm font-mono font-bold text-slate-700">{data.shortCode}</span>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Created</label>
                <span className="text-sm font-semibold text-slate-700">
                  {new Date(data.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          {data.expiresAt && (
            <div className="mt-4 flex items-center justify-center space-x-2 bg-amber-50 py-2 rounded-xl text-xs font-bold text-amber-700 border border-amber-100">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span>Link expires on {new Date(data.expiresAt).toLocaleString()}</span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100">
            <Link
              to={`/analytics/${data.shortCode}`}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-bold transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Performance Analytics</span>
            </Link>

            <button className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl font-bold transition-all">
              <QrCode className="w-4 h-4" />
              <span>Get QR Code</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLResult;
