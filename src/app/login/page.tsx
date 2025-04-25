"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function LogInPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const onLogIn = async () => {
        if (!user.email || !user.password) {
            toast.error("Both fields are required!");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            toast.success("Login success");
            router.push("/profile");
        } catch (error: any) {
            toast.error(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000A_1px,transparent_1px),linear-gradient(to_bottom,#0000000A_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            <div className="relative w-full max-w-[420px] bg-white rounded-[32px] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100">
                <div className="relative p-8 sm:p-12">
                    {/* Logo and Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl font-bold text-white">AF</span>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold mb-2 text-gray-900">
                            AgriFlow
                        </h1>
                        <p className="text-gray-600">Access your dashboard</p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 outline-none transition-all duration-200 
                                                group-hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                                                placeholder:text-gray-400"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    value={user.password}
                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 outline-none transition-all duration-200 
                                                group-hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                                                placeholder:text-gray-400"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        <button
                            onClick={onLogIn}
                            disabled={loading}
                            className="relative w-full h-[56px] bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-200 
                                        hover:opacity-90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
                                        hover:shadow-[0_8px_30px_rgb(37,99,235,0.2)] group overflow-hidden"
                        >
                            <div className="absolute inset-0 w-full h-full transition-all duration-300 scale-0 group-hover:scale-100">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                            </div>
                            <span className="relative">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    "Sign in to account"
                                )}
                            </span>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <a
                            href="#"
                            className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                            Forgot your password?
                        </a>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <p className="text-sm text-blue-500 mb-1">
                                AgriFlow © 2024
                            </p>
                            <a 
                                href="https://www.agriflow.bt" 
                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                            >
                                www.agriflow.bt
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}