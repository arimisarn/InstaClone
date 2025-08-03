import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Sparkles, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner"; // ✅ HeroUI Sonner
import { Scene3D } from "../clients/3d-scene";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading3D, setIsLoading3D] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    document.title = "Fampita - Connexion";
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading3D(false);
      setTimeout(() => setShowForm(true), 500);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://instaclone-oise.onrender.com/api/login/",
        formData
      );
      const token = response.data.token;
      localStorage.setItem("token", token);

      toast.success("Connexion réussie !");
      setTimeout(() => {
        navigate("/accueil");
      }, 1200);
    } catch (error: any) {
      const msg =
        error?.response?.data?.non_field_errors?.[0] ||
        error?.response?.data?.detail ||
        "Nom d'utilisateur ou mot de passe incorrect.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-slate-900 dark:to-blue-900 relative overflow-hidden flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Section gauche : chargement/placeholder 3D */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-xl border border-slate-700/50 flex items-center justify-center"
          >
            {isLoading3D ? (
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-400 rounded-full mx-auto"
                />
                <h3 className="text-2xl font-bold text-white">
                  Chargement de l'expérience
                </h3>
                <p className="text-slate-400">
                  Préparation de votre environnement immersif...
                </p>
              </div>
            ) : (
              <div className="w-full h-full relative">
                <motion.div
                  key="3d-scene"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-full"
                >
                  <Scene3D />
                </motion.div>
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50"
                  >
                    <h3 className="text-xl font-bold text-white mb-2">
                      Votre Univers Personnel
                    </h3>
                    <p className="text-slate-300 text-sm">
                      Créez votre avatar et explorez un monde social en 3D où
                      chaque interaction prend vie.
                    </p>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Section formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white dark:bg-gray-900 backdrop-blur-2xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <AnimatePresence mode="wait">
                {!showForm ? (
                  <motion.div
                    key="form-skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-4">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl mx-auto flex items-center justify-center"
                      >
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Initialisation...
                        </h2>
                        <p className="text-slate-400">
                          Préparation de votre interface de connexion
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="actual-form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {/* Titre */}
                    <div className="text-center space-y-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl mx-auto flex items-center justify-center shadow-2xl"
                      >
                        <Sparkles className="w-8 h-8 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-300 bg-clip-text text-transparent">
                          Connexion
                        </h2>
                        <p className="text-slate-400">
                          Accédez à votre univers social 3D
                        </p>
                      </div>
                    </div>

                    {/* Champs */}
                    <div className="space-y-4">
                      {/* Username */}
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                          Nom d'utilisateur
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full px-4 py-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300"
                          placeholder="Votre nom d'utilisateur"
                          required
                        />
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mot de passe
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-4 pr-12 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300"
                            placeholder="Votre mot de passe"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-400"
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bouton */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-2xl font-medium transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Connexion en cours...</span>
                        </div>
                      ) : (
                        "Se connecter"
                      )}
                    </motion.button>

                    {/* Lien inscription */}
                    <p className="text-center text-sm text-slate-400">
                      Nouveau sur Fampita ?{" "}
                      <Link
                        to="/register"
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Créer un compte
                      </Link>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
