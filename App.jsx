import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const LANGUAGES = ["Java", "JavaScript", "Python", "C++", "C", "TypeScript", "SQL", "Go"];

export default function App() {
  const [language, setLanguage] = useState("Java");
  const [code, setCode] = useState("");
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    try {
      const res = await fetch("/api/reviews");
      setHistory(await res.json());
    } catch {
      setError("Cannot reach the backend. Is it running on port 8080?");
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const submit = async () => {
    setError("");
    if (!code.trim()) return setError("Paste some code to review.");
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Review failed");
      }
      setCurrent(await res.json());
      loadHistory();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    if (current?.id === id) setCurrent(null);
    loadHistory();
  };

  const open = (item) => { setCurrent(item); setLanguage(item.language); setCode(item.code); };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>History</h2>
        {history.length === 0 && <p className="muted">No reviews yet. Submit code to get started.</p>}
        {history.map((h) => (
          <div key={h.id} className={`item ${current?.id === h.id ? "active" : ""}`}>
            <button className="item-main" onClick={() => open(h)}>
              <strong>{h.language}</strong>
              <span className="muted">{new Date(h.createdAt).toLocaleString()}</span>
              <code>{h.code.slice(0, 40).replace(/\s+/g, " ")}</code>
            </button>
            <button className="del" onClick={() => remove(h.id)} aria-label="Delete review">Delete</button>
          </div>
        ))}
      </aside>

      <main className="main">
        <h1>AI Code Reviewer</h1>
        <p className="muted">Paste your code and get bug reports, optimizations, and an improved version.</p>

        <div className="row">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
          <button className="primary" onClick={submit} disabled={loading}>
            {loading ? "Reviewing..." : "Review code"}
          </button>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here"
          spellCheck="false"
        />

        {error && <div className="error">{error}</div>}

        {current && (
          <section className="result">
            <h2>Review</h2>
            <ReactMarkdown>{current.review}</ReactMarkdown>
          </section>
        )}
      </main>
    </div>
  );
}
