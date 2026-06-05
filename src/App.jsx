import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

const USER_ID = "shikhar";

const HABITS = [
  // Career / Mission
  { id: "sde",        category: "MISSION",      label: "SDE PREP",        icon: "⌨️", desc: "DSA / System Design / Projects" },
  { id: "noval",      category: "MISSION",      label: "NO VALORANT",     icon: "🚫", desc: "Not one game. Not one." },
  { id: "nosocial",   category: "MISSION",      label: "NO SOCIAL MEDIA", icon: "📵", desc: "No scrolling. No comparison." },
 { id: "nofap",      category: "MISSION",       label: "NO GOONING",      icon: "🧠", desc: "Protect your energy." },
 {
  id: "nocard",category: "MISSION",
  label: "NO CARD SWIPE",
  icon: "💳",
  desc: "No non-essential card usage."
},
  // Self-respect
  { id: "morningBrush", category: "SELF-RESPECT", label: "MORNING BRUSH", icon: "🪥", desc: "Start the day clean." },
  { id: "nightBrush",   category: "SELF-RESPECT", label: "NIGHT BRUSH",   icon: "🌙", desc: "End the day clean." },
  { id: "bath",         category: "SELF-RESPECT", label: "BATH",          icon: "🚿", desc: "Reset your body. Reset your mind." },
  { id: "washFace",     category: "SELF-RESPECT", label: "WASH FACE",     icon: "🧼", desc: "Look fresh. Feel fresh." },
  { id: "cleanroom",    category: "SELF-RESPECT", label: "CLEAN ROOM & TABLE",    icon: "🏠", desc: "How you live matters." },
   { id: "nogirls",     category: "SELF-RESPECT", label: "NO GIRLS",      icon: "🙅‍♀️", desc: "Feelings later. Mission first." },
  // Health / Body
  { id: "eat",        category: "HEALTH",       label: "EAT CLEAN",       icon: "🥗", desc: "No junk. Real fuel." },
  { id: "exercise",   category: "HEALTH",       label: "EXERCISE",        icon: "🔥", desc: "Sweat. Every. Day." },
  { id: "steps",      category: "HEALTH",       label: "10K STEPS",       icon: "👣", desc: "Move your body." },
  { id: "water",      category: "HEALTH",       label: "3L WATER",        icon: "💧", desc: "Hydrate like an adult." },
  { id: "vitamin",    category: "HEALTH",       label: "MULTIVITAMIN",    icon: "💊", desc: "Small thing. Daily standard." },
 
];

const HABIT_CATEGORIES = ["MISSION", "SELF-RESPECT", "HEALTH"];

