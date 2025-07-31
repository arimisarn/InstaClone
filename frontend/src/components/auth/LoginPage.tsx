import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../ui/toast";

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
        <div className="fixed bottom-5 right-5 z-50">
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
        </div>
      )}

      {/* Page */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-6 border border-gray-200 dark:border-gray-800">
          {/* Logo / Titre */}
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-bold text-indigo-600">Tsinjool</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connectez-vous pour continuer
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Nom d'utilisateur"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white placeholder-gray-400"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          {/* Lien inscription */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Vous n’avez pas encore de compte ?{" "}
            <Link
              to="/register"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              S’inscrire
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
