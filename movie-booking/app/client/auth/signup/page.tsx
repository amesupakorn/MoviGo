"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/loading";
import Link from "next/link";


export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Signup successful! Redirecting to login...");
      router.push("/client/auth/login");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
    <div className="flex justify-center items-center min-h-[100vh]">
    <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg p-4  space-y-6 md:space-y-2 md:space-x-6">

        <div className="hidden md:block ">
            <img
                src="/image/login.jpg"
                className="w-[610px] h-[500px]"
                alt="login"
            />
        </div>
        {/* Form Section */}
        <div className="w-full max-w-[400px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign Up</h1>
          <p className="text-gray-600 mb-6">Create your account</p>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="relative">
              <input
                type="text"
                name="username"
                value={form.name}
                onChange={handleChange}
                placeholder="Username"
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <div className="absolute inset-y-0 left-4 flex items-center">
                <svg
                  className="h-6 w-6 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <div className="absolute inset-y-0 left-4 flex items-center">
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <div className="absolute inset-y-0 left-4 flex items-center">
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <div className="absolute inset-y-0 left-4 flex items-center">
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-3xl font-medium transition flex items-center justify-center ${
                  isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-gray-700"
              }`}
            >
              {isLoading ? (  <Loading /> ) : ( "Sign Up" )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-gray-500 text-center mt-4">
            Already have an account?{" "}
            <Link href="login" className="text-gray-800 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
