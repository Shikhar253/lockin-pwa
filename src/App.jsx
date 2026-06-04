import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

const USER_ID = "shikhar";

const HABITS = [
  { id: "sde",      label: "SDE PREP",     icon: "⌨️", desc: "DSA / System Design / Projects" },
  { id: "eat",      label: "EAT CLEAN",    icon: "🥗", desc: "No junk. Real fuel." },
  { id: "exercise", label: "EXERCISE",     icon: "🔥", desc: "Sweat. Every. Day." },
  { id: "nofap",    label: "NO GOONING",   icon: "🧠", desc: "Protect your energy." },
  { id: "hygiene",  label: "HYGIENE",      icon: "🚿", desc: "Show up clean, feel clean." },
  { id: "noval",    label: "NO VALORANT",  icon: "🚫", desc: "Not one game. Not one." },
];

const QUOTES = [
  "6-7 saal ka damage. 6-7 mahine mein fix kar.",
  "Aaj ki mehnat. Kal ki zindagi.",
  "Parents ki aankh mein woh shine laa.",
  "Every day you lock in, the future unlocks.",
  "Bhai log sote hain. Tu jaagta hai.",
  "The grind is silent. The results are loud.",
  "Tere andar sab hai. Bas nikaal.",
];

const GOAL_MONTHS = 6.5;
const START_DATE = "2026-06-04";

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getDayNumber() {
  const start = new Date(START_DATE);
  const today = new Date();
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diff);
}

function getDaysLeft() {
  const totalDays = Math.round(GOAL_MONTHS * 30);
  return Math.max(0, totalDays - getDayNumber() + 1);
}

function getStreak(history) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const dayData = history[key];
    if (!dayData) break;
    const allDone = HABITS.every((h) => dayData[h.id]);
    if (allDone) streak++;
    else break;
  }
  return streak;
}

function getLast14Days(history) {
  const days = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const dayData = history[key] || {};
    const done = HABITS.filter((h) => dayData[h.id]).length;
    days.push({ key, done, total: HABITS.length, isToday: i === 0 });
  }
  return days;
}

function cellColor(done, total) {
  if (done === 0) return "#1a1a1a";
  const pct = done / total;
  if (pct === 1) return "#44ff88";
  if (pct >= 0.66) return "#88cc44";
  if (pct >= 0.33) return "#ffaa00";
  return "#ff6644";
}

