// src/IngetesAdmin.jsx
import React, { useEffect, useMemo, useState, createContext, useContext } from "react";
import Portaladmin from "./Portaladmin.jsx";

/* =========================
   DEMO de autenticación
   ========================= */
const USERS = [
  { email: "jgarzon@ingetes.com", password: "Ing830#1", role: "SUPER_ADMIN", name: "Juan Sebastián Garzón" },
];

const mockAuth = {
  login: async (email, password) => {
    await new Promise((r) => setTimeout(r, 300));
    const found = USERS.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password
    );
    if (!found) throw new Error("Credenciales inválidas");
    return { email: found.email, role: found.role, name: found.name };
  },
};

/* =========================
   Contexto de Auth (simple)
   ========================= */
const AuthContext = createContext(null);
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext no disponible");
  return ctx;
}
function AuthProvider({ children }) {
  const [session, setSession] = useState(null);

  // Restaurar sesión si existiera
  useEffect(() => {
    const raw = sessionStorage.getItem("ingetes_admin_session");
    if (raw) setSession(JSON.parse(raw));
  }, []);

  // Persistir sesión
  useEffect(() => {
    if (session) sessionStorage.setItem("ingetes_admin_session", JSON.stringify(session));
    else sessionStorage.removeItem("ingetes_admin_session");
  }, [session]);

  const value = useMemo(
    () => ({
      session,
      login: async (email, password) => {
        const user = await mockAuth.login(email, password);
        setSession(user);
      },
      logout: () => setSession(null),
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* =========================
   Login (solo formulario)
   ========================= */
function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("jgarzon@ingetes.com");
  const [password, setPassword] = useState("Ing830#1");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      // Ir directo al panel
      window.location.hash = "#portal_admin";
    } catch (err) {
      setError(err?.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-emerald-50 p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-emerald-100 p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold text-emerald-700 text-center">
          PORTAL ADMINISTRADOR DE USUARIOS
        </h1>

        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 text-red-700 text-sm p-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-700">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-600"
            placeholder="usuario@ingetes.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-600"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-xl text-white text-lg font-semibold py-3 ${
            loading ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="text-xs text-center text-gray-500">
          Acceso restringido al <strong>SUPER_ADMIN</strong>.
        </p>
      </form>
    </div>
  );
}

/* =========================
   Enrutado por hash
   ========================= */
function Body() {
  const { session } = useAuth();

  // Si el hash es #portal_admin, muestra el módulo completo
  if (window.location.hash === "#portal_admin") {
    return (
      <div className="min-h-screen w-full">
        <Portaladmin />
      </div>
    );
  }

  // Si no hay hash de portal_admin, muestra el login
  if (!session) return <LoginForm />;

  // Si hay sesión pero no estamos en #portal_admin, redirigimos
  window.location.hash = "#portal_admin";
  return null;
}

/* =========================
   ÚNICO export default
   ========================= */
export default function AdminAccessApp() {
  // Montaje seguro para evitar parpadeos
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  // Escucha cambios de hash (por si vuelves atrás)
  const [, setTick] = useState(0);
  useEffect(() => {
    const onHash = () => setTick((n) => n + 1);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <AuthProvider>
      <Body />
    </AuthProvider>
  );
}

