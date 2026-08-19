import { useState } from "react";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import api from "../api/axios";
export default function Login({ onNavigate, setIsLoggedIn, setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post("/api/auth/login", {
      email: formData.email,
      password: formData.password,
    });

    console.log("Login successful:", response.data);

    if (response.data.user) {
      setUser(response.data.user);
    }

    setIsLoggedIn(true);
    onNavigate("dashboard");
  } catch (error) {
    console.error("Login error:", error);

    const message =
      error.response?.data?.message ||
      "Login failed. Please try again.";

    alert(message);
  }
};

  return (
    <div className="min-h-screen bg-snitch-dark flex flex-col md:flex-row">
      {/* Left side branding/image */}
      <div className="hidden md:flex md:w-1/2 bg-snitch-darker border-r border-snitch-border flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-snitch-gold/5 via-snitch-darker to-snitch-darker"></div>
        <div className="z-10 text-center max-w-md">
          <h2 className="text-4xl font-bold text-gray-100 mb-6 tracking-widest uppercase">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Sign in to access your dashboard, review past solutions, and continue your journey in the Arena.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-24 relative">
        <button
          onClick={() => onNavigate("dashboard")}
          className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center text-gray-400 hover:text-snitch-gold transition-colors duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-center md:text-left mt-12 md:mt-0">
            <h1 className="text-3xl font-bold text-gray-100 mb-3 tracking-wide">
              Sign In
            </h1>
            <p className="text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={() => onNavigate("register")}
                className="text-snitch-gold hover:text-snitch-gold-hover transition-colors font-medium"
              >
                Register now
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400 block ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-snitch-gray border border-snitch-border rounded-lg py-3 pl-12 pr-4 text-gray-200 focus:outline-none focus:border-snitch-gold focus:ring-1 focus:ring-snitch-gold transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-gray-400">Password</label>
                <button type="button" className="text-xs text-snitch-gold hover:text-snitch-gold-hover transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-snitch-gray border border-snitch-border rounded-lg py-3 pl-12 pr-4 text-gray-200 focus:outline-none focus:border-snitch-gold focus:ring-1 focus:ring-snitch-gold transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-snitch-gold hover:bg-snitch-gold-hover text-snitch-darker font-bold py-3.5 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] mt-8"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
