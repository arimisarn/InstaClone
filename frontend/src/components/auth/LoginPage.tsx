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
console.log(open, title, description);

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
    <div className="min-h-screen bg-[#8a8f6a] flex items-center justify-center p-6">
      <div className="bg-[#f5f1e8] border border-[#c8c1b2] w-full max-w-5xl p-10">
        {/* Titre */}
        <h1 className="text-center font-serif text-4xl text-[#4a4a3d] mb-6">
          My account
        </h1>

        {/* Onglets Login/Register */}
        <div className="flex justify-center gap-4 mb-10">
          <button className="px-6 py-2 bg-[#8a8f6a] text-white rounded-sm">
            Login
          </button>
          <Link
            to="/register"
            className="px-6 py-2 bg-white border border-[#c8c1b2] text-[#4a4a3d] rounded-sm"
          >
            Register
          </Link>
        </div>

        {/* Bloc formulaire + image */}
        <div className="flex flex-col md:flex-row border border-[#c8c1b2]">
          {/* Formulaire */}
          <div className="w-full md:w-1/2 p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm mb-1 text-[#4a4a3d]">
                  Email
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full border border-[#c8c1b2] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a8f6a]"
                  required
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm mb-1 text-[#4a4a3d]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full border border-[#c8c1b2] rounded-sm px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-[#8a8f6a]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Bouton connexion */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-[#b58f58] text-white rounded-sm hover:bg-[#a17b4c] transition"
              >
                {loading ? "Connexion..." : "Login"}
              </button>

              {/* Google */}
              <button
                type="button"
                className="w-full py-2 bg-white border border-[#c8c1b2] text-[#4a4a3d] rounded-sm hover:bg-gray-50 transition"
              >
                Sign in with Google
              </button>
            </form>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2 h-48 md:h-auto">
            {/* <img
              src="/login-side.jpg"
              alt="Login"
              className="w-full h-full object-cover"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