export default function App() {
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quote] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const upsertTimers = useRef({});

  // Load all history on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const { data, error: err } = await supabase
          .from("habit_history")
          .select("date, habits")
          .eq("user_id", USER_ID);

        if (err) throw err;

        const rebuilt = {};
        for (const row of data) {
          rebuilt[row.date] = row.habits;
        }
        setHistory(rebuilt);
      } catch (err) {
        setError("Failed to load data. Check your connection.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  async function upsertDate(date, habits) {
    try {
      const { error: err } = await supabase
        .from("habit_history")
        .upsert(
          { user_id: USER_ID, date, habits, updated_at: new Date().toISOString() },
          { onConflict: "user_id,date" }
        );
      if (err) throw err;
      setError(null);
    } catch (err) {
      setError("Sync failed. Will retry on next toggle.");
      console.error(err);
    }
  }

  function toggle(habitId) {
    const todayKey = getTodayKey();
    const todayData = history[todayKey] || {};
    const updated = {
      ...history,
      [todayKey]: { ...todayData, [habitId]: !todayData[habitId] },
    };
    setHistory(updated);

    // Debounce upsert per date to avoid rapid-fire requests
    clearTimeout(upsertTimers.current[todayKey]);
    upsertTimers.current[todayKey] = setTimeout(() => {
      upsertDate(todayKey, updated[todayKey]);
    }, 400);
  }

  const todayKey = getTodayKey();
  const todayData = history[todayKey] || {};
  const doneTodayCount = HABITS.filter((h) => todayData[h.id]).length;
  const allDoneToday = doneTodayCount === HABITS.length;
  const streak = getStreak(history);
  const last14 = getLast14Days(history);
  const dayNum = getDayNumber();
  const daysLeft = getDaysLeft();
  const totalDays = Math.round(GOAL_MONTHS * 30);
  const progress = Math.min(100, ((dayNum - 1) / totalDays) * 100);
  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "short",
  }).toUpperCase();

  return (
    <div className="app">
      <div className="grain" aria-hidden="true" />
      <div className="container">

        {/* Header */}
        <header className="header">
          <div className="day-counter">DAY {dayNum} / {totalDays}</div>
          <h1 className="title">LOCK IN</h1>
          <p className="subtitle">MAKE YOUR PARENTS PROUD</p>
        </header>

        {/* Status banners */}
        {loading && (
          <div className="status-banner loading">
            <div className="spinner" />
            <span>Loading your history...</span>
          </div>
        )}
        {error && !loading && (
          <div className="status-banner error">
            <span>⚠ {error}</span>
          </div>
        )}

        {/* Quote */}
        <div className="quote">
          <p>"{QUOTES[quote]}"</p>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--accent-red)" }}>{streak}</div>
            <div className="stat-label">STREAK</div>
          </div>
          <div className="stat-card">
            <div
              className="stat-value"
              style={{ color: allDoneToday ? "var(--accent-green)" : "var(--accent-yellow)" }}
            >
              {doneTodayCount}/{HABITS.length}
            </div>
            <div className="stat-label">TODAY</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--accent-blue)" }}>{daysLeft}</div>
            <div className="stat-label">LEFT</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-section">
          <div className="progress-labels">
            <span>JOURNEY START</span>
            <span>{progress.toFixed(1)}% COMPLETE</span>
            <span>GOAL</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Habits */}
        <section className="habits-section">
          <div className="section-label">TODAY — {todayLabel}</div>
          <div className="habits-list">
            {HABITS.map((habit) => {
              const done = !!todayData[habit.id];
              return (
                <button
                  key={habit.id}
                  className={`habit-btn${done ? " done" : ""}`}
                  onClick={() => toggle(habit.id)}
                  aria-pressed={done}
                  aria-label={habit.label}
                >
                  <span className="habit-icon" aria-hidden="true">{habit.icon}</span>
                  <div className="habit-text">
                    <div className="habit-name">{habit.label}</div>
                    <div className="habit-desc">{habit.desc}</div>
                  </div>
                  <div className="habit-check" aria-hidden="true">
                    {done ? "✓" : ""}
                  </div>
                </button>
              );
            })}
          </div>

          {allDoneToday && (
            <div className="locked-in">
              <div className="locked-in-icon">🔒</div>
              <div className="locked-in-title">LOCKED IN TODAY</div>
              <div className="locked-in-sub">Maa-Baap proud hain. Keep going.</div>
            </div>
          )}
        </section>

        {/* Heatmap */}
        <section className="heatmap-section">
          <div className="section-label">LAST 14 DAYS</div>
          <div className="heatmap-grid">
            {last14.map((d) => {
              const bg = cellColor(d.done, d.total);
              const dayLetter = new Date(d.key)
                .toLocaleDateString("en-IN", { weekday: "short" })
                .slice(0, 1);
              return (
                <div key={d.key} className="heatmap-cell-wrap">
                  <div
                    className={`heatmap-cell${d.isToday ? " today" : ""}`}
                    style={{
                      background: bg,
                      opacity: d.done === 0 && !d.isToday ? 0.4 : 1,
                    }}
                    title={`${d.key}: ${d.done}/${d.total}`}
                  />
                  <span className="heatmap-day-label">{dayLetter}</span>
                </div>
              );
            })}
          </div>
          <div className="heatmap-legend">
            {[["#44ff88", "All 6"], ["#ffaa00", "3–5"], ["#ff6644", "1–2"], ["#1a1a1a", "0"]].map(([c, l]) => (
              <div key={l} className="legend-item">
                <div className="legend-dot" style={{ background: c }} />
                <span className="legend-label">{l}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer">YOUR FUTURE SELF IS WATCHING.</footer>
      </div>
    </div>
  );
}
