"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "@/app/components/loading";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("token", data.token);
      alert("Login successful!");
      router.push("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center min-h-[110vh]">
        <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg p-6 md:p-12 space-y-6 md:space-y-0 md:space-x-8">

            <div className="hidden md:block">
            <img
                src="images/shop.png"
                alt="Illustration"
                className="w-[500px] h-auto"
            />
            </div>

            {/* Form Section */}
            <div className="w-full max-w-[400px]">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Lets Start Shopping</h1>
            <p className="text-gray-600 mb-6">Please login or sign up to continue</p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded"
            />

            {/* Password Input */}
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded"
            />

            {/* Login Button */}
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-3 rounded flex justify-center items-center font-medium transition ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-gray-700"
                }`}>
                {isLoading ? <Loading /> : "Log In"}

            </button>
            </form>

            <p className="text-gray-600 text-center mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-red-500 hover:underline">
                Sign Up
            </Link>
            </p>
        </div>
        </div>
        </div>
    </div>
  );
}