const QUOTES = [
"7 years of damage. Fix it in 7 months.",
"Put that shine back in your parents' eyes.",
"Job. Body. Discipline. Everything else can wait.",
"Until death, all defeats are psychological. Win the mind, win the day.",
"Your parents are waiting. Lock the hell in.",
"The future matters more than your feelings.",
"One offer letter can change the entire story.",
"Give your parents peace, not stress.",
"You're one season of discipline away.",
"Results will do all the talking.",
"Don't sit comfortably until you get the job.",
"Potential doesn't pay bills. Work does.",
"Build the life. Then invite love into it.",
"Not her. Success first.",
"Become the man you keep promising yourself you'll become.",
"Six months of focus. Years of difference.",
"Your own season of sacrifice.",
"7 years of damage. Fix it in 7 months.",
"Today's work. Tomorrow's life.",
"Put that shine back in your parents' eyes.",
"Every day you lock in, the future unlocks.",
"Others sleep. You work.",
"The grind is silent. The results are loud.",
"Everything you need is already inside you. Bring it out.",
"No more waiting. It's my turn now.",
"From rock bottom, the only way is up.",
"Become who you were meant to be.",
"Give yourself a chance, not your excuses.",
"Work every day. The magic follows.",
"You're not losing. You're just behind schedule.",
"This is the year the story changes.",
"One disciplined season can change your life.",
"This is the moment that defines the future.",
"Today's work. Tomorrow's confidence.",
"Just 1% better. Every day.",
"You're not potential. You're execution.",
"Work on yourself until the old you feels unrecognizable.",
"Earn your own respect.",
"Get up for the life you keep talking about.",
"If not now, when?",
"No quitting until the win.",
"The future version of you is judging today's choices.",
"You weren't born just to survive.",
"Live up to your own expectations.",
"It hurts now. It'll make you proud later.",
"The excuse chapter is over.",
"Dreams stay dreams until the work begins.",
"Discipline is self-respect.",
"You weren't made for an ordinary life.",
"Give yourself one more chance.",
"What you do today is becoming your future.",
"Bet on yourself.",
"One year. A completely different life.",
"The day the offer arrives, it'll all make sense.",
"Just start. The rest will follow.",
"Work so hard your doubts become embarrassed.",
"Unemployment is temporary. Character is permanent.",
"Focus is a superpower.",
"Winning is hard. Regret is harder.",
"The man you're looking for is hiding behind discipline.",
"You're writing your comeback story.",
"This time, all in.",
"Stay on the mission.",
"Comfort never gave you anything. Discipline will.",
"Every distraction steals from your future.",
"Sacrifice today. Satisfaction tomorrow.",
"Tomorrow's life is built by today's decisions.",
"Aren't you tired of disappointing yourself?",
"Just six months. Full send.",
"Grind now. Shine later.",
"Your future family deserves this version of you.",
"Becoming him starts today.",
"Earn the life you keep imagining.",
"Lock in. The clock is running.",
"Your parents are getting older. Move faster.",
"Their dreams are still waiting. So is your effort.",
"One job cuts the pressure in half.",
"The future matters more than your feelings.",
"Find yourself before chasing anyone else.",
"Today's focus. Tomorrow's confidence.",
"Become so good she meets a different version of you.",
"Good news is waiting to come home.",
"You're one season of discipline away.",
"Give your parents peace, not stress.",
"Your own season of sacrifice.",
"Don't sit comfortably until you get the job.",
"One offer letter can change the entire story.",
"Tomorrow's you depends on today's you.",
"Not her. Success first.",
"Become impossible to ignore.",
"Discipline today. Freedom tomorrow.",
"Time is short. Excuses are shorter.",
"Just stay consistent. Life will change.",
"Work for the life you dream about.",
"OPT is ticking. Lock in.",
"Work now. Breathe later.",
"Results will do all the talking.",
"Struggle now. Celebrate later.",
"Work on yourself. The world will notice.",
"This chapter isn't over. The hero is training.",
"The deeper the pain, the bigger the comeback.",
"Every day you're either building or destroying.",
"One day you'll tell your parents: it's done.",
"You're only one interview away from a job.",
"You only need one breakthrough.",
"Today's discomfort. Tomorrow's respect.",
"Prove it to yourself. Not anyone else.",
"That life won't be handed to you.",
"Until the offer comes, stay locked in.",
"Stop disappointing yourself.",
"Potential doesn't pay bills. Work does.",
"Dream life. Daily discipline.",
"Gym. Job. Sleep. Repeat.",
"Lock in. No negotiation.",
"Every application is a chance.",
"Every workout is a vote for your future.",
"Today's sacrifice. Tomorrow's status.",
"You can get tired. You can't stop.",
"Your parents are waiting. Lock the hell in.",
"Write your comeback story.",
"Become the man you keep promising yourself you'll become.",
"Become the man first. Everything else comes later.",
"Improve yourself before reaching out to her.",
"You can't afford to waste time.",
"Six months of focus. Years of difference.",
"Just get a little better every day.",
"Job. Body. Confidence. One step at a time.",
"Feelings later. Mission first.",
"Build the life. Then invite love into it.",
"One day you'll thank yourself for today's sacrifice."
];

const APP_TIME_ZONE = "America/New_York";
const GOAL_MONTHS = 6.5;
const START_DATE = "2026-06-04";

function getNYDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((p) => p.type === "year").value;
  const month = parts.find((p) => p.type === "month").value;
  const day = parts.find((p) => p.type === "day").value;

  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getTodayKey() {
  return getNYDateKey();
}

function getDayNumber() {
  const start = parseDateKey(START_DATE);
  const today = parseDateKey(getTodayKey());
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diff);
}

function getDaysLeft() {
  const totalDays = Math.round(GOAL_MONTHS * 30);
  return Math.max(0, totalDays - getDayNumber() + 1);
}

