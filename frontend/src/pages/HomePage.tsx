import { useState } from "react";
import Layout from "../components/layout/Layout";
import URLForm from "../components/url/URLForm";
import URLResult from "../components/url/URLResult";
import type { CreateURLResponse } from "../types";
import { Zap, Shield, BarChart3, ArrowRight } from "lucide-react";

const HomePage = () => {
  const [result, setResult] = useState<CreateURLResponse | null>(null);

  const handleSuccess = (data: CreateURLResponse) => {
    setResult(data);
  };

  return (
    <Layout>
      <section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-150 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary-50/50 via-white to-transparent -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Shorten Your URLs
              <span className="block text-primary-600 drop-shadow-sm"> Instantly.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Build and protect your brand using powerful, short links. Track performance with real-time analytics and
              custom management.
            </p>
          </div>
          <div className="relative max-w-3xl mx-auto z-10">
            <div className="p-2 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-primary-200/50 border border-white">
              <URLForm onSuccess={handleSuccess} />
            </div>
          </div>
          {result && (
            <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <URLResult data={result} />
            </div>
          )}
        </div>
      </section>

      {/* Stats Section (Floating Design) */}
      <section className="bg-white relative -mt-12 z-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-slate-200 p-px rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-white py-8 text-center group">
              <div className="text-3xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                1M+
              </div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">URLs Shortened</div>
            </div>
            <div className="bg-white py-8 text-center group">
              <div className="text-3xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                50M+
              </div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Clicks Tracked</div>
            </div>
            <div className="bg-white py-8 text-center group">
              <div className="text-3xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                99.9%
              </div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Uptime Rate</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base font-bold text-primary-600 tracking-overline uppercase mb-3">Powerful Features</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Everything you need to manage links</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-indigo-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-indigo-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h4>
              <p className="text-slate-600 leading-relaxed">
                Experience instant redirection worldwide. Our global edge network ensures your links resolve in
                milliseconds.
              </p>
            </div>
            <div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-emerald-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-emerald-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Secure & Private</h4>
              <p className="text-slate-600 leading-relaxed">
                Advanced rate-limiting and link scanning keep your audience safe from phishing and malicious redirects.
              </p>
            </div>
            <div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-violet-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-violet-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Advanced Insights</h4>
              <p className="text-slate-600 leading-relaxed">
                Get granular data on your traffic, including geographic locations, device types, and top referral
                sources.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
              Ready to optimize your links?
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto relative z-10">
              Join thousands of users and start creating shorter, smarter links today.
            </p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-bold text-lg inline-flex items-center space-x-2 transition-all hover:shadow-lg hover:shadow-primary-500/30 active:scale-95 relative z-10">
              <span>Get Started for Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
