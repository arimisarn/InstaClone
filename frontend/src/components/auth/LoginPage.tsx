import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../ui/toast";
import { motion } from "framer-motion";

export default function LoginPage() {
  useEffect(() => {
    document.title = "Tsinjool - Connexion";
  }, []);

  const navigate = useNavigate();
  const { toast, open, setOpen, title, description } = useToast();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https:/instaclone-oise.onrender.com/api/login/",
        formData
      );
      const token = response.data.token;
      localStorage.setItem("token", token);

      toast({ title: "Succès", description: "Connexion réussie !" });
      setTimeout(() => {
        setOpen(false);
        navigate("/dashboard");
      }, 1500);
    } catch (error: any) {
      const msg =
        error?.response?.data?.non_field_errors?.[0] ||
        error?.response?.data?.detail ||
        "Nom d'utilisateur ou mot de passe incorrect.";
      toast({ title: "Erreur", description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-5 right-5 z-50"
        >
          <div className="bg-gray-800 text-white p-4 rounded-md shadow-lg max-w-sm">
            <h3 className="font-bold">{title}</h3>
            {description && <p className="mt-1 text-sm">{description}</p>}
            <button
              className="mt-2 text-xs underline"
              onClick={() => setOpen(false)}
            >
              Fermer
            </button>
          </div>
        </motion.div>
      )}

      {/* Page */}
      <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center px-4 py-12 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl bg-white rounded-2xl shadow-lg border border-[#ddd7ce] flex flex-col md:flex-row overflow-hidden"
        >
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8">
            <h1 className="text-4xl font-serif text-center text-[#6b7a50] mb-6">
              My account
            </h1>

            {/* Onglets */}
            <div className="flex justify-center gap-4 mb-8">
              <button className="px-6 py-2 rounded-md bg-[#6b7a50] text-white font-medium">
                Login
              </button>
              <Link
                to="/register"
                className="px-6 py-2 rounded-md border border-[#6b7a50] text-[#6b7a50] hover:bg-[#6b7a50] hover:text-white transition"
              >
                Register
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-1 text-sm font-medium text-[#6b7a50]">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Entrez votre nom"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#ddd7ce] rounded-md focus:outline-none focus:border-[#6b7a50] focus:ring-1 focus:ring-[#6b7a50]"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-[#6b7a50]">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#ddd7ce] rounded-md focus:outline-none focus:border-[#6b7a50] focus:ring-1 focus:ring-[#6b7a50]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b7a50]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#c6a664] hover:bg-[#b59555] text-white font-medium rounded-md transition"
                disabled={loading}
              >
                {loading ? "Connexion..." : "Login"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="text-[#6b7a50] hover:underline font-medium"
              >
                S’inscrire
              </Link>
            </p>
          </div>

          {/* Image Section */}
          <div className="hidden md:block w-1/2">
            {/* <img
              src="/images/login-side.jpg"
              alt="Login visual"
              className="w-full h-full object-cover"
            /> */}
          </div>
        </motion.div>
      </div>
    </>
  );
}