function getStreak(history) {
  let streak = 0;
  const today = parseDateKey(getTodayKey());

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = getNYDateKey(d);
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
  const today = parseDateKey(getTodayKey());

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = getNYDateKey(d);
    const dayData = history[key] || {};
    const done = HABITS.filter((h) => dayData[h.id]).length;

    days.push({
      key,
      done,
      total: HABITS.length,
      isToday: i === 0,
    });
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
  const [journalNote, setJournalNote] = useState("");
  const [journalSaved, setJournalSaved] = useState(false);
  const [journalSaving, setJournalSaving] = useState(false);
  const upsertTimers = useRef({});

  // Load habit history and today's journal on mount
  useEffect(() => {
    async function loadData() {
      try {
        const todayKey = getTodayKey();

        const { data: habitRows, error: habitErr } = await supabase
          .from("habit_history")
          .select("date, habits")
          .eq("user_id", USER_ID);

        if (habitErr) throw habitErr;

        const rebuilt = {};
        for (const row of habitRows || []) {
          rebuilt[row.date] = row.habits;
        }
        setHistory(rebuilt);

        const { data: journalRow, error: journalErr } = await supabase
          .from("journal_entries")
          .select("note")
          .eq("user_id", USER_ID)
          .eq("date", todayKey)
          .maybeSingle();

        if (journalErr) throw journalErr;

        setJournalNote(journalRow?.note || "");
      } catch (err) {
        setError("Failed to load data. Check your connection.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
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

  async function saveJournal() {
    const todayKey = getTodayKey();
    setJournalSaving(true);
    setJournalSaved(false);

    try {
      const { error: err } = await supabase
        .from("journal_entries")
        .upsert(
          {
            user_id: USER_ID,
            date: todayKey,
            note: journalNote.trim(),
          },
          { onConflict: "user_id,date" }
        );

      if (err) throw err;

      setError(null);
      setJournalSaved(true);
      setTimeout(() => setJournalSaved(false), 1800);
    } catch (err) {
      setError("Journal sync failed. Try saving again.");
      console.error(err);
    } finally {
      setJournalSaving(false);
    }
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
 const todayLabel = new Date().toLocaleDateString("en-US", {
  timeZone: APP_TIME_ZONE,
  weekday: "long",
  day: "numeric",
  month: "short",
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
            <div className="stat-label">DAYS LEFT</div>
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
            {HABIT_CATEGORIES.map((category) => {
              const categoryHabits = HABITS.filter((habit) => habit.category === category);
              const categoryDone = categoryHabits.filter((habit) => todayData[habit.id]).length;

              return (
                <div key={category} className="habit-category">
                  <div className="habit-category-header">
                    <span className="habit-category-title">{category}</span>
                    <span className="habit-category-count">{categoryDone} / {categoryHabits.length}</span>
                  </div>

                  {categoryHabits.map((habit) => {
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
              );
            })}
          </div>

          {allDoneToday && (
            <div className="locked-in">
              <div className="locked-in-icon">🔒</div>
              <div className="locked-in-title">LOCKED IN TODAY</div>
              <div className="locked-in-sub">Self-respect, health, and mission. Keep going.</div>
            </div>
          )}
        </section>

        {/* Journal */}
        <section className="journal-section">
          <div className="section-label">NIGHT JOURNAL</div>

          <div className="journal-card">
            <div className="journal-prompts">
              <div>What did I do today?</div>
              <div>What went well?</div>
              <div>What needs fixing tomorrow?</div>
            </div>

            <textarea
              className="journal-textarea"
              value={journalNote}
              onChange={(event) => {
                setJournalNote(event.target.value);
                setJournalSaved(false);
              }}
              placeholder={"1. Today I did...\n2. What went well...\n3. Tomorrow I need to fix..."}
              rows={7}
            />

            <button
              className="journal-save-btn"
              onClick={saveJournal}
              disabled={journalSaving}
            >
              {journalSaving ? "SAVING..." : journalSaved ? "SAVED ✓" : "SAVE JOURNAL"}
            </button>
          </div>
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
            {[["#44ff88", "All"], ["#88cc44", "Most"], ["#ffaa00", "Some"], ["#ff6644", "Few"], ["#1a1a1a", "0"]].map(([c, l]) => (
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
