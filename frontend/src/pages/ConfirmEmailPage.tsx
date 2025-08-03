import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner"; // ✅ HeroUI Sonner
import { Scene3D } from "@/components/clients/3d-scene";

export default function ConfirmEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail =
    (location.state as { email?: string })?.email ||
    sessionStorage.getItem("pendingEmail") ||
    "";

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading3D, setIsLoading3D] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    document.title = "Fampita - Confirmation Email";
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading3D(false);
      setTimeout(() => setShowForm(true), 500);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !code) {
      toast.error("Veuillez renseigner l'email et le code.");
      return;
    }

    setLoading(true);
    try {
      // Confirmation email
      await axios.post(
        "https://instaclone-oise.onrender.com/api/confirm-email/",
        { email, code }
      );

      toast.success("Email confirmé avec succès !");

      const password = sessionStorage.getItem("pendingPassword");
      const username = sessionStorage.getItem("pendingUsername");

      if (!username || !password) {
        toast.error(
          "Identifiants manquants. Veuillez vous connecter manuellement."
        );
        navigate("/login");
        return;
      }

      // Connexion auto
      const loginRes = await axios.post(
        "https://instaclone-oise.onrender.com/api/login/",
        { username, password }
      );
      const token = loginRes.data.token;
      localStorage.setItem("token", token);

      // Nettoyage sessionStorage
      sessionStorage.removeItem("pendingPassword");
      sessionStorage.removeItem("pendingUsername");
      sessionStorage.removeItem("pendingEmail");

      toast.success("Connecté automatiquement !");
      navigate("/accueil");
    } catch (error: any) {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Erreur lors de la confirmation.";
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
          {/* Section gauche : 3D immersive */}
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
                      Étape de confirmation
                    </h3>
                    <p className="text-slate-300 text-sm">
                      Entrez le code reçu par email pour activer votre compte.
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
                          Préparation de votre interface
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
                        <CheckCircle className="w-8 h-8 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-300 bg-clip-text text-transparent">
                          Confirmation Email
                        </h2>
                        <p className="text-slate-400">
                          Entrez le code reçu pour activer votre compte
                        </p>
                      </div>
                    </div>

                    {/* Champs */}
                    <div className="space-y-4">
                      {/* Email */}
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={!!initialEmail}
                          className="w-full px-4 py-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Votre email"
                          required
                        />
                      </div>

                      {/* Code */}
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                          Code de confirmation
                        </label>
                        <input
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          maxLength={6}
                          className="w-full px-4 py-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-center tracking-widest font-mono text-xl"
                          placeholder="123456"
                          required
                        />
                      </div>
                    </div>

                    {/* Boutons */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-2xl font-medium transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Confirmation...</span>
                        </div>
                      ) : (
                        "Confirmer"
                      )}
                    </motion.button>

                    {/* Lien retour */}
                    <p className="text-center text-sm text-slate-400">
                      <Link
                        to="/login"
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Retour à la connexion
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
