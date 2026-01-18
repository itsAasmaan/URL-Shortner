import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Link2, Sparkles, Clock, Loader2, ChevronDown, ChevronUp, Hash } from "lucide-react";
import toast from "react-hot-toast";
import urlService from "../../services/urlService";
import type { URLFormData } from "../../types";

const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL (include http:// or https://)"),
  customAlias: z
    .string()
    .regex(/^[a-zA-Z0-9]*$/, "Only letters and numbers allowed")
    .min(3, "Must be at least 3 characters")
    .max(20, "Must be at most 20 characters")
    .optional()
    .or(z.literal("")),
  expiresIn: z.string().optional(),
});

interface URLFormProps {
  onSuccess: (data: any) => void;
}

const URLForm = ({ onSuccess }: URLFormProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<URLFormData>({
    resolver: zodResolver(urlSchema),
  });

  const createURLMutation = useMutation({
    mutationFn: (data: any) => urlService.createURL(data),
    onSuccess: (data) => {
      toast.success("URL shortened successfully!");
      onSuccess(data);
      reset();
      setShowAdvanced(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to shorten URL");
    },
  });

  const onSubmit = (data: URLFormData) => {
    const payload: any = { url: data.url };
    if (data.customAlias) payload.customAlias = data.customAlias;
    if (data.expiresIn) {
      const expiryMap: { [key: string]: number } = {
        "1hour": 3600,
        "1day": 86400,
        "7days": 604800,
        "30days": 2592000,
      };
      payload.expiresIn = expiryMap[data.expiresIn];
    }
    createURLMutation.mutate(payload);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Link2 className="h-6 w-6 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            {...register("url")}
            type="text"
            placeholder="Paste your long link here..."
            className={`w-full pl-12 pr-32 py-5 bg-white border-2 rounded-2xl outline-none transition-all text-lg shadow-sm
              ${errors.url 
                ? "border-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-50" 
                : "border-slate-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
              }`}
            disabled={createURLMutation.isPending}
          />
          <div className="absolute inset-y-2 right-2">
            <button
              type="submit"
              disabled={createURLMutation.isPending}
              className="h-full px-6 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-xl transition-all flex items-center space-x-2 shadow-md shadow-primary-200 active:scale-95"
            >
              {createURLMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Shorten</span>
                </>
              )}
            </button>
          </div>
        </div>
        {errors.url && <p className="text-sm font-medium text-red-500 ml-2">{errors.url.message}</p>}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors py-2 px-4 rounded-full hover:bg-slate-100"
          >
            <span>{showAdvanced ? "Hide" : "Show"} Advanced Settings</span>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        {showAdvanced && (
          <div className="p-6 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-2 text-sm font-bold text-slate-700 mb-2">
                  <Hash className="w-4 h-4 text-primary-500" />
                  <span>Custom Alias</span>
                </label>
                <input
                  {...register("customAlias")}
                  type="text"
                  placeholder="e.g. summer-sale"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                  disabled={createURLMutation.isPending}
                />
                {errors.customAlias && <p className="mt-1 text-xs text-red-500 font-medium">{errors.customAlias.message}</p>}
              </div>

              {/* Expiry Selector */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-bold text-slate-700 mb-2">
                  <Clock className="w-4 h-4 text-primary-500" />
                  <span>Expiration</span>
                </label>
                <select 
                  {...register("expiresIn")} 
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all appearance-none"
                  disabled={createURLMutation.isPending}
                >
                  <option value="">Never Expires</option>
                  <option value="1hour">1 Hour</option>
                  <option value="1day">1 Day</option>
                  <option value="7days">7 Days</option>
                  <option value="30days">30 Days</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default URLForm;