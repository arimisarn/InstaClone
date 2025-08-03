import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner"; // ✅ Sonner

import App from "./App";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import Layout from "./components/layout/Layout";
import RequireAuth from "./components/auth/RequireAuth";

import "./index.css";
import ConfirmEmailPage from "./pages/ConfirmEmailPage";
import Accueil from "./pages/Accueil";
import Profile from "./pages/Profile";
import ModicationPage from "./pages/ModicationPage";
import UserProfile from "./pages/UserProfile";
import CreateStory from "./components/clients/CreateStory";
import ViewStory from "./components/clients/ViewStory";
import ChatPage from "./pages/ChatPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider attribute="class" enableSystem defaultTheme="system">
        {/* ✅ Remplace ToastProvider par Sonner */}
        <Toaster richColors closeButton position="top-right" />

        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/confirm-email" element={<ConfirmEmailPage />} />

          <Route element={<Layout />}>
            <Route
              path="/accueil"
              element={
                <RequireAuth>
                  <Accueil />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path="/modification-profile"
              element={
                <RequireAuth>
                  <ModicationPage />
                </RequireAuth>
              }
            />
            <Route
              path="/user/:username"
              element={
                <RequireAuth>
                  <UserProfile />
                </RequireAuth>
              }
            />
            <Route
              path="/story/create"
              element={
                <RequireAuth>
                  <CreateStory />
                </RequireAuth>
              }
            />
            <Route
              path="/story/view/:id"
              element={
                <RequireAuth>
                  <ViewStory />
                </RequireAuth>
              }
            />
            <Route
              path="/messages"
              element={
                <RequireAuth>
                  <ChatPage />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
