import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const Login = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      nav("/");
    } catch (err) {
      setError(err?.message || "Login failed");
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">
      {" "}
      <form
        onSubmit={submit}
        className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6 w-full max-w-md"
      >
        {" "}
        <h1 className="text-2xl font-bold mb-4 tracking-tight">Login</h1>{" "}
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />{" "}
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />{" "}
        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}{" "}
        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white rounded-md px-3 py-2 hover:bg-indigo-700 active:scale-[0.98] transition-all"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>{" "}
        <p className="text-sm text-gray-600 mt-3">
          No account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:text-indigo-700">
            Create one
          </Link>
        </p>{" "}
      </form>{" "}
    </div>
  );
};
export default Login;
