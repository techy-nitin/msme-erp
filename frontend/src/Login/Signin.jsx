import { useState } from "react";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";


const colors = {
  bg: "#f1ece2",
  ink: "#1c1c1c",
  cream: "#f1ece2",
  card: "#ffffff",
  accent: "#f0ae53",
  accentDark: "#e39a34",
  muted: "#6b6b6b",
  line: "#dcd6ca",
  danger: "#c0392b",
};

const font =
  '"Poppins","Segoe UI",-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif';

/* ---------- Decorative bits ---------- */

const Squiggle = ({ style }) => (
  <svg width="90" height="24" viewBox="0 0 90 24" fill="none" style={style}>
    <path
      d="M2 18c6-14 12-14 18 0s12 14 18 0 12-14 18 0 12 14 18 0 12-14 16-2"
      stroke={colors.ink}
      strokeWidth="1.4"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const RingDot = ({ size = 12, style }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" style={style}>
    <circle cx="6" cy="6" r="5" fill="none" stroke={colors.ink} strokeWidth="1.2" />
  </svg>
);

const NoteCard = ({ style, w = 96, h = 68 }) => (
  <div
    style={{
      position: "absolute",
      width: w,
      height: h,
      background: colors.cream,
      border: `1.5px solid ${colors.ink}`,
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "5px 6px 0 rgba(0,0,0,0.06)",
      ...style,
    }}
  >
    <div style={{ width: "55%" }}>
      <div style={{ height: 2, background: colors.ink, marginBottom: 8 }} />
      <div style={{ height: 2, background: colors.ink }} />
    </div>
  </div>
);

const DotSquare = ({ style, w = 96, h = 130 }) => (
  <div
    style={{
      position: "absolute",
      width: w,
      height: h,
      background: colors.accent,
      borderRadius: 4,
      backgroundImage: "radial-gradient(#141414 1.6px, transparent 1.6px)",
      backgroundSize: "14px 14px",
      backgroundPosition: "10px 10px",
      ...style,
    }}
  />
);

const ArrowCard = ({ style }) => (
  <div
    style={{
      position: "absolute",
      width: 84,
      height: 100,
      background: "#fff",
      border: `1.5px solid ${colors.ink}`,
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "5px 6px 0 rgba(0,0,0,0.06)",
      ...style,
    }}
  >
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="6 11 12 5 18 11" />
    </svg>
  </div>
);

/* Illustration: person sitting on a pedestal with a laptop */
const PersonIllustration = () => (
  <svg viewBox="0 0 320 400" width="100%" height="100%" style={{ maxWidth: 340, overflow: "visible" }}>
    <rect x="150" y="230" width="120" height="150" fill="#fff" stroke={colors.ink} strokeWidth="1.5" />
    <path
      d="M150 260 C130 300 95 320 60 335 L70 355 C110 345 145 320 168 285 Z"
      fill="#f5f2ea"
      stroke={colors.ink}
      strokeWidth="1.5"
    />
    <path
      d="M215 250 C230 285 235 310 220 340 L245 345 C262 305 258 275 240 245 Z"
      fill="#f5f2ea"
      stroke={colors.ink}
      strokeWidth="1.5"
    />
    <ellipse cx="63" cy="352" rx="16" ry="9" fill={colors.ink} />
    <ellipse cx="238" cy="352" rx="16" ry="9" fill={colors.ink} />
    <path
      d="M140 150 C120 160 108 190 112 230 C116 260 150 275 190 268 C222 262 238 235 232 200 C227 170 205 148 175 145 Z"
      fill="#20201f"
    />
    <path d="M120 210 C95 220 80 235 78 250 L95 258 C104 240 118 228 135 220 Z" fill="#20201f" />
    <path d="M215 195 C232 205 240 218 240 232 L222 238 C218 222 210 210 198 202 Z" fill="#20201f" />
    <g transform="translate(60,225) rotate(-8)">
      <rect x="0" y="0" width="90" height="58" rx="4" fill="#c7d66b" stroke={colors.ink} strokeWidth="1.5" />
      <rect x="-4" y="56" width="98" height="8" rx="2" fill="#e9e2d3" stroke={colors.ink} strokeWidth="1.5" />
    </g>
    <circle cx="176" cy="120" r="34" fill="#f2c9a1" stroke={colors.ink} strokeWidth="1.5" />
    <path
      d="M144 118 C140 90 158 68 180 68 C205 68 220 88 218 112 C230 108 236 122 228 132 C230 150 218 160 210 156 C214 140 208 126 195 120 C182 130 160 128 152 112 C148 118 146 122 144 118 Z"
      fill="#141414"
    />
    <circle cx="192" cy="62" r="9" fill="#141414" />
    <path d="M118 175 q10 8 4 20" stroke={colors.ink} strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </svg>
);

/* ---------- Helpers ---------- */

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function validPhone(v) {
  return /^[0-9+()\-\s]{7,}$/.test(v.trim());
}

const initialSignIn = { emailOrPhone: "", passcode: "" };
const initialRegister = { name: "", email: "", phone: "", password: "", role: "user" };

/* ---------- Reusable field ---------- */

const Field = ({ children, error }) => (
  <div style={{ textAlign: "left", marginBottom: error ? 4 : 12 }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: `1px solid ${error ? colors.danger : colors.line}`,
        borderRadius: 10,
        padding: "12px 16px",
      }}
    >
      {children}
    </div>
    {error && (
      <div style={{ fontSize: 12, color: colors.danger, marginTop: 5, marginBottom: 8 }}>{error}</div>
    )}
  </div>
);

