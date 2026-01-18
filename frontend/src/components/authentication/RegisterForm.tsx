import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, UserPlus, Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const registerSchema = z
  .object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegistrationFormData = z.infer<typeof registerSchema>;

const RegistrationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data.email, data.password);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-500 mt-2">Start shortening and tracking your links</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all duration-200 
                  ${errors.email 
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
                    : "border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                  }`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all duration-200 
                  ${errors.password 
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
                    : "border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                  }`}
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
              Confirm Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <ShieldCheck className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all duration-200 
                  ${errors.confirmPassword 
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
                    : "border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                  }`}
                disabled={isLoading}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-200 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center space-x-2 mt-8"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <p className="text-slate-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold decoration-2 underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;