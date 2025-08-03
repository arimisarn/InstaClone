import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Users,
  Share2,
  Camera,
  Smartphone,
  Shield,
  Zap,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Play,
} from "lucide-react";

const LandingPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Suivre & Être Suivi",
      description:
        "Connectez-vous avec vos amis et découvrez de nouveaux contenus personnalisés",
      color: "bg-blue-500",
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Stories Captivantes",
      description:
        "Partagez vos moments quotidiens avec des stories qui disparaissent après 24h",
      color: "bg-purple-500",
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Publications Créatives",
      description:
        "Postez photos, vidéos et textes avec des outils d'édition avancés",
      color: "bg-green-500",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Messages Instantanés",
      description:
        "Chattez en temps réel avec vos contacts dans une interface intuitive",
      color: "bg-pink-500",
    },
  ];

  const stats = [
    { number: "1M+", label: "Utilisateurs actifs" },
    { number: "50M+", label: "Publications partagées" },
    { number: "500M+", label: "Messages échangés" },
    { number: "99.9%", label: "Temps de disponibilité" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Fampita</span>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Fonctionnalités
            </a>
            <a
              href="#about"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              À propos
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Se connecter
            </Button>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white shadow-lg">
              S'inscrire
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <Badge className="mb-6 bg-gray-100 text-gray-700 border-0 px-4 py-2 text-sm font-medium">
                🎉 Nouveau réseau social français
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8 text-gray-900"
            >
              Connectez-vous avec
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block mt-2">
                votre communauté
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto"
            >
              Fampita réunit le meilleur d'Instagram et Facebook dans une
              expérience sociale moderne, élégante et intuitive.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
            >
              <Button
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg font-semibold shadow-xl"
              >
                Rejoindre Fampita
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                Voir la démo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={staggerChildren}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center p-6 rounded-2xl bg-gray-50"
                >
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Tout ce dont vous avez besoin pour
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                socialiser
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez une expérience sociale complète avec des fonctionnalités
              pensées pour créer des liens authentiques
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group bg-white">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Prêt à rejoindre Fampita ?
            </h2>
            <p className="text-xl mb-10 opacity-80 max-w-2xl mx-auto leading-relaxed">
              Créez votre compte maintenant et commencez à partager vos moments
              avec une communauté bienveillante
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg font-bold shadow-xl"
              >
                Créer un compte
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg font-semibold"
              >
                En savoir plus
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
                Une expérience mobile
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  exceptionnelle
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Fampita a été conçu mobile-first pour vous offrir la meilleure
                expérience sur tous vos appareils. Interface fluide, animations
                naturelles et performance optimisée.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium text-lg">
                    Application mobile native
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium text-lg">
                    Chargement ultra-rapide
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium text-lg">
                    Sécurité renforcée
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative max-w-sm mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20"></div>
                <Card className="relative border-0 shadow-2xl overflow-hidden bg-white">
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                        <span className="font-bold">Fampita</span>
                      </div>
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-white/20 rounded w-3/4"></div>
                          <div className="h-3 bg-white/20 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="h-32 bg-white/10 rounded-2xl"></div>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-6">
                          <Heart className="w-6 h-6" />
                          <MessageCircle className="w-6 h-6" />
                          <Share2 className="w-6 h-6" />
                        </div>
                        <div className="text-sm opacity-75">2h</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-12"
          >
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  Fampita
                </span>
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed max-w-md text-lg">
                Le réseau social nouvelle génération qui met l'humain au centre
                de l'expérience. Rejoignez une communauté bienveillante et
                créative.
              </p>
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center hover:shadow-xl transition-all cursor-pointer group">
                  <Instagram className="w-6 h-6 text-gray-600 group-hover:text-pink-500 transition-colors" />
                </div>
                <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center hover:shadow-xl transition-all cursor-pointer group">
                  <Facebook className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center hover:shadow-xl transition-all cursor-pointer group">
                  <Twitter className="w-6 h-6 text-gray-600 group-hover:text-blue-400 transition-colors" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6 text-gray-900">Produit</h3>
              <ul className="space-y-3 text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors font-medium"
                  >
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors font-medium"
                  >
                    Tarifs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors font-medium"
                  >
                    API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors font-medium"
                  >
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6 text-gray-900">Support</h3>
              <ul className="space-y-3 text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors font-medium"
                  >
                    Centre d'aide
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors font-medium"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors font-medium"
                  >
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors font-medium"
                  >
                    Conditions
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="border-t border-gray-200 mt-16 pt-8 text-center text-gray-600"
          >
            <p className="font-medium">
              &copy; 2025 Fampita. Tous droits réservés. Fait avec ❤️ en France.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