const plainInputStyle = {
  border: "none",
  outline: "none",
  fontSize: 14,
  width: "100%",
  color: colors.ink,
  background: "transparent",
};

export default function RazorAuthApp() {
  const navigate = useNavigate();
  const [view, setView] = useState("signin"); // "signin" | "register" | "dashboard"
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const [signInData, setSignInData] = useState(initialSignIn);
  const [signInErrors, setSignInErrors] = useState({});

  const [registerData, setRegisterData] = useState(initialRegister);
  const [registerErrors, setRegisterErrors] = useState({});

  const resetAll = () => {
    setSignInData(initialSignIn);
    setSignInErrors({});
    setRegisterData(initialRegister);
    setRegisterErrors({});
    setShowPassword(false);
  };

  const goTo = (nextView) => {
    resetAll();
    setView(nextView);
  };

const handleSignIn = async (e) => {
  e.preventDefault();

  const val = signInData.emailOrPhone.trim();

  const nextErrors = {
    emailOrPhone: val === "" ? "Enter your email or phone number." : "",
    passcode: signInData.passcode === "" ? "Password is required." : "",
  };

  setSignInErrors(nextErrors);

  if (Object.values(nextErrors).some(Boolean)) return;

  try {
    setSubmitting(true);

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: signInData.emailOrPhone,
        password: signInData.passcode,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || data.error || "Login failed");
    }

    // Get user object
    const loggedInUser = data.user || data;

    // Save token
    localStorage.setItem("token", data.token || loggedInUser.token || "");

    // Save user details
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    localStorage.setItem("userId", loggedInUser.id || "");
    localStorage.setItem("name", loggedInUser.name || "");
    localStorage.setItem("email", loggedInUser.email || "");
    localStorage.setItem("role", loggedInUser.role || "");

    // Update state
    setUser(loggedInUser);

    // Navigate to dashboard
 navigate("/dashboard");

  } catch (err) {
    alert(err.message);
  } finally {
    setSubmitting(false);
  }
};
  const handleRegister = async (e) => {
  e.preventDefault();

  const nextErrors = {
    name:
      registerData.name.trim() === ""
        ? "Enter your full name."
        : "",
    email: !validEmail(registerData.email)
      ? "Enter a valid email."
      : "",
    phone: !validPhone(registerData.phone)
      ? "Enter a valid phone number."
      : "",
    password:
      registerData.password.length < 6
        ? "Password must be at least 6 characters."
        : "",
  };

  setRegisterErrors(nextErrors);

  if (Object.values(nextErrors).some(Boolean)) return;

  try {
    setSubmitting(true);

    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
        role: registerData.role.toUpperCase(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    alert("Registration Successful");

    goTo("signin");

  } catch (err) {
    alert(err.message);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div style={{ height: "100vh",
overflow: "hidden", background: colors.bg, fontFamily: font, color: colors.ink }}>
      <div style={{ height: 6, background: colors.ink }} />

      {/* nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 48px" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Razor</div>
          <div style={{ width: 78, height: 1, background: colors.ink, opacity: 0.5, margin: "6px 0 8px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: colors.muted }}>
            Sales@Razor.uk
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {user ? (
            <>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: colors.muted, textTransform: "capitalize" }}>{user.role}</div>
              </div>
              <button
                onClick={handleSignOut}
                style={{
                  padding: "10px 18px",
                  background: "#fff",
                  border: `1px solid ${colors.line}`,
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  color: colors.ink,
                  cursor: "pointer",
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth="1.6">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20z" />
              </svg>
              <span
                style={{ fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                onClick={() => goTo(view === "register" ? "signin" : "register")}
              >
                {view === "register" ? "Sign in" : "Sign up"}
              </span>
              <button
                style={{
                  padding: "12px 22px",
                  background: colors.accent,
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  color: colors.ink,
                  cursor: "pointer",
                }}
              >
                Request Demo
              </button>
            </>
          )}
        </div>
      </div>

      {/* stage */}
      <div style={{ position: "relative", maxWidth: 1140, margin: "0 auto", padding: "2opx" }}>
        {/* left decorations */}
        <Squiggle style={{ position: "absolute", left: 90, top: 130 }} />
        <RingDot style={{ position: "absolute", left: 195, top: 100 }} />
        <NoteCard style={{ left: 20, top: 195 }} />
        <RingDot style={{ position: "absolute", left: 240, top: 258 }} />
        <DotSquare style={{ left: 20, top: 335, width: 96, height: 128 }} />
        <ArrowCard style={{ left: 145, top: 375 }} />
        <Squiggle style={{ position: "absolute", left: 220, top: 380, transform: "scaleY(-1)" }} />

        {/* right decorations */}
        <Squiggle style={{ position: "absolute", right: 60, top: 95 }} />
        <NoteCard style={{ right: 55, top: 165, w: 90, h: 62 }} w={90} h={62} />
        <RingDot style={{ position: "absolute", right: 20, top: 155 }} />
        <Squiggle style={{ position: "absolute", right: 20, top: 175 }} />
        <DotSquare style={{ right: 0, top: 340, width: 96, height: 150 }} />

        {/* person illustration */}
        <div style={{ position: "absolute", right: 30, top: 155, width: 300, height: 340, zIndex: 1 }}>
          <PersonIllustration />
        </div>

        {/* card */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            margin: "20px auto 0",
            width: 380,
            background: colors.card,
            borderRadius: 24,
            boxShadow: "0 30px 60px rgba(30,25,15,0.12)",
            padding: view === "register" ? "34px 36px 28px" : "40px 36px 32px",
            textAlign: "center",
          }}
        >
          {view === "dashboard" && user && (
            <>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>Welcome, {user.name}</h1>
              <p style={{ fontSize: 14, color: colors.muted, lineHeight: 1.5, marginBottom: 20 }}>
                You're signed in to your Razor agent account.
              </p>
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 16px",
                  borderRadius: 999,
                  background: colors.bg,
                  border: `1px solid ${colors.line}`,
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "capitalize",
                  marginBottom: 24,
                }}
              >
                {user.role}
              </div>
              <div style={{ textAlign: "left", background: colors.bg, borderRadius: 12, padding: "14px 16px", marginBottom: 24 }}>
                <div style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>Signed in as</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{user.email}</div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                style={{
                  width: "100%",
                  padding: 14,
                  background: colors.accent,
                  border: "none",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  color: colors.ink,
                  cursor: "pointer",
                }}
              >
                Sign out
              </button>
            </>
          )}

          {view === "signin" && (
            <>
              <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>Agent Login</h1>
              <p style={{ fontSize: 14, color: colors.muted, lineHeight: 1.5, marginBottom: 26 }}>
                Hey, Enter your details to get sign in
                <br />
                to your account
              </p>

              <form onSubmit={handleSignIn} noValidate>
                <Field error={signInErrors.emailOrPhone}>
                  <input
                    type="text"
                    placeholder="Enter Email / Phone No"
                    value={signInData.emailOrPhone}
                    onChange={(e) => setSignInData((d) => ({ ...d, emailOrPhone: e.target.value }))}
                    style={plainInputStyle}
                  />
                  <span style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${colors.line}`, flexShrink: 0 }} />
                </Field>

                <Field error={signInErrors.passcode}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Passcode"
                    value={signInData.passcode}
                    onChange={(e) => setSignInData((d) => ({ ...d, passcode: e.target.value }))}
                    style={plainInputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    style={{ border: "none", background: "none", fontSize: 13, color: colors.muted, cursor: "pointer", fontWeight: 500, flexShrink: 0 }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </Field>

                <div style={{ textAlign: "left", marginBottom: 20 }}>
                  <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 13, color: colors.ink, textDecoration: "none" }}>
                    Having trouble in sign in?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: 15,
                    background: submitting ? "#f3cf98" : colors.accent,
                    border: "none",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 700,
                    color: colors.ink,
                    cursor: submitting ? "not-allowed" : "pointer",
                    marginBottom: 20,
                  }}
                >
                  {submitting ? "Signing in…" : "Sign in"}
                </button>

                <p style={{ fontSize: 13, color: colors.muted }}>
                  Don't have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goTo("register");
                    }}
                    style={{ color: colors.ink, fontWeight: 700, textDecoration: "none" }}
                  >
                    Request Now
                  </a>
                </p>
              </form>
            </>
          )}

          {view === "register" && (
            <>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Create Account</h1>
              <p style={{ fontSize: 13, color: colors.muted, lineHeight: 1.5, marginBottom: 18 }}>
                Register as an agent to access Razor.
              </p>

              <form onSubmit={handleRegister} noValidate>
                <Field error={registerErrors.name}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData((d) => ({ ...d, name: e.target.value }))}
                    style={plainInputStyle}
                  />
                </Field>

                <Field error={registerErrors.email}>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={registerData.email}
                    onChange={(e) => setRegisterData((d) => ({ ...d, email: e.target.value }))}
                    style={plainInputStyle}
                  />
                </Field>

                <Field error={registerErrors.phone}>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData((d) => ({ ...d, phone: e.target.value }))}
                    style={plainInputStyle}
                  />
                </Field>

                <Field error={registerErrors.password}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Passcode"
                    value={registerData.password}
                    onChange={(e) => setRegisterData((d) => ({ ...d, password: e.target.value }))}
                    style={plainInputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    style={{ border: "none", background: "none", fontSize: 13, color: colors.muted, cursor: "pointer", fontWeight: 500, flexShrink: 0 }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </Field>

                <div style={{ textAlign: "left", marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Account type</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["user", "admin"].map((r) => {
                      const active = registerData.role === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRegisterData((d) => ({ ...d, role: r }))}
                          style={{
                            flex: 1,
                            padding: "9px 10px",
                            fontSize: 13,
                            fontWeight: 700,
                            textTransform: "capitalize",
                            borderRadius: 10,
                            border: `1.5px solid ${active ? colors.ink : colors.line}`,
                            background: active ? colors.accent : "#fff",
                            color: colors.ink,
                            cursor: "pointer",
                          }}
                        >
                          {r}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: 14,
                    background: submitting ? "#f3cf98" : colors.accent,
                    border: "none",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 700,
                    color: colors.ink,
                    cursor: submitting ? "not-allowed" : "pointer",
                    marginBottom: 16,
                  }}
                >
                  {submitting ? "Creating account…" : "Create account"}
                </button>

                <p style={{ fontSize: 13, color: colors.muted }}>
                  Already have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goTo("signin");
                    }}
                    style={{ color: colors.ink, fontWeight: 700, textDecoration: "none" }}
                  >
                    Sign in
                  </a>
                </p>
              </form>
            </>
          )}
        </div>

        <div style={{ textAlign: "center", fontSize: 13, color: colors.muted, marginTop: 10 , overflow:"hidden"}}>
          Copyright @wework 2022 &nbsp;|&nbsp; Privacy Policy
        </div>
      </div>
    </div>
  );
}