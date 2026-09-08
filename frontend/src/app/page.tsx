"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-center px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
      </div>

      <div className="z-10 bg-white/10 backdrop-blur-lg p-12 rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full">
        <h1 className="text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md">
          NOVA
        </h1>
        <h2 className="text-3xl font-medium text-blue-100 mb-8">
          Team Productivity Platform
        </h2>
        <p className="text-xl text-blue-50/80 mb-12 font-light">
          Plan. Collaborate. Deliver.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
          <Link 
            href="/login"
            className="px-8 py-4 bg-white text-blue-900 rounded-xl font-bold hover:bg-blue-50 hover:scale-105 transition-all shadow-lg"
          >
            Log In
          </Link>
          <Link 
            href="/register"
            className="px-8 py-4 bg-transparent text-white border-2 border-white/50 rounded-xl font-bold hover:bg-white/10 hover:border-white hover:scale-105 transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
