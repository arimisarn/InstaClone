"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/clients/theme-toggle";
import {
  Heart,
  MessageCircle,
  Share2,
  Users,
  Camera,
  Video,
  Sparkles,
  ArrowRight,
  Play,
  Star,
  Globe,
  Shield,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// ✅ Typage correct pour TypeScript + Framer Motion
import type { Variants } from "framer-motion";

const floatingAnimation: Variants = {
  float: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-slate-800 to-blue-600 dark:from-blue-600 dark:to-slate-400 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 dark:from-blue-400 dark:to-slate-200 bg-clip-text text-transparent">
                Fampita
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Réseau social moderne
              </p>
            </div>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="#features"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Fonctionnalités
            </Link>
            <Link
              to="#about"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              À propos
            </Link>
            <Link
              to="#contact"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Se connecter
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-slate-800 to-blue-600 hover:from-slate-900 hover:to-blue-700 dark:from-blue-600 dark:to-slate-700 dark:hover:from-blue-700 dark:hover:to-slate-800 text-white shadow-lg">
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-8"
            >
              <motion.div variants={fadeInUp}>
                <Badge className="mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Nouveau réseau social
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-slate-900 dark:text-white">
                  Connectez-vous avec{" "}
                  <span className="bg-gradient-to-r from-slate-800 to-blue-600 dark:from-blue-400 dark:to-slate-200 bg-clip-text text-transparent">
                    Fampita
                  </span>
                </h1>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed"
              >
                Découvrez une nouvelle façon de partager vos moments, suivre vos
                amis, créer des stories captivantes et discuter en temps réel.
                Fampita combine le meilleur d'Instagram et Facebook dans une
                expérience moderne et intuitive.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-slate-800 to-blue-600 hover:from-slate-900 hover:to-blue-700 dark:from-blue-600 dark:to-slate-700 dark:hover:from-blue-700 dark:hover:to-slate-800 text-lg px-8 py-6 shadow-lg"
                  >
                    Commencer maintenant
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 bg-transparent"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Voir la démo
                </Button>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex items-center space-x-6 pt-4"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-600 to-blue-500 border-2 border-white dark:border-slate-950"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    +10k utilisateurs
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-sm text-slate-600 dark:text-slate-400 ml-1">
                    4.9/5
                  </span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                {/* Phone mockup */}
                <motion.div
                  variants={floatingAnimation}
                  animate="float" // Correspond à la clé "float" définie dans floatingAnimation
                  className="relative z-10 mx-auto w-80 h-[600px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-[3rem] p-2 shadow-2xl"
                >
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                    <img
                      src="/placeholder.svg?height=600&width=300&text=Fampita+App"
                      alt="Fampita App Interface"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-r from-slate-700 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-10 -right-10 w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg"
                  animate={{
                    y: [-5, 5, -5],
                    rotate: [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                </motion.div>

                <motion.div
                  className="absolute top-1/2 -right-16 w-12 h-12 bg-gradient-to-r from-slate-600 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{
                    x: [-5, 5, -5],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Share2 className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-slate-200 dark:bg-slate-800/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-200 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              Tout ce dont vous avez besoin pour{" "}
              <span className="bg-gradient-to-r from-slate-800 to-blue-600 dark:from-blue-400 dark:to-slate-200 bg-clip-text text-transparent">
                rester connecté
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Fampita réunit toutes les fonctionnalités essentielles d'un réseau
              social moderne dans une interface élégante et intuitive.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Users,
                title: "Suivi d'amis",
                description:
                  "Suivez vos amis et découvrez de nouveaux profils intéressants",
                color:
                  "from-slate-600 to-slate-700 dark:from-slate-500 dark:to-slate-600",
              },
              {
                icon: Camera,
                title: "Stories captivantes",
                description:
                  "Partagez vos moments avec des stories temporaires et créatives",
                color:
                  "from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600",
              },
              {
                icon: Video,
                title: "Publications riches",
                description:
                  "Publiez photos, vidéos et textes avec des outils d'édition avancés",
                color:
                  "from-cyan-600 to-cyan-700 dark:from-cyan-500 dark:to-cyan-600",
              },
              {
                icon: MessageCircle,
                title: "Chat en temps réel",
                description:
                  "Discutez instantanément avec vos amis grâce à notre système de messagerie",
                color:
                  "from-slate-700 to-blue-600 dark:from-slate-600 dark:to-blue-500",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 text-center"
          >
            {[
              { number: "10K+", label: "Utilisateurs actifs", icon: Users },
              { number: "50K+", label: "Publications partagées", icon: Camera },
              {
                number: "1M+",
                label: "Messages échangés",
                icon: MessageCircle,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-8"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-700 to-blue-600 dark:from-blue-600 dark:to-slate-400 rounded-full flex items-center justify-center shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 dark:from-blue-400 dark:to-slate-200 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-blue-600 dark:from-slate-900 dark:to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Rejoignez la communauté Fampita dès aujourd'hui
            </h2>
            <p className="text-xl text-slate-100 mb-8">
              Créez votre compte gratuitement et commencez à partager vos
              moments avec vos proches dans un environnement sécurisé et
              moderne.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-slate-800 hover:bg-slate-100 text-lg px-8 py-6 shadow-lg"
                >
                  Créer un compte gratuit
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-800 text-lg px-8 py-6 bg-transparent"
              >
                En savoir plus
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">Fampita</span>
                  <p className="text-xs text-slate-400">
                    Réseau social moderne
                  </p>
                </div>
              </div>
              <p className="text-slate-400">
                Le réseau social moderne qui connecte les gens de manière
                authentique et créative.
              </p>
              <div className="flex space-x-4">
                {[Globe, Shield, Zap].map((Icon, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 bg-slate-800 dark:bg-slate-900 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer"
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Carrières
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Presse
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Centre d'aide
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 dark:border-slate-900 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Fampita. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
