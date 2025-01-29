"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ✅ ตรวจสอบว่ารหัสผ่านกับ Confirm Password ตรงกัน
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password, // ✅ ส่งเฉพาะ password ที่ต้องใช้
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

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded"/>
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded"/>
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded"/>
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded"/>
        <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400">
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
