// Admin Login - /admin-login
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

// Hardcoded credentials — checked purely client-side
const ADMIN_EMAIL = "admin@khareef.com";
const ADMIN_PASSWORD = "123456";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    try {
      if (sessionStorage.getItem("khareef_admin_authed") === "true") {
        router.replace("/admin-dashboard");
      }
    } catch {}
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);

    // Small timeout to show loading state
    setTimeout(() => {
      if (trimmedEmail === ADMIN_EMAIL && trimmedPassword === ADMIN_PASSWORD) {
        try {
          sessionStorage.setItem("khareef_admin_authed", "true");
        } catch {}
        router.replace("/admin-dashboard");
      } else {
        setError("Invalid email or password");
        setLoading(false);
      }
    }, 300);
  };

  return (
    <>
      <Head>
        <title>Admin Login | Khareef</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "var(--color-bg)" }}
      >
        <div
          className="relative w-full max-w-sm p-8 rounded-3xl"
          style={{
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(201,168,76,0.12)" }}
            >
              <span
                className="text-2xl font-display font-bold"
                style={{ color: "var(--color-gold)" }}
              >
                K
              </span>
            </div>
            <h1
              className="text-xl font-display font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Admin Login
            </h1>
            <p
              className="text-sm mt-1 opacity-50"
              style={{ color: "var(--color-text)" }}
            >
              Khareef Dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5 opacity-70"
                style={{ color: "var(--color-text)" }}
              >
                Email
              </label>
              <div className="relative">
                <FiMail
                  className="absolute top-1/2 -translate-y-1/2 start-3 opacity-40"
                  size={16}
                  style={{ color: "var(--color-text)" }}
                />
                <input
                  type="email"
                  className="input-field ps-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@khareef.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5 opacity-70"
                style={{ color: "var(--color-text)" }}
              >
                Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute top-1/2 -translate-y-1/2 start-3 opacity-40"
                  size={16}
                  style={{ color: "var(--color-text)" }}
                />
                <input
                  type={showPass ? "text" : "password"}
                  className="input-field ps-9 pe-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute top-1/2 -translate-y-1/2 end-3 opacity-40 hover:opacity-70"
                  style={{ color: "var(--color-text)" }}
                >
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="p-3 rounded-xl text-sm font-medium"
                style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p
            className="text-center text-xs opacity-30 mt-6"
            style={{ color: "var(--color-text)" }}
          >
            Authorized personnel only
          </p>
        </div>
      </div>
    </>
  );
}
