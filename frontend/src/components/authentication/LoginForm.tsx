import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Container Card */}
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
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
                placeholder="name@company.com"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all duration-200 
                  ${errors.email 
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
                    : "border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                  }`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between mb-1.5 ml-1">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-xs font-bold text-primary-600 hover:text-primary-700">
                Forgot password?
              </Link>
            </div>
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
              <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">
                {errors.password.message}
              </p>
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
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <p className="text-slate-500 text-sm">
            Don't have an account yet?{" "}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold decoration-2 underline-offset-4 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;