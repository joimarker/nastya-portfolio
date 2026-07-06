"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const timeout = AbortSignal.timeout(10000);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        signal: timeout,
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }
      setError("Неверный пароль");
    } catch {
      setError("Не удаётся связаться с сервером. Проверьте подключение к сети и повторите попытку.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: 24 }}>Вход в админку</h2>
        <div className="field">
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn" type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Проверка..." : "Войти"}
        </button>
      </form>
    </div>
  );
}
