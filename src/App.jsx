import { useState, useEffect, useCallback } from "react";

const API = "https://render.com/docs/web-services#port-binding";

// ─── API HELPERS ────────────────────────────────────────────────────────────
const api = {
  post: (url, body) =>
    fetch(`${API}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json()),

  postParams: (url, params) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${API}${url}?${qs}`, { method: "POST" }).then((r) =>
      r.status === 200 ? r.json().catch(() => ({})) : r.json()
    );
  },

  get: (url) => fetch(`${API}${url}`).then((r) => r.json()),
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080810;
    --surface: #0f0f1a;
    --surface2: #161625;
    --surface3: #1c1c2e;
    --border: #242438;
    --border2: #2e2e48;
    --accent: #6c63ff;
    --accent-glow: rgba(108,99,255,0.18);
    --accent2: #ff6b35;
    --green: #10d48e;
    --red: #ff4d6d;
    --yellow: #fbbf24;
    --text: #eeeef5;
    --text2: #a8a8c0;
    --muted: #5a5a7a;
    --font-head: 'Plus Jakarta Sans', sans-serif;
    --font-body: 'Space Grotesk', sans-serif;
    --radius: 16px;
    --radius-sm: 10px;
    --radius-xs: 6px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --shadow-glow: 0 0 40px rgba(108,99,255,0.12);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    min-height: 100vh;
    font-size: 15px;
    -webkit-font-smoothing: antialiased;
  }

  .app { display: flex; min-height: 100vh; }

  /* ── Sidebar ── */
  .sidebar {
    width: 250px;
    min-height: 100vh;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 0;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
  }

  .sidebar-logo {
    font-family: var(--font-head);
    font-size: 20px;
    font-weight: 800;
    color: var(--text);
    padding: 26px 24px 22px;
    letter-spacing: -0.5px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .sidebar-logo-icon {
    width: 34px; height: 34px;
    background: var(--accent);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    box-shadow: 0 4px 12px rgba(108,99,255,0.4);
  }
  .sidebar-logo span { color: var(--accent); }

  .sidebar-user {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .sidebar-avatar {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: white;
    flex-shrink: 0;
    font-family: var(--font-head);
  }
  .sidebar-user-info { min-width: 0; }
  .sidebar-user-name { font-weight: 600; font-size: 14px; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sidebar-user-email { font-size: 11px; color: var(--muted); margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .nav-section { padding: 12px 16px 6px; font-size: 10px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    margin: 1px 8px;
    cursor: pointer;
    color: var(--text2);
    font-size: 13.5px;
    font-weight: 500;
    border-radius: var(--radius-sm);
    transition: all 0.15s;
    user-select: none;
  }
  .nav-item:hover { color: var(--text); background: var(--surface2); }
  .nav-item.active { color: white; background: var(--accent); box-shadow: 0 4px 16px rgba(108,99,255,0.35); }
  .nav-item.active .nav-icon { filter: none; }
  .nav-icon { font-size: 17px; width: 22px; text-align: center; }

  .sidebar-bottom {
    margin-top: auto;
    padding: 16px 16px;
    border-top: 1px solid var(--border);
  }

  /* ── Main ── */
  .main {
    margin-left: 250px;
    flex: 1;
    padding: 40px 44px;
    min-height: 100vh;
    max-width: calc(100vw - 250px);
  }

  /* ── Auth ── */
  .auth-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    padding: 24px;
    background-image: radial-gradient(ellipse at 20% 50%, rgba(108,99,255,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(255,107,53,0.06) 0%, transparent 50%);
  }
  .auth-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 22px;
    padding: 44px 40px;
    width: 100%;
    max-width: 420px;
    box-shadow: var(--shadow), var(--shadow-glow);
  }
  .auth-brand {
    display: flex; align-items: center; gap: 10px; margin-bottom: 28px;
  }
  .auth-brand-icon {
    width: 38px; height: 38px;
    background: var(--accent);
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    box-shadow: 0 4px 14px rgba(108,99,255,0.45);
  }
  .auth-brand-name {
    font-family: var(--font-head);
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.3px;
  }
  .auth-brand-name span { color: var(--accent); }
  .auth-title {
    font-family: var(--font-head);
    font-size: 26px;
    font-weight: 800;
    margin-bottom: 6px;
    letter-spacing: -0.5px;
  }
  .auth-sub { color: var(--text2); font-size: 14px; margin-bottom: 28px; line-height: 1.5; }
  .auth-switch { text-align: center; margin-top: 22px; font-size: 14px; color: var(--muted); }
  .auth-switch button { background: none; border: none; color: var(--accent); cursor: pointer; font-weight: 600; font-size: 14px; font-family: var(--font-body); }
  .auth-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: var(--muted); font-size: 12px; }
  .auth-divider::before, .auth-divider::after { content: ""; flex: 1; height: 1px; background: var(--border); }

  /* ── Form ── */
  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 12px; font-weight: 600; color: var(--text2); margin-bottom: 8px; letter-spacing: 0.2px; text-transform: uppercase; }
  .form-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 11px 14px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(108,99,255,0.12); }
  .form-input::placeholder { color: var(--muted); }
  select.form-input option { background: var(--surface2); }

  /* ── Buttons ── */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 11px 20px;
    border-radius: var(--radius-sm);
    border: none;
    font-family: var(--font-body);
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;
    letter-spacing: 0.1px;
  }
  .btn-primary { background: var(--accent); color: #fff; box-shadow: 0 4px 14px rgba(108,99,255,0.3); }
  .btn-primary:hover { background: #5a52e8; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(108,99,255,0.4); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-secondary { background: var(--surface2); color: var(--text2); border: 1px solid var(--border); }
  .btn-secondary:hover { border-color: var(--border2); color: var(--text); background: var(--surface3); }
  .btn-danger { background: rgba(255,77,109,0.1); color: var(--red); border: 1px solid rgba(255,77,109,0.22); }
  .btn-danger:hover { background: rgba(255,77,109,0.18); }
  .btn-success { background: rgba(16,212,142,0.1); color: var(--green); border: 1px solid rgba(16,212,142,0.22); }
  .btn-success:hover { background: rgba(16,212,142,0.18); }
  .btn-full { width: 100%; }
  .btn-sm { padding: 7px 13px; font-size: 12.5px; }

  /* ── Page header ── */
  .page-header { margin-bottom: 32px; }
  .page-title { font-family: var(--font-head); font-size: 27px; font-weight: 800; letter-spacing: -0.5px; }
  .page-sub { color: var(--text2); font-size: 14px; margin-top: 5px; }

  /* ── Cards ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
  }
  .card-title { font-family: var(--font-head); font-size: 15px; font-weight: 700; margin-bottom: 18px; color: var(--text); }

  /* ── Dashboard stats ── */
  .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 22px 24px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.15s;
  }
  .stat-card::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
  }
  .stat-card:nth-child(1)::before { background: linear-gradient(90deg, var(--accent), transparent); }
  .stat-card:nth-child(2)::before { background: linear-gradient(90deg, var(--green), transparent); }
  .stat-card:nth-child(3)::before { background: linear-gradient(90deg, var(--red), transparent); }
  .stat-label { font-size: 11px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 12px; }
  .stat-value { font-family: var(--font-head); font-size: 28px; font-weight: 800; letter-spacing: -1px; }
  .stat-value.green { color: var(--green); }
  .stat-value.red { color: var(--red); }
  .stat-value.accent { color: var(--accent); }

  /* ── Groups grid ── */
  .groups-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
  .group-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 22px;
    cursor: pointer;
    transition: all 0.18s;
  }
  .group-card:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 12px 32px rgba(108,99,255,0.15), var(--shadow-glow); }
  .group-card-name { font-family: var(--font-head); font-size: 16px; font-weight: 700; margin-bottom: 8px; }
  .group-card-members { font-size: 12px; color: var(--muted); }
  .group-card-id { font-size: 10px; color: var(--border2); margin-top: 12px; font-family: monospace; background: var(--surface2); padding: 3px 8px; border-radius: 4px; display: inline-block; }

  /* ── Member chips ── */
  .members-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
  .member-chip {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 11.5px;
    color: var(--text2);
  }

  /* ── Balance rows ── */
  .balance-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
    gap: 12px;
  }
  .balance-row:last-child { border-bottom: none; }
  .balance-names { font-size: 13.5px; line-height: 1.4; }
  .balance-names strong { color: var(--accent); }
  .balance-amount { font-family: var(--font-head); font-weight: 700; color: var(--accent2); font-size: 16px; flex-shrink: 0; }

  /* ── Expense rows ── */
  .expense-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
    gap: 12px;
  }
  .expense-row:last-child { border-bottom: none; }
  .expense-desc { font-size: 14px; font-weight: 500; }
  .expense-meta { font-size: 11.5px; color: var(--muted); margin-top: 3px; }
  .expense-amount { font-family: var(--font-head); font-weight: 700; font-size: 16px; color: var(--green); flex-shrink: 0; }

  /* ── Invitation rows ── */
  .inv-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
    gap: 12px;
  }
  .inv-row:last-child { border-bottom: none; }
  .inv-info { font-size: 14px; }
  .inv-group { font-weight: 600; color: var(--accent); }
  .inv-actions { display: flex; gap: 8px; flex-shrink: 0; }

  /* ── Toast ── */
  .toast {
    position: fixed;
    bottom: 28px;
    right: 28px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 14px 18px;
    font-size: 13.5px;
    font-weight: 500;
    z-index: 999;
    max-width: 320px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1);
    display: flex; align-items: center; gap: 10px;
  }
  .toast.success { border-color: rgba(16,212,142,0.4); color: var(--green); }
  .toast.error { border-color: rgba(255,77,109,0.4); color: var(--red); }
  @keyframes slideUp { from { opacity:0; transform: translateY(16px) scale(0.96); } to { opacity:1; transform: translateY(0) scale(1); } }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 200;
    padding: 24px;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 24px 64px rgba(0,0,0,0.6), var(--shadow-glow);
    animation: modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes modalIn { from { opacity:0; transform: scale(0.95) translateY(8px); } to { opacity:1; transform: scale(1) translateY(0); } }
  .modal-title { font-family: var(--font-head); font-size: 19px; font-weight: 800; margin-bottom: 24px; }
  .modal-footer { display: flex; gap: 10px; margin-top: 24px; justify-content: flex-end; }

  /* ── Split list in add expense ── */
  .split-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
  .split-row .form-input { flex: 1; }

  /* ── Empty state ── */
  .empty { text-align: center; padding: 56px 24px; color: var(--muted); }
  .empty-icon { font-size: 42px; margin-bottom: 14px; filter: grayscale(0.2); }
  .empty-text { font-size: 14px; line-height: 1.5; }

  /* ── Tabs ── */
  .tabs { display: flex; gap: 2px; margin-bottom: 22px; background: var(--surface2); padding: 3px; border-radius: var(--radius-sm); width: fit-content; border: 1px solid var(--border); }
  .tab {
    padding: 7px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    color: var(--muted);
    border: none;
    background: none;
    font-family: var(--font-body);
    transition: all 0.15s;
  }
  .tab.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 6px rgba(0,0,0,0.35); }

  /* ── Divider ── */
  .divider { height: 1px; background: var(--border); margin: 24px 0; }

  /* ── Row actions ── */
  .row-actions { display: flex; gap: 8px; align-items: center; }

  /* ── Badge ── */
  .badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .badge-green { background: rgba(16,212,142,0.12); color: var(--green); border: 1px solid rgba(16,212,142,0.2); }
  .badge-red { background: rgba(255,77,109,0.12); color: var(--red); border: 1px solid rgba(255,77,109,0.2); }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  /* ── Info box ── */
  .info-box { padding: 12px 14px; background: rgba(108,99,255,0.07); border: 1px solid rgba(108,99,255,0.18); border-radius: var(--radius-sm); font-size: 12.5px; color: var(--text2); line-height: 1.5; }

  @media (max-width: 900px) {
    .two-col { grid-template-columns: 1fr; }
    .stats-grid { grid-template-columns: 1fr; }
    .main { padding: 24px 20px; }
  }
