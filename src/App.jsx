import { useState, useEffect, useCallback } from "react";

const API = "https://splitwise-backend-nxy3.onrender.com";

// ─── API HELPERS ───────────────────────────────────────────────────────────


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
      r.json().catch(() => ({}))
    );
  },
  get: (url) => fetch(`${API}${url}`).then((r) => r.json()),
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0f0f11; --surface: #18181c; --surface2: #222228; --border: #2e2e38;
    --accent: #7c6af7; --accent2: #f97316; --green: #22c55e; --red: #ef4444;
    --yellow: #eab308; --text: #f0f0f5; --muted: #6b6b7e;
    --font-head: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
    --radius: 14px; --radius-sm: 8px;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }
  .app { display: flex; min-height: 100vh; }

  /* Sidebar */
  .sidebar { width: 240px; min-height: 100vh; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 28px 0; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
  .logo { font-family: var(--font-head); font-size: 22px; font-weight: 800; padding: 0 24px 24px; border-bottom: 1px solid var(--border); margin-bottom: 12px; }
  .logo span { color: var(--accent); }
  .logo em { color: var(--accent2); font-style: normal; }
  .sidebar-user { padding: 12px 24px 16px; border-bottom: 1px solid var(--border); margin-bottom: 12px; }
  .sidebar-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; margin-bottom: 10px; }
  .sidebar-name { font-weight: 600; font-size: 14px; }
  .sidebar-email { font-size: 12px; color: var(--muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 11px 24px; cursor: pointer; color: var(--muted); font-size: 14px; font-weight: 500; border-left: 3px solid transparent; transition: all 0.15s; }
  .nav-item:hover { color: var(--text); background: var(--surface2); }
  .nav-item.active { color: var(--accent); border-left-color: var(--accent); background: rgba(124,106,247,0.08); }
  .sidebar-bottom { margin-top: auto; padding: 16px 24px; border-top: 1px solid var(--border); }

  /* Main */
  .main { margin-left: 240px; flex: 1; padding: 40px 44px; }

  /* Auth */
  .auth-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); }
  .auth-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 44px 40px; width: 100%; max-width: 420px; }
  .auth-logo { font-family: var(--font-head); font-size: 26px; font-weight: 800; margin-bottom: 4px; }
  .auth-logo span { color: var(--accent); }
  .auth-logo em { color: var(--accent2); font-style: normal; }
  .auth-sub { color: var(--muted); font-size: 14px; margin-bottom: 32px; }
  .auth-switch { text-align: center; margin-top: 20px; font-size: 14px; color: var(--muted); }
  .auth-switch button { background: none; border: none; color: var(--accent); cursor: pointer; font-weight: 600; font-family: var(--font-body); font-size: 14px; }

  /* Forms */
  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 12px; font-weight: 500; color: var(--muted); margin-bottom: 7px; text-transform: uppercase; letter-spacing: 0.4px; }
  .form-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 11px 14px; color: var(--text); font-family: var(--font-body); font-size: 15px; outline: none; transition: border-color 0.15s; }
  .form-input:focus { border-color: var(--accent); }
  .form-input::placeholder { color: var(--muted); }
  select.form-input option { background: var(--surface2); }

  /* Buttons */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 10px 20px; border-radius: var(--radius-sm); border: none; font-family: var(--font-body); font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: #6a58e8; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger { background: rgba(239,68,68,0.1); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }
  .btn-success { background: rgba(34,197,94,0.1); color: var(--green); border: 1px solid rgba(34,197,94,0.2); }
  .btn-success:hover { background: rgba(34,197,94,0.18); }
  .btn-full { width: 100%; }
  .btn-sm { padding: 7px 14px; font-size: 13px; }
  .btn-xs { padding: 5px 12px; font-size: 12px; }

  /* Page */
  .page-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; }
  .page-title { font-family: var(--font-head); font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
  .page-sub { color: var(--muted); font-size: 14px; margin-top: 5px; }

  /* Cards */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-bottom: 20px; }
  .card-title { font-family: var(--font-head); font-size: 15px; font-weight: 700; margin-bottom: 20px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }

  /* Stats */
  .stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 28px; }
  .stat-box { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 22px; }
  .stat-label { font-size: 12px; color: var(--muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
  .stat-val { font-family: var(--font-head); font-size: 32px; font-weight: 800; letter-spacing: -1px; }
  .green { color: var(--green); } .red { color: var(--red); } .accent { color: var(--accent); }

  /* Groups */
  .groups-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px,1fr)); gap: 16px; }
  .group-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 22px; transition: all 0.15s; }
  .group-card:hover { border-color: var(--accent); box-shadow: 0 6px 20px rgba(124,106,247,0.1); }
  .group-name { font-family: var(--font-head); font-size: 17px; font-weight: 700; margin-bottom: 6px; }
  .member-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
  .chip { background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; padding: 3px 11px; font-size: 12px; color: var(--text); }

  /* Tabs */
  .tabs { display: flex; gap: 2px; background: var(--surface2); padding: 4px; border-radius: 10px; width: fit-content; margin-bottom: 24px; }
  .tab { padding: 8px 20px; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; color: var(--muted); border: none; background: none; font-family: var(--font-body); transition: all 0.15s; }
  .tab.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,0.3); }

  /* Expense rows */
  .exp-row { display: flex; align-items: center; gap: 14px; padding: 16px 0; border-bottom: 1px solid var(--border); }
  .exp-row:last-child { border-bottom: none; }
  .exp-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(124,106,247,0.12); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .exp-info { flex: 1; }
  .exp-desc { font-size: 15px; font-weight: 500; }
  .exp-meta { font-size: 12px; color: var(--muted); margin-top: 3px; }
  .exp-amt { font-family: var(--font-head); font-weight: 800; font-size: 18px; color: var(--text); flex-shrink: 0; }

  /* Balance rows — Splitwise style */
  .bal-row { display: flex; align-items: center; gap: 14px; padding: 16px 0; border-bottom: 1px solid var(--border); }
  .bal-row:last-child { border-bottom: none; }
  .bal-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; flex-shrink: 0; font-family: var(--font-head); }
  .bal-icon.owe { background: rgba(239,68,68,0.12); color: var(--red); }
  .bal-icon.get { background: rgba(34,197,94,0.12); color: var(--green); }
  .bal-info { flex: 1; min-width: 0; }
  .bal-main { font-size: 14px; font-weight: 500; }
  .bal-main strong { color: var(--accent); }
  .bal-sub { font-size: 12px; color: var(--muted); margin-top: 3px; }
  .bal-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }
  .bal-amt { font-family: var(--font-head); font-weight: 800; font-size: 17px; }
  .bal-amt.owe { color: var(--red); }
  .bal-amt.get { color: var(--green); }
  .settle-row { display: flex; align-items: center; gap: 6px; }
  .settle-inp { width: 90px; background: var(--surface2); border: 1px solid var(--border); border-radius: 6px; padding: 6px 10px; color: var(--text); font-size: 13px; font-family: var(--font-body); outline: none; }
  .settle-inp:focus { border-color: var(--green); }

  /* Member picker in custom split */
  .member-pick-row { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; }
  .member-pick-row .form-input { flex: 1; }

  /* Invitations */
  .inv-row { display: flex; align-items: center; gap: 14px; padding: 16px 0; border-bottom: 1px solid var(--border); }
  .inv-row:last-child { border-bottom: none; }
  .inv-info { flex: 1; }
  .inv-group-name { font-weight: 600; font-size: 15px; }
  .inv-meta { font-size: 12px; color: var(--muted); margin-top: 3px; }
  .inv-actions { display: flex; gap: 8px; }

  /* Modal */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 24px; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 32px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
  .modal-title { font-family: var(--font-head); font-size: 20px; font-weight: 800; margin-bottom: 24px; }
  .modal-footer { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }

  /* Alert box */
  .alert { padding: 12px 16px; border-radius: var(--radius-sm); font-size: 13px; margin-bottom: 18px; }
  .alert-info { background: rgba(124,106,247,0.08); border: 1px solid rgba(124,106,247,0.2); color: #a89df5; }
  .alert-err { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #f87171; }
  .alert-ok { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); color: #4ade80; }

  /* Toast */
  .toast { position: fixed; bottom: 28px; right: 28px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 14px 20px; font-size: 14px; font-weight: 500; z-index: 999; max-width: 340px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); animation: up 0.2s ease; }
  .toast.success { border-color: var(--green); color: var(--green); }
  .toast.error { border-color: var(--red); color: var(--red); }
  @keyframes up { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

  .empty { text-align: center; padding: 48px 24px; color: var(--muted); }
  .empty-icon { font-size: 44px; margin-bottom: 12px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .divider { height: 1px; background: var(--border); margin: 20px 0; }
  @media (max-width: 860px) { .two-col { grid-template-columns: 1fr; } .stats-row { grid-template-columns: 1fr; } }
`;

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  if (!msg) return null;
  return <div className={`toast ${type}`}>{msg}</div>;
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const h = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");
    if (!form.email || !form.password) return setError("Email and password are required");
    setLoading(true);
    try {
      if (mode === "register") {
        if (!form.name) return setError("Name is required");
        const res = await api.post("/api/users/register", form);
        if (res.id) { setMode("login"); setError("✅ Registered! Please login now."); setForm({ name: "", email: form.email, password: "" }); }
        else setError(res.message || "Registration failed");
      } else {
        const res = await api.post("/api/users/login", { email: form.email, password: form.password });
        if (res?.id) onLogin(res);
        else setError("Incorrect email or password");
      }
    } catch { setError("Cannot connect to server. Is the backend running on port 8080?"); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo"><span>Split</span><em>wise</em></div>
        <div className="auth-sub">{mode === "login" ? "Sign in to your account" : "Create a new account"}</div>
        {error && <div className={`alert ${error.startsWith("✅") ? "alert-ok" : "alert-err"}`}>{error}</div>}
        {mode === "register" && (
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" name="name" placeholder="Your full name" value={form.name} onChange={h} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={h} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={h} onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        <button className="btn btn-primary btn-full" onClick={submit} disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>
        <div className="auth-switch">
          {mode === "login"
            ? <>New here? <button onClick={() => { setMode("register"); setError(""); }}>Create account</button></>
            : <>Already have an account? <button onClick={() => { setMode("login"); setError(""); }}>Sign in</button></>}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user }) {
  const [data, setData] = useState(null);
  useEffect(() => { api.get(`/api/expenses/dashboard/${user.id}`).then(setData).catch(() => {}); }, [user.id]);
  const fmt = (n) => `₹${Math.abs(n ?? 0).toFixed(2)}`;

  return (
    <div>
      <div className="page-top">
        <div>
          <div className="page-title">Hello, {user.name} 👋</div>
          <div className="page-sub">Here's your expense summary</div>
        </div>
      </div>
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-label">Total Balance</div>
          <div className={`stat-val ${(data?.totalBalance ?? 0) >= 0 ? "green" : "red"}`}>
            {data ? ((data.totalBalance >= 0 ? "+" : "-") + fmt(data.totalBalance)) : "—"}
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-label">You are owed</div>
          <div className="stat-val green">{data ? fmt(data.youGet) : "—"}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">You owe</div>
          <div className="stat-val red">{data ? fmt(data.youOwe) : "—"}</div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">How it works</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 14 }}>
          {[
            { icon: "👥", t: "1. Create a group", d: "Go to Groups → create a new group" },
            { icon: "📨", t: "2. Invite friends", d: "Go to Invitations → enter their email" },
            { icon: "💸", t: "3. Add expenses", d: "Go to Expenses → pick group → add expense" },
            { icon: "✅", t: "4. Settle up", d: "Expenses → Balances tab → settle inline" },
          ].map(x => (
            <div key={x.t} style={{ background: "var(--surface2)", borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{x.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 5 }}>{x.t}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{x.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── GROUPS ───────────────────────────────────────────────────────────────────
function GroupsPage({ user, showToast }) {
  const [groups, setGroups] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    api.get(`/api/groups/user/${user.id}`).then(setGroups).catch(() => {});
  }, [user.id]);
  useEffect(() => { load(); }, [load]);

  const create = async () => {
    if (!groupName.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/api/groups/create", { groupName });
      if (res.id) {
        await api.postParams("/api/groups/addMember", { groupId: res.id, userId: user.id });
        load(); setGroupName(""); setShowCreate(false);
        showToast("Group created! Now invite friends from Invitations tab.", "success");
      } else showToast(res.message || "Could not create group", "error");
    } catch { showToast("Something went wrong", "error"); }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-top">
        <div>
          <div className="page-title">My Groups</div>
          <div className="page-sub">Manage your expense groups</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Group</button>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 24 }}>
        💡 To add members to a group, go to the <strong>Invitations</strong> tab and send them an invite using their email.
      </div>

      {groups.length === 0 ? (
        <div className="empty"><div className="empty-icon">👥</div><div>No groups yet. Create your first one!</div></div>
      ) : (
        <div className="groups-grid">
          {groups.map(g => (
            <div key={g.id} className="group-card">
              <div className="group-name">{g.groupName}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{g.members?.length || 0} member(s)</div>
              <div className="member-chips">
                {g.members?.map(m => <div key={m.id} className="chip">{m.name}</div>)}
              </div>
              <div style={{ fontSize: 11, color: "var(--border)", marginTop: 14, fontFamily: "monospace" }}>ID: {g.id}</div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Create New Group</div>
            <div className="form-group">
              <label className="form-label">Group Name</label>
              <input className="form-input" placeholder="e.g. Goa Trip, Flatmates, Office Lunch..." autoFocus
                value={groupName} onChange={e => setGroupName(e.target.value)} onKeyDown={e => e.key === "Enter" && create()} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={create} disabled={loading}>{loading ? "Creating..." : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EXPENSES ─────────────────────────────────────────────────────────────────
function ExpensesPage({ user, showToast }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [tab, setTab] = useState("expenses");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settleState, setSettleState] = useState({});

  // form state
  const [form, setForm] = useState({ description: "", amount: "", splitType: "EQUAL", customSplits: [] });

  useEffect(() => {
    api.get(`/api/groups/user/${user.id}`).then(setGroups).catch(() => {});
  }, [user.id]);

  const loadData = useCallback((gId) => {
    api.get(`/api/expenses/group/${gId}`).then(setExpenses).catch(() => setExpenses([]));
    api.get(`/api/expenses/balances?groupId=${gId}`).then(res => setBalances(Array.isArray(res) ? res : [])).catch(() => setBalances([]));
    setSettleState({});
  }, []);

  useEffect(() => { if (selectedGroup) loadData(selectedGroup.id); }, [selectedGroup, loadData]);

  // When group selected or modal opens, init custom splits from members
  const openAddModal = () => {
    const members = (selectedGroup?.members || []).filter(m => m.id !== user.id);
    setForm({
      description: "", amount: "", splitType: "EQUAL",
      customSplits: members.map(m => ({ userId: m.id, name: m.name, amount: "" }))
    });
    setShowAdd(true);
  };

  const addExpense = async () => {
    if (!form.description.trim()) return showToast("Please enter a description", "error");
    const total = parseFloat(form.amount);
    if (!total || total <= 0) return showToast("Please enter a valid amount", "error");

    if (form.splitType === "CUSTOM") {
      const customTotal = form.customSplits.reduce((s, x) => s + (parseFloat(x.amount) || 0), 0);
      if (Math.abs(customTotal - total) > 0.01)
        return showToast(`Custom split total (₹${customTotal.toFixed(2)}) must equal expense amount (₹${total.toFixed(2)})`, "error");
    }

    setLoading(true);
    try {
      const body = {
        description: form.description,
        amount: total,
        paidByUserId: user.id,
        groupId: selectedGroup.id,
        splitType: form.splitType,
        splits: form.splitType === "CUSTOM"
          ? form.customSplits.filter(s => s.amount).map(s => ({ userId: s.userId, amount: parseFloat(s.amount) }))
          : [],
      };
      const res = await api.post("/api/expenses/add", body);
      if (res.id) {
        loadData(selectedGroup.id);
        setShowAdd(false);
        showToast("Expense added successfully! 💸", "success");
      } else {
        showToast(res.message || "Could not add expense", "error");
      }
    } catch { showToast("Server error", "error"); }
    setLoading(false);
  };

  const settle = async (b, idx) => {
    const amt = parseFloat(settleState[idx]?.amount);
    if (!amt || amt <= 0) return showToast("Enter an amount first", "error");
    if (!b.splitId) return showToast("splitId missing — update BalanceDTO in backend", "error");

    setSettleState(p => ({ ...p, [idx]: { ...p[idx], loading: true } }));
    try {
      const res = await api.postParams("/api/expenses/settle", { splitId: b.splitId, paidAmount: amt });
      if (res !== undefined) {
        loadData(selectedGroup.id);
        showToast(res.settled ? "Fully settled! ✅" : `₹${amt.toFixed(2)} recorded. ₹${res.amountOwed?.toFixed(2)} remaining.`, "success");
      } else showToast("Could not settle", "error");
    } catch { showToast("Something went wrong", "error"); }
    setSettleState(p => ({ ...p, [idx]: { ...p[idx], loading: false } }));
  };

  // Figure out if current user owes or is owed for each balance
  const myBalances = balances.map(b => ({
    ...b,
    iOwe: b.owesUser === user.name,
    iGetPaid: b.getsUser === user.name,
  }));

  return (
    <div>
      <div className="page-top">
        <div>
          <div className="page-title">Expenses</div>
          <div className="page-sub">Track, split, and settle expenses</div>
        </div>
        {selectedGroup && <button className="btn btn-primary" onClick={openAddModal}>+ Add Expense</button>}
      </div>

      <div style={{ maxWidth: 340, marginBottom: 28 }}>
        <label className="form-label">Select Group</label>
        <select className="form-input" value={selectedGroup?.id || ""} onChange={e => {
          const g = groups.find(x => x.id === parseInt(e.target.value));
          setSelectedGroup(g || null); setTab("expenses");
        }}>
          <option value="">— Choose a group —</option>
          {groups.map(g => <option key={g.id} value={g.id}>{g.groupName}</option>)}
        </select>
      </div>

      {!selectedGroup ? (
        <div className="empty"><div className="empty-icon">☝️</div><div>Select a group above to get started</div></div>
      ) : (
        <>
          <div className="tabs">
            <button className={`tab ${tab === "expenses" ? "active" : ""}`} onClick={() => setTab("expenses")}>
              Expenses {expenses.length > 0 && `(${expenses.length})`}
            </button>
            <button className={`tab ${tab === "balances" ? "active" : ""}`} onClick={() => setTab("balances")}>
              Balances & Settle {balances.length > 0 && `(${balances.length})`}
            </button>
          </div>

          {/* EXPENSES TAB */}
          {tab === "expenses" && (
            <div className="card">
              <div className="card-title">{selectedGroup.groupName} — All Expenses</div>
              {expenses.length === 0 ? (
                <div className="empty" style={{ padding: "28px 0" }}>
                  <div className="empty-icon">💸</div>
                  <div>No expenses yet — add the first one!</div>
                </div>
              ) : expenses.map((e, i) => (
                <div key={i} className="exp-row">
                  <div className="exp-icon">💳</div>
                  <div className="exp-info">
                    <div className="exp-desc">{e.description}</div>
                    <div className="exp-meta">Paid by <strong style={{ color: "var(--accent)" }}>{e.paidBy}</strong></div>
                  </div>
                  <div className="exp-amt">₹{parseFloat(e.amount).toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}

          {/* BALANCES TAB */}
          {tab === "balances" && (
            <div className="card">
              <div className="card-title">{selectedGroup.groupName} — Who Owes What</div>
              {balances.length === 0 ? (
                <div className="empty" style={{ padding: "28px 0" }}>
                  <div className="empty-icon">🎉</div>
                  <div>All settled up!</div>
                </div>
              ) : myBalances.map((b, idx) => (
                <div key={idx} className="bal-row">
                  <div className={`bal-icon ${b.iOwe ? "owe" : "get"}`}>
                    {b.iOwe ? "↑" : "↓"}
                  </div>
                  <div className="bal-info">
                    <div className="bal-main">
                      <strong>{b.owesUser}</strong>
                      <span style={{ color: "var(--muted)" }}> owes </span>
                      <strong>{b.getsUser}</strong>
                    </div>
                    <div className="bal-sub">for "{b.expenseDescription || "expense"}"</div>
                  </div>
                  <div className="bal-right">
                    <div className={`bal-amt ${b.iOwe ? "owe" : "get"}`}>
                      {b.iOwe ? "-" : "+"}₹{parseFloat(b.amount).toFixed(2)}
                    </div>
                    <div className="settle-row">
                      <input className="settle-inp" type="number" placeholder="₹ pay"
                        value={settleState[idx]?.amount || ""}
                        onChange={e => setSettleState(p => ({ ...p, [idx]: { ...p[idx], amount: e.target.value } }))} />
                      <button className="btn btn-success btn-xs" disabled={settleState[idx]?.loading}
                        onClick={() => settle(b, idx)}>
                        {settleState[idx]?.loading ? "..." : "Settle"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ADD EXPENSE MODAL */}
      {showAdd && (
        <div className="overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Add New Expense</div>

            <div className="alert alert-info">
              Paid by <strong>{user.name}</strong> (you) in <strong>{selectedGroup.groupName}</strong>
            </div>

            <div className="form-group">
              <label className="form-label">What was this expense?</label>
              <input className="form-input" placeholder="e.g. Dinner, Petrol, Groceries..." autoFocus
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Total Amount (₹)</label>
              <input className="form-input" type="number" placeholder="0.00"
                value={form.amount} onChange={e => {
                  const amt = e.target.value;
                  // auto fill equal split preview
                  const members = (selectedGroup?.members || []).filter(m => m.id !== user.id);
                  const each = members.length > 0 ? (parseFloat(amt) / members.length) : 0;
                  setForm(f => ({
                    ...f, amount: amt,
                    customSplits: f.customSplits.map(s => ({ ...s, amount: f.splitType === "EQUAL" ? each.toFixed(2) : s.amount }))
                  }));
                }} />
            </div>

            <div className="form-group">
              <label className="form-label">How to Split?</label>
              <select className="form-input" value={form.splitType} onChange={e => {
                const type = e.target.value;
                const members = (selectedGroup?.members || []).filter(m => m.id !== user.id);
                const each = members.length > 0 && form.amount ? (parseFloat(form.amount) / members.length).toFixed(2) : "";
                setForm(f => ({
                  ...f, splitType: type,
                  customSplits: members.map(m => ({ userId: m.id, name: m.name, amount: type === "EQUAL" ? each : "" }))
                }));
              }}>
                <option value="EQUAL">Equal split — divide equally among all members</option>
                <option value="CUSTOM">Custom split — set each person's share</option>
              </select>
            </div>

            {/* Show members and their split */}
            <div className="form-group">
              <label className="form-label">Split breakdown</label>
              {form.customSplits.length === 0 ? (
                <div className="alert alert-err">This group has no other members yet. Invite someone first.</div>
              ) : form.customSplits.map((s, i) => (
                <div key={s.userId} className="member-pick-row">
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: 14 }}>{s.name}</span>
                  </div>
                  <input className="form-input" type="number" placeholder="₹ amount"
                    style={{ width: 120 }}
                    value={s.amount}
                    readOnly={form.splitType === "EQUAL"}
                    onChange={e => {
                      if (form.splitType === "EQUAL") return;
                      const sp = [...form.customSplits]; sp[i] = { ...sp[i], amount: e.target.value };
                      setForm(f => ({ ...f, customSplits: sp }));
                    }} />
                </div>
              ))}
              {form.splitType === "CUSTOM" && form.amount && (
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 10 }}>
                  Total split: ₹{form.customSplits.reduce((s, x) => s + (parseFloat(x.amount) || 0), 0).toFixed(2)} / ₹{parseFloat(form.amount).toFixed(2)}
                </div>
              )}
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

// ─── INVITATIONS ──────────────────────────────────────────────────────────────
function InvitationsPage({ user, showToast }) {
  const [invitations, setInvitations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [inviteGroupId, setInviteGroupId] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const loadInv = useCallback(() => {
    api.get(`/api/invitations/${user.email}`).then(res => setInvitations(Array.isArray(res) ? res : [])).catch(() => setInvitations([]));
  }, [user.email]);

  useEffect(() => {
    loadInv();
    api.get(`/api/groups/user/${user.id}`).then(setGroups).catch(() => {});
  }, [loadInv, user.id]);

  const sendInvite = async () => {
    if (!inviteGroupId || !inviteEmail.trim()) return showToast("Select a group and enter email", "error");
    setLoading(true);
    try {
      const res = await api.postParams("/api/invitations/invite", { groupId: inviteGroupId, email: inviteEmail });
      if (res?.id) { setInviteEmail(""); setInviteGroupId(""); showToast("Invitation sent! 📨", "success"); }
      else showToast(res?.message || "Could not send invite — is the user registered?", "error");
    } catch { showToast("Something went wrong", "error"); }
    setLoading(false);
  };

  const handleInv = async (id, action) => {
    try {
      await api.postParams(`/api/invitations/${action}`, { invitationId: id });
      loadInv();
      showToast(action === "accept" ? "Joined the group! 🎉" : "Invitation declined", action === "accept" ? "success" : "error");
    } catch { showToast("Something went wrong", "error"); }
  };

  return (
    <div>
      <div className="page-top">
        <div>
          <div className="page-title">Invitations</div>
          <div className="page-sub">Invite friends to your groups</div>
        </div>
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-title">Send an Invitation</div>
          <div className="alert alert-info" style={{ marginBottom: 18 }}>
            The person must have already created an account before you can invite them.
          </div>
          <div className="form-group">
            <label className="form-label">Group</label>
            <select className="form-input" value={inviteGroupId} onChange={e => setInviteGroupId(e.target.value)}>
              <option value="">— Select group —</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.groupName}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Friend's Email</label>
            <input className="form-input" type="email" placeholder="friend@example.com"
              value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendInvite()} />
          </div>
          <button className="btn btn-primary btn-full" onClick={sendInvite} disabled={loading}>
            {loading ? "Sending..." : "Send Invitation"}
          </button>
        </div>

        <div className="card">
          <div className="card-title">Received Invitations</div>
          {invitations.length === 0 ? (
            <div className="empty" style={{ padding: "20px 0" }}><div>No pending invitations</div></div>
          ) : invitations.map(inv => (
            <div key={inv.id} className="inv-row">
              <div className="inv-info">
                <div className="inv-group-name">{inv.group?.groupName || "Group"}</div>
                <div className="inv-meta">{inv.group?.members?.length || 0} members already in this group</div>
              </div>
              <div className="inv-actions">
                <button className="btn btn-success btn-sm" onClick={() => handleInv(inv.id, "accept")}>Join</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleInv(inv.id, "reject")}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("sw_user")); } catch { return null; } });
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState({ msg: "", type: "" });
  const showToast = useCallback((msg, type = "success") => setToast({ msg, type }), []);

  const login = (u) => { localStorage.setItem("sw_user", JSON.stringify(u)); setUser(u); };
  const logout = () => { localStorage.removeItem("sw_user"); setUser(null); };

  const nav = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "groups",    icon: "👥", label: "Groups" },
    { id: "expenses",  icon: "💸", label: "Expenses" },
    { id: "invitations", icon: "📬", label: "Invitations" },
  ];

  if (!user) return <><style>{styles}</style><AuthPage onLogin={login} /></>;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="sidebar">
          <div className="logo"><span>Split</span><em>wise</em></div>
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div className="sidebar-name">{user.name}</div>
            <div className="sidebar-email">{user.email}</div>
          </div>
          {nav.map(n => (
            <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
              <span>{n.icon}</span>{n.label}
            </div>
          ))}
          <div className="sidebar-bottom">
            <button className="btn btn-secondary btn-full btn-sm" onClick={logout}>Sign Out</button>
          </div>
        </div>
        <div className="main">
          {page === "dashboard"    && <Dashboard user={user} />}
          {page === "groups"       && <GroupsPage user={user} showToast={showToast} />}
          {page === "expenses"     && <ExpensesPage user={user} showToast={showToast} />}
          {page === "invitations"  && <InvitationsPage user={user} showToast={showToast} />}
        </div>
      </div>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: "", type: "" })} />
    </>
  );
}