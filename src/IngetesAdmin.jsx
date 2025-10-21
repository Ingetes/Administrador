import React, { useEffect, useMemo, useState, createContext, useContext } from "react";
import Portaladmin from "./Portaladmin.jsx";

const logoIngetes = "https://ingetes.github.io/Portal-de-clientes/ingetes.jpg";

/** ========== Mock de usuarios (SOLO DEMO) ========== */
const USERS = [
  { email: "jgarzon@ingetes.com", password: "Ing830#1", role: "SUPER_ADMIN", name: "Juan Sebastián Garzón" },
];

const mockAuth = {
  login: async (email, password) => {
    await new Promise((r) => setTimeout(r, 400));
    const found = USERS.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password
    );
    if (!found) throw new Error("Credenciales inválidas");
    return { email: found.email, role: found.role, name: found.name };
  },
};

/** ========== Auth Context (JS puro) ========== */
const AuthContext = createContext(null);
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext no disponible");
  return ctx;
}
function AuthProvider({ children }) {
  const [session, setSession] = useState(null);

// restaura/borra sesión solo según el hash
useEffect(() => {
  const raw = sessionStorage.getItem("ingetes_admin_session");
  if (window.location.hash === "#portal_admin" && raw) {
    setSession(JSON.parse(raw));
  } else {
    sessionStorage.removeItem("ingetes_admin_session");
    setSession(null);
  }
}, []);

  useEffect(() => {
    if (session)
      sessionStorage.setItem("ingetes_admin_session", JSON.stringify(session));
    else
      sessionStorage.removeItem("ingetes_admin_session");
  }, [session]);

const value = useMemo(
  () => ({
    session,
    login: async (email, password) => {
      const user = await mockAuth.login(email, password);
      // 1) Ir al portal
      window.location.hash = "#portal_admin";
      // 2) Guardar sesión (ya con route correcto)
      setSession(user);
    },
    logout: () => setSession(null),
  }),
  [session]
);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** ========== UI Helpers (SVGs livianos) ========== */
const IconShield = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className || "w-6 h-6"}>
    <path d="M12 2c-.6 0-1.2.2-1.7.5L4 6v6c0 4.4 3.1 8.5 8 10 4.9-1.5 8-5.6 8-10V6l-6.3-3.5c-.5-.3-1.1-.5-1.7-.5zM11 16l-3-3 1.4-1.4L11 13.2l4.6-4.6L17 10l-6 6z" />
  </svg>
);
const IconUser = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className || "w-6 h-6"}>
    <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
  </svg>
);
const IconAlert = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className || "w-4 h-4"}>
    <path d="M1 21h22L12 2 1 21zm12-3h-2v2h2v-2zm0-8h-2v6h2V10z" />
  </svg>
);

/** ========== Login Card ========== */
function LoginCard() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err?.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto shadow-xl border border-emerald-200 rounded-2xl bg-white">
      <div className="p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logoIngetes} alt="INGETES" className="h-10 w-auto mb-3 rounded" />
          <div className="flex items-center gap-2">
            <IconShield className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-semibold text-emerald-700 text-center">
              PORTAL ADMINISTRADOR DE USUARIOS
            </h1>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm mb-4">
            <IconAlert className="w-4 h-4 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-700">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="usuario@ingetes.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-600"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-600"
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
    </div>
  );
}

/** ========== Gate por Rol ========== */
function RoleGate({ children }) {
  const { session } = useAuth();
  if (!session) return null;
  const allowed = session.role === "SUPER_ADMIN" || session.role === "ADMIN";
  if (!allowed) {
    return (
      <div className="max-w-xl mx-auto mt-8 p-4 border border-emerald-300 bg-emerald-50 rounded-xl">
        <h2 className="font-semibold text-emerald-700 mb-1">Acceso denegado</h2>
        <p className="text-sm text-emerald-700">Tu rol actual no tiene permisos para ingresar al Administrador de Usuarios.</p>
      </div>
    );
  }
  return <>{children}</>;
}

/** ========== Componente principal ÚNICO (default) ========== */
// --- Sustituye tu export default por esto ---

export default function IngetesAdmin() {
  const [route, setRoute] = React.useState(window.location.hash);

  React.useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Mantén el provider aquí y mueve el consumo de sesión a un componente interno
  return (
    <AuthProvider>
      <InnerApp route={route} />
    </AuthProvider>
  );
}

function InnerApp({ route }) {
  const { session } = useAuth();

  // 👇 clave: solo mostramos el portal si HAY sesión y estamos en #portal_admin
  const isPortal = Boolean(session) && route === "#portal_admin";

  return (
    <>
      {/* Cierra sesión si alguien navega fuera de #portal_admin */}
      <RouteGuard route={route} />

      {isPortal ? (
        // Layout simple únicamente cuando sí estamos dentro del portal
        <div className="min-h-screen w-full">
          <AuthBody route={route} />
        </div>
      ) : (
        // En cualquier otro caso: tu layout original con el panel verde
        <div className="min-h-screen w-full bg-gradient-to-br from-white to-emerald-50 p-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="hidden md:flex flex-col justify-center items-start rounded-2xl bg-[linear-gradient(135deg,#059669,rgba(5,150,105,0.9))] text-white p-10 shadow-xl relative overflow-hidden">
  {/* Logo y título */}
  <div className="relative z-10 space-y-4">
    <h2 className="text-3xl font-bold leading-tight">Administrador INGETES</h2>
    <p className="text-emerald-100 text-base max-w-sm">
      Administra usuarios y permisos del ecosistema de clientes de INGETES de forma segura y centralizada.
    </p>
  </div>

  {/* Fondo decorativo */}
  <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/20 to-emerald-500/10 rounded-2xl"></div>
  <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-white/10 rounded-full blur-3xl"></div>
  <div className="absolute -top-12 -left-16 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
</div>
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
              <AuthBody route={route} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** ========== Helper: decide qué mostrar con base en sesión/hash ========== */
function AuthBody({ route }) {
  const { session, logout } = useAuth();

  // sin sesión → login (pantalla con panel verde + tarjeta)
  if (!session) return <LoginCard />;

  // con sesión y hash correcto → portal
  if (route === "#portal_admin") {
    return (
      <Portaladmin
        onBack={() => {
          // volver debe CERRAR sesión y regresar a /Administrador/
window.location.hash = "";
logout();
sessionStorage.removeItem("ingetes_admin_session");
        }}
      />
    );
  }

  // con sesión pero hash incorrecto → regresamos a login
  return <LoginCard />;
}

function RouteGuard({ route }) {
  const { session, logout } = useAuth();

  useEffect(() => {
    if (route !== "#portal_admin" && session) {
      // cerrar sesión si se navega fuera del portal
      logout();
      sessionStorage.removeItem("ingetes_admin_session");
    }
  }, [route, session, logout]);

  return null;
}