`;

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  if (!msg) return null;
  return <div className={`toast ${type}`}>{msg}</div>;
}

// ─── AUTH PAGE ───────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");
    if (!form.email || !form.password) return setError("Please enter your email and password");
    setLoading(true);
    try {
      if (mode === "register") {
        if (!form.name) return setError("Please enter your name");
        const res = await api.post("/api/users/register", form);
        if (res.id) {
          setMode("login");
          setForm({ name: "", email: form.email, password: "" });
          setError("✅ Registration successful! Please log in.");
        } else {
          setError(res.message || "Registration failed");
        }
      } else {
        const res = await api.post("/api/users/login", { email: form.email, password: form.password });
        if (res?.id) {
          onLogin(res);
        } else {
          setError("Invalid email or password");
        }
      }
    } catch {
      setError("Unable to connect to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">💸</div>
          <div className="auth-brand-name">Split<span>wise</span></div>
        </div>
        <div className="auth-title">
          {mode === "login" ? "Welcome back" : "Get started"}
        </div>
        <div className="auth-sub">
          {mode === "login" ? "Sign in to your account to continue." : "Create your account — it's free."}
        </div>
        {error && (
          <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 8, background: error.startsWith("✅") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: error.startsWith("✅") ? "var(--green)" : "var(--red)", fontSize: 13 }}>
            {error}
          </div>
        )}
        {mode === "register" && (
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" name="name" placeholder="Your full name" value={form.name} onChange={handle} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" name="email" type="email" placeholder="email@example.com" value={form.email} onChange={handle} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        <button className="btn btn-primary btn-full" onClick={submit} disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>
        <div className="auth-switch">
          {mode === "login" ? (
            <> New here? <button onClick={() => { setMode("register"); setError(""); }}>Create an account</button> </>
          ) : (
            <> Already have an account? <button onClick={() => { setMode("login"); setError(""); }}>Sign in</button> </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ user }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/api/expenses/dashboard/${user.id}`).then(setData).catch(() => {});
  }, [user.id]);

  const fmt = (n) => `₹${Math.abs(n ?? 0).toFixed(2)}`;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Welcome back, {user.name}! 👋</div>
        <div className="page-sub">Here's your financial overview at a glance.</div>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Balance</div>
          <div className={`stat-value ${data?.totalBalance >= 0 ? "green" : "red"}`}>
            {data ? (data.totalBalance >= 0 ? "+" : "-") + fmt(data.totalBalance) : "—"}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">You are owed</div>
          <div className="stat-value green">{data ? fmt(data.youGet) : "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">You owe</div>
          <div className="stat-value red">{data ? fmt(data.youOwe) : "—"}</div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">How it works</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { icon: "👥", title: "Create a Group", desc: "Start a group with friends, family, or roommates" },
            { icon: "💸", title: "Add Expenses", desc: "Log expenses and split them equally or by custom amounts" },
            { icon: "⚖️", title: "View Balances", desc: "See who owes who and how much at a glance" },
            { icon: "✅", title: "Settle Up", desc: "Record payments and mark debts as settled" },
          ].map((item) => (
            <div key={item.title} style={{ background: "var(--surface2)", borderRadius: "var(--radius-sm)", padding: 18 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── GROUPS PAGE ─────────────────────────────────────────────────────────────
function GroupsPage({ user, showToast }) {
  const [groups, setGroups] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showAddMember, setShowAddMember] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [memberUserId, setMemberUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const loadGroups = useCallback(() => {
    api.get(`/api/groups/user/${user.id}`).then(setGroups).catch(() => {});
  }, [user.id]);

  useEffect(() => { loadGroups(); }, [loadGroups]);

  const createGroup = async () => {
    if (!groupName.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/api/groups/create", { groupName });
      if (res.id) {
        // Add creator as member
        await api.postParams("/api/groups/addMember", { groupId: res.id, userId: user.id });
        loadGroups();
        setGroupName("");
        setShowCreate(false);
        showToast("Group created successfully! 🎉", "success");
      } else {
        showToast(res.message || "Failed to create group", "error");
      }
    } catch { showToast("Something went wrong. Please try again.", "error"); }
    setLoading(false);
  };

  const addMember = async () => {
    if (!memberUserId.trim()) return;
    setLoading(true);
    try {
      const res = await api.postParams("/api/groups/addMember", { groupId: showAddMember.id, userId: memberUserId });
      if (res?.id) {
        loadGroups();
        setMemberUserId("");
        setShowAddMember(null);
        showToast("Member added successfully! ✅", "success");
      } else {
        showToast(res?.message || "Failed to add member", "error");
      }
    } catch { showToast("Something went wrong. Please try again.", "error"); }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="page-title">My Groups</div>
          <div className="page-sub">Share and track expenses with your groups</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Group</button>
      </div>

      {groups.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">👥</div>
          <div className="empty-text">No groups yet. Create your first group to get started!</div>
        </div>
      ) : (
        <div className="groups-grid">
          {groups.map((g) => (
            <div key={g.id} className="group-card">
              <div className="group-card-name">{g.groupName}</div>
              <div className="group-card-members">
                {g.members?.length || 0} member{(g.members?.length || 0) !== 1 ? "s" : ""}
              </div>
              <div className="members-list">
                {g.members?.slice(0, 4).map((m) => (
                  <div key={m.id} className="member-chip">{m.name}</div>
                ))}
                {(g.members?.length || 0) > 4 && <div className="member-chip">+{g.members.length - 4}</div>}
              </div>
              <div className="group-card-id">ID: {g.id}</div>
              <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); setShowAddMember(g); }}>
                  + Member
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Create New Group</div>
            <div className="form-group">
              <label className="form-label">Group Name</label>
              <input className="form-input" placeholder="e.g. Goa Trip, Flat Mates, Office Lunch..." value={groupName}
                onChange={e => setGroupName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && createGroup()} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={createGroup} disabled={loading}>
                {loading ? "Creating..." : "Create Group"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="modal-overlay" onClick={() => setShowAddMember(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Add Member to "{showAddMember.groupName}"</div>
            <div className="form-group">
              <label className="form-label">User ID </label>
              <input className="form-input" placeholder="e.g. 3" type="number"
                value={memberUserId} onChange={e => setMemberUserId(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addMember()} />
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: -10, marginBottom: 10 }}>
              💡 The user must be registered first. Their ID is shown on the profile after registration.
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddMember(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={addMember} disabled={loading}>
                {loading ? "Adding..." : "Add Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EXPENSES PAGE ────────────────────────────────────────────────────────────
function ExpensesPage({ user, showToast }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [tab, setTab] = useState("expenses");
  const [showAdd, setShowAdd] = useState(false);
  const [showSettle, setShowSettle] = useState(null);
  const [settleAmt, setSettleAmt] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    description: "", amount: "", splitType: "EQUAL",
    splits: [{ userId: "", amount: "" }]
  });

  useEffect(() => {
    api.get(`/api/groups/user/${user.id}`).then(setGroups).catch(() => {});
  }, [user.id]);

  const loadGroupData = useCallback((gId) => {
    api.get(`/api/expenses/group/${gId}`).then(setExpenses).catch(() => setExpenses([]));
    api.get(`/api/expenses/balances?groupId=${gId}`).then(setBalances).catch(() => setBalances([]));
  }, []);

  useEffect(() => {
    if (selectedGroup) loadGroupData(selectedGroup.id);
  }, [selectedGroup, loadGroupData]);

  const addExpense = async () => {
    if (!form.description || !form.amount) return showToast("Please enter a description and amount", "error");
    setLoading(true);
    try {
      const body = {
        description: form.description,
        amount: parseFloat(form.amount),
        paidByUserId: user.id,
        groupId: selectedGroup.id,
        splitType: form.splitType,
        splits: form.splitType === "CUSTOM"
          ? form.splits.filter(s => s.userId && s.amount).map(s => ({ userId: parseInt(s.userId), amount: parseFloat(s.amount) }))
          : [],
      };
      const res = await api.post("/api/expenses/add", body);
      if (res.id) {
        loadGroupData(selectedGroup.id);
        setShowAdd(false);
        setForm({ description: "", amount: "", splitType: "EQUAL", splits: [{ userId: "", amount: "" }] });
        showToast("Expense added! 💸", "success");
      } else {
        showToast(res.message || "Failed to add expense", "error");
      }
    } catch { showToast("Something went wrong. Please try again.", "error"); }
    setLoading(false);
  };

  const settleBalance = async (balance) => {
    if (!settleAmt || parseFloat(settleAmt) <= 0) return showToast("Please enter a valid amount", "error");
    // We need splitId - find from balances context; using settle endpoint
    showToast("Please use the Settle page and enter the Split ID from the balances below", "error");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Expenses</div>
        <div className="page-sub">Select a group to view and manage expenses</div>
      </div>

      {/* Group selector */}
      <div className="form-group" style={{ maxWidth: 320, marginBottom: 28 }}>
        <label className="form-label">Select Group</label>
        <select className="form-input" value={selectedGroup?.id || ""} onChange={e => {
          const g = groups.find(x => x.id === parseInt(e.target.value));
          setSelectedGroup(g || null);
        }}>
          <option value="">-- Choose a group --</option>
          {groups.map(g => <option key={g.id} value={g.id}>{g.groupName} (ID: {g.id})</option>)}
        </select>
      </div>

      {!selectedGroup ? (
        <div className="empty">
          <div className="empty-icon">☝️</div>
          <div className="empty-text">Select a group from the dropdown above to get started</div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div className="tabs">
              <button className={`tab ${tab === "expenses" ? "active" : ""}`} onClick={() => setTab("expenses")}>Expenses</button>
              <button className={`tab ${tab === "balances" ? "active" : ""}`} onClick={() => setTab("balances")}>Balances</button>
            </div>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Expense</button>
          </div>

          {tab === "expenses" && (
            <div className="card">
              <div className="card-title">Expenses for "{selectedGroup.groupName}"</div>
              {expenses.length === 0 ? (
                <div className="empty" style={{ padding: "30px 0" }}>
                  <div className="empty-text" style={{ color: "var(--muted)" }}>No expenses yet</div>
                </div>
              ) : (
                expenses.map((e, i) => (
                  <div key={i} className="expense-row">
                    <div>
                      <div className="expense-desc">{e.description}</div>
                      <div className="expense-meta">💳 Paid by {e.paidBy}</div>
                    </div>
                    <div className="expense-amount">₹{e.amount?.toFixed(2)}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "balances" && (
            <div className="card">
              <div className="card-title">Balances for "{selectedGroup.groupName}"</div>
              {balances.length === 0 ? (
                <div className="empty" style={{ padding: "30px 0" }}>
                  <div className="empty-text" style={{ color: "var(--muted)" }}>All settled up! 🎉</div>
                </div>
              ) : (
                balances.map((b, i) => (
                  <div key={i} className="balance-row">
                    <div className="balance-names">
                      <strong>{b.owesUser}</strong> owes <strong>{b.getsUser}</strong>
                    </div>
                    <div className="row-actions">
                      <div className="balance-amount">₹{b.amount?.toFixed(2)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Add Expense Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Add New Expense</div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-input" placeholder="e.g. Dinner, Fuel, Groceries..."
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Total Amount (₹)</label>
              <input className="form-input" type="number" placeholder="0.00"
                value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Split Type</label>
              <select className="form-input" value={form.splitType}
                onChange={e => setForm({ ...form, splitType: e.target.value })}>
                <option value="EQUAL">Equal Split </option>
                <option value="CUSTOM">Custom Split</option>
              </select>
            </div>
            {form.splitType === "CUSTOM" && (
              <div className="form-group">
                <label className="form-label">Custom Splits</label>
                {form.splits.map((s, i) => (
                  <div key={i} className="split-row">
                    <input className="form-input" placeholder="User ID" type="number"
                      value={s.userId} onChange={e => {
                        const sp = [...form.splits]; sp[i].userId = e.target.value; setForm({ ...form, splits: sp });
                      }} />
                    <input className="form-input" placeholder="Amount ₹" type="number"
                      value={s.amount} onChange={e => {
                        const sp = [...form.splits]; sp[i].amount = e.target.value; setForm({ ...form, splits: sp });
                      }} />
                    {form.splits.length > 1 && (
                      <button className="btn btn-danger btn-sm" onClick={() => {
                        setForm({ ...form, splits: form.splits.filter((_, j) => j !== i) });
                      }}>✕</button>
                    )}
                  </div>
                ))}
                <button className="btn btn-secondary btn-sm" onClick={() =>
                  setForm({ ...form, splits: [...form.splits, { userId: "", amount: "" }] })
                }>+ Add Another</button>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
                  Total of all splits must equal the total amount
                </div>
              </div>
            )}
            <div className="info-box">
              💡 This expense will be recorded as paid by <strong style={{ color: "var(--text)" }}>{user.name}</strong>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addExpense} disabled={loading}>
                {loading ? "Adding..." : "Add Expense"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SETTLE PAGE ──────────────────────────────────────────────────────────────
function SettlePage({ user, showToast }) {
  const [splitId, setSplitId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const settle = async () => {
    if (!splitId || !amount) return showToast("Please enter both the Split ID and amount", "error");
    setLoading(true);
    try {
      const res = await api.postParams("/api/expenses/settle", { splitId, paidAmount: amount });
      if (res?.id !== undefined || res?.amountOwed !== undefined) {
        setResult(res);
        showToast(res.settled ? "Fully settled! ✅" : "Partial payment recorded ✅", "success");
        setSplitId(""); setAmount("");
      } else {
        showToast(res?.message || "Settlement failed", "error");
      }
    } catch { showToast("Something went wrong. Please try again.", "error"); }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Settle Payments</div>
        <div className="page-sub">Record a payment to settle outstanding balances</div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">Settle Payment</div>
          <div className="form-group">
            <label className="form-label">Split ID</label>
            <input className="form-input" type="number" placeholder="e.g. 5"
              value={splitId} onChange={e => setSplitId(e.target.value)} />
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: -12, marginBottom: 16 }}>
            💡 Find the Split ID on the Expenses → Balances tab
          </div>
          <div className="form-group">
            <label className="form-label">Paid Amount (₹)</label>
            <input className="form-input" type="number" placeholder="0.00"
              value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 18 }}>
            💡 Paying the full amount will mark the split as settled. Partial payments will reduce the remaining balance.
          </div>
          <button className="btn btn-success btn-full" onClick={settle} disabled={loading}>
            {loading ? "Processing..." : "✅ Settle Up"}
          </button>
        </div>

        <div className="card">
          <div className="card-title">Result</div>
          {result ? (
            <div>
              <div style={{ marginBottom: 14 }}>
                <span className={`badge ${result.settled ? "badge-green" : "badge-red"}`}>
                  {result.settled ? "SETTLED ✅" : "PARTIAL"}
                </span>
              </div>
              <div className="balance-row" style={{ paddingTop: 0 }}>
                <span style={{ color: "var(--muted)", fontSize: 14 }}>Remaining balance</span>
                <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: result.settled ? "var(--green)" : "var(--accent2)" }}>
                  ₹{result.amountOwed?.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <div className="empty" style={{ padding: "30px 0" }}>
              <div className="empty-text">The settlement result will appear here after processing</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── INVITATIONS PAGE ─────────────────────────────────────────────────────────
function InvitationsPage({ user, showToast }) {
  const [invitations, setInvitations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [inviteGroupId, setInviteGroupId] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const loadInvitations = useCallback(() => {
    api.get(`/api/invitations/${user.email}`).then(setInvitations).catch(() => setInvitations([]));
  }, [user.email]);

  useEffect(() => {
    loadInvitations();
    api.get(`/api/groups/user/${user.id}`).then(setGroups).catch(() => {});
  }, [loadInvitations, user.id]);

  const sendInvite = async () => {
    if (!inviteGroupId || !inviteEmail) return showToast("Please select a group and enter an email", "error");
    setLoading(true);
    try {
      const res = await api.postParams("/api/invitations/invite", { groupId: inviteGroupId, email: inviteEmail });
      if (res?.id) {
        setInviteEmail(""); setInviteGroupId("");
        showToast("Invitation sent! 📨", "success");
      } else {
        showToast(res?.message || "Failed to send invitation", "error");
      }
    } catch { showToast("Something went wrong. Please try again.", "error"); }
    setLoading(false);
  };

  const handleInv = async (id, action) => {
    try {
      await api.postParams(`/api/invitations/${action}`, { invitationId: id });
      loadInvitations();
      showToast(action === "accept" ? "Invitation accepted! 🎉" : "Invitation declined", action === "accept" ? "success" : "error");
    } catch { showToast("Something went wrong. Please try again.", "error"); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Invitations</div>
        <div className="page-sub">Send and manage group invitations</div>
      </div>

      <div className="two-col">
        {/* Send invitation */}
        <div className="card">
          <div className="card-title">📨 Send an Invitation</div>
          <div className="form-group">
            <label className="form-label">Select Group</label>
            <select className="form-input" value={inviteGroupId} onChange={e => setInviteGroupId(e.target.value)}>
              <option value="">-- Choose a group --</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.groupName}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Recipient's Email</label>
            <input className="form-input" type="email" placeholder="friend@email.com"
              value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-full" onClick={sendInvite} disabled={loading}>
            {loading ? "Sending..." : "Send Invitation"}
          </button>
        </div>

        {/* Received invitations */}
        <div className="card">
          <div className="card-title">📬 Received Invitations</div>
          {invitations.length === 0 ? (
            <div className="empty" style={{ padding: "20px 0" }}>
              <div className="empty-text">No pending invitations</div>
            </div>
          ) : (
            invitations.map((inv) => (
              <div key={inv.id} className="inv-row">
                <div className="inv-info">
                  <div className="inv-group">{inv.group?.groupName || "Unknown Group"}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>Group ID: {inv.group?.id}</div>
                </div>
                <div className="inv-actions">
                  <button className="btn btn-success btn-sm" onClick={() => handleInv(inv.id, "accept")}>✓ Accept</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleInv(inv.id, "reject")}>✕</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sw_user")); } catch { return null; }
  });
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState({ msg: "", type: "" });

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
  }, []);

  const login = (u) => {
    localStorage.setItem("sw_user", JSON.stringify(u));
    setUser(u);
    setPage("dashboard");
  };

  const logout = () => {
    localStorage.removeItem("sw_user");
    setUser(null);
  };

  const navItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "groups", icon: "👥", label: "Groups" },
    { id: "expenses", icon: "💸", label: "Expenses" },
    { id: "settle", icon: "✅", label: "Settle" },
    { id: "invitations", icon: "📬", label: "Invitations" },
  ];

  if (!user) return (
    <>
      <style>{styles}</style>
      <AuthPage onLogin={login} />
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">💸</div>
            Split<span>wise</span>
          </div>
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-email">{user.email}</div>
            </div>
          </div>
          {navItems.map((n) => (
            <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </div>
          ))}
          <div className="sidebar-bottom">
            <button className="btn btn-secondary btn-full btn-sm" style={{ justifyContent: "flex-start" }} onClick={logout}>🚪 Sign Out</button>
          </div>
        </div>

        <div className="main">
          {page === "dashboard" && <Dashboard user={user} />}
          {page === "groups" && <GroupsPage user={user} showToast={showToast} />}
          {page === "expenses" && <ExpensesPage user={user} showToast={showToast} />}
          {page === "settle" && <SettlePage user={user} showToast={showToast} />}
          {page === "invitations" && <InvitationsPage user={user} showToast={showToast} />}
        </div>
      </div>

      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: "", type: "" })} />
    </>
  );
}