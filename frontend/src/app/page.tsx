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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
        NOVA
      </h1>
      <h2 className="text-2xl font-medium text-gray-600 mb-8">
        Team Productivity Platform
      </h2>
      <p className="text-lg text-gray-500 mb-12">Plan. Collaborate. Deliver.</p>
      
      <div className="flex space-x-4">
        <Link 
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Log In
        </Link>
        <Link 
          href="/register"
          className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
