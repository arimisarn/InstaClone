"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Sparkles, Check, Loader2, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/clients/theme-toggle";
import { Scene3D } from "@/components/clients/3d-scene";
import { FormSkeleton } from "@/components/clients/skeleton-loader";
import { ParticleBackground } from "@/components/clients/particle-background";
import { Link, useNavigate } from "react-router-dom";

interface FormData {
  email: string;
  nom_utilisateur: string;
  password: string;
  password2: string;
}

const passwordRequirements = [
  { text: "Au moins 8 caractères", regex: /.{8,}/ },
  { text: "Une lettre majuscule", regex: /[A-Z]/ },
  { text: "Une lettre minuscule", regex: /[a-z]/ },
  { text: "Un chiffre", regex: /\d/ },
];

export default function RegisterPage() {
  const navigate = useNavigate(); // <-- ici on utilise useNavigate

  const [formData, setFormData] = useState<FormData>({
    email: "",
    nom_utilisateur: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading3D, setIsLoading3D] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    document.title = "Fampita - Inscription";
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading3D(false);
      setTimeout(() => setShowForm(true), 500);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      // Par exemple ici tu peux utiliser un toast au lieu de console.error
      console.error("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://instaclone-oise.onrender.com/api/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        sessionStorage.setItem("pendingUsername", formData.nom_utilisateur);
        sessionStorage.setItem("pendingEmail", formData.email);
        sessionStorage.setItem("pendingPassword", formData.password);

        console.log("Inscription réussie ! Veuillez confirmer votre email.");
        navigate("/confirm-email");  // <-- ici avec useNavigate()
      } else {
        const errorData = await response.json();
        const msg =
          errorData?.email?.[0] ||
          errorData?.nom_utilisateur?.[0] ||
          errorData?.non_field_errors?.[0] ||
          "Erreur lors de l'inscription.";
        console.error(msg);
      }
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    const validRequirements = passwordRequirements.filter((req) =>
      req.regex.test(password)
    );
    return validRequirements.length;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-slate-900 dark:to-blue-900 relative overflow-hidden flex flex-col">
      <ParticleBackground />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 flex justify-between items-center"
      >
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: -180 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-400 rounded-2xl flex items-center justify-center shadow-2xl"
          >
            <Sparkles className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">
              Fampita
            </h1>
            <p className="text-xs text-slate-400">Votre coach IA</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            to="/login"
            className="border border-purple-500/30 text-purple-300 px-4 py-2 rounded-xl hover:bg-purple-500/10"
          >
            Se connecter
          </Link>
        </div>
      </motion.header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Section gauche : chargement/placeholder 3D */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-800/50 to-blue-900/50 backdrop-blur-xl border border-slate-700/50 flex items-center justify-center"
          >
            {isLoading3D ? (
              <div className="text-center space-y-4">
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    },
                    scale: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
                  }}
                  className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-400 rounded-full mx-auto"
                />
                <h3 className="text-2xl font-bold text-white">
                  Génération de l'univers 3D
                </h3>
                <p className="text-slate-400">
                  Construction de votre environnement personnalisé...
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
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                        className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-400 rounded-2xl mx-auto flex items-center justify-center"
                      >
                        <Loader2 className="w-8 h-8 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Génération du profil...
                        </h2>
                        <p className="text-slate-400">
                          Création de votre identité numérique 3D
                        </p>
                      </div>
                    </div>
                    <FormSkeleton />
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
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-400 rounded-2xl mx-auto flex items-center justify-center shadow-2xl"
                      >
                        <Sparkles className="w-8 h-8 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                          Inscription
                        </h2>
                        <p className="text-slate-400">
                          Rejoignez Fampita
                        </p>
                      </div>
                    </div>

                    {/* Champs */}
                    <div className="space-y-4">
                      {/* Username et Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nom d'utilisateur
                          </label>
                          <input
                            name="nom_utilisateur"
                            value={formData.nom_utilisateur}
                            onChange={handleChange}
                            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 backdrop-blur-sm"
                            placeholder="Avatar_Name"
                            required
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label className="block text-sm font-medium  text-gray-700 dark:text-gray-300">
                            Email
                          </label>
                          <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 backdrop-blur-sm"
                            placeholder="avatar@fampita.com"
                            required
                          />
                        </motion.div>
                      </div>

                      {/* Password */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Mot de passe sécurisé
                        </label>
                        <div className="relative">
                          <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-4 pr-12 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 backdrop-blur-sm"
                            placeholder="••••••••••••"
                            required
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </motion.button>
                        </div>

                        {/* Password strength */}
                        {formData.password && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 space-y-3"
                          >
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4].map((level) => (
                                <motion.div
                                  key={level}
                                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                                    passwordStrength >= level
                                      ? passwordStrength <= 2
                                        ? "bg-gradient-to-r from-red-500 to-red-600"
                                        : passwordStrength === 3
                                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                        : "bg-gradient-to-r from-green-500 to-blue-500"
                                      : "bg-slate-700"
                                  }`}
                                  initial={{ scaleX: 0 }}
                                  animate={{
                                    scaleX: passwordStrength >= level ? 1 : 0,
                                  }}
                                  transition={{ delay: level * 0.1 }}
                                />
                              ))}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {passwordRequirements.map((req, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-center space-x-2 text-xs"
                                >
                                  <motion.div
                                    animate={{
                                      scale: req.regex.test(formData.password)
                                        ? [1, 1.2, 1]
                                        : 1,
                                    }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <Check
                                      className={`w-3 h-3 ${
                                        req.regex.test(formData.password)
                                          ? "text-green-400"
                                          : "text-slate-500"
                                      }`}
                                    />
                                  </motion.div>
                                  <span
                                    className={
                                      req.regex.test(formData.password)
                                        ? "text-green-400"
                                        : "text-slate-500"
                                    }
                                  >
                                    {req.text}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Confirm Password */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Confirmer le mot de passe
                        </label>
                        <div className="relative">
                          <input
                            name="password2"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.password2}
                            onChange={handleChange}
                            className="w-full px-4 py-4 pr-12 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 backdrop-blur-sm"
                            placeholder="••••••••••••"
                            required
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </motion.button>
                        </div>
                        {formData.password2 &&
                          formData.password !== formData.password2 && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-2 text-xs text-red-400"
                            >
                              Les mots de passe ne correspondent pas
                            </motion.p>
                          )}
                      </motion.div>
                    </div>

                    {/* Terms */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        id="terms"
                        className="rounded border-slate-600 bg-slate-800"
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300text-slate-400">
                        J'accepte les{" "}
                        <Link
                          to="/terms"
                          className="text-purple-600 dark:text-400 hover:text-purple-300 transition-colors"
                        >
                          conditions d'utilisation
                        </Link>{" "}
                        et la{" "}
                        <Link
                          to="/privacy"
                          className="text-purple-600 hover:text-purple-400 dark:text-purple-400 dark:hover:text-purple-300  transition-colors"
                        >
                          politique de confidentialité
                        </Link>
                      </label>
                    </motion.div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                      <motion.button
                        type="button"
                        className="flex items-center gap-2 px-6 py-3 bborder-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 backdrop-blur-sm bg-transparent transition-all duration-300"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                      </motion.button>

                      <motion.button
                        type="submit"
                        disabled={
                          loading || formData.password !== formData.password2
                        }
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-xl font-medium transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Création de l'avatar...</span>
                          </div>
                        ) : (
                          <span className="flex items-center justify-center space-x-2">
                            <span>S'inscrir</span>
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                            >
                              <Sparkles className="w-5 h-5" />
                            </motion.div>
                          </span>
                        )}
                      </motion.button>
                    </div>

                    {/* Login link */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-center text-sm text-slate-400"
                    >
                      Déjà membre de Fampita ?{" "}
                      <Link
                        to="/login"
                        className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                      >
                        Se connecter
                      </Link>
                    </motion.p>
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
