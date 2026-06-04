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

const QUOTES=[
"6-7 saal ka damage. 6-7 mahine mein fix kar.",
"Parents ki aankh mein woh shine laa.",
"Job. Body. Discipline. Everything else can wait.",
"Until death, all defeats are psychological. Win the mind, win the day.",   
"Parents wait kar rahe hain. Lock tf in.",
"Future > Feelings.",
"Ek offer letter. Puri kahani badal jayegi.",
"Papa mummy ko tension nahi, sukoon dena hai.",
"Tu bas ek season of discipline door hai.",
"Sabko jawab results denge.",
"Job milne tak chain se mat baith.",
"Potential se bills nahi bharte. Kaam se bharte hain.",
"Build the life. Then invite love into it.",
"Surmai nahi. Pehle success.",
"Become the man you keep promising yourself you'll become.",
"6 mahine focus. Saalon ka farq.",
"Shiv ji ki tapasya. Apni tapasya.",
"6-7 saal ka damage. 6-7 mahine mein fix kar.",
"Aaj ki mehnat. Kal ki zindagi.",
"Parents ki aankh mein woh shine laa.",
"Every day you lock in, the future unlocks.",
"Bhai log sote hain. Tu jaagta hai.",
"The grind is silent. The results are loud.",
"Tere andar sab hai. Bas nikaal.",
"Ab aur nahi. Ab meri baari.",
"Rock bottom se upar hi jaaya jaata hai.",
"Jo banna tha, ab ban ke dikha.",
"Khud ko mauka de. Bahane ko nahi.",
"Har din kaam kar. Magic ho jayega.",
"Tu haara nahi hai. Bas late chal raha hai.",
"Iss saal kahani badalni hai.",
"Zindagi badalne ke liye ek disciplined season hi kaafi hai.",
"Yehi woh moment hai jo future define karega.",
"Aaj ka kaam. Kal ka confidence.",
"Bas 1% better. Roz.",
"Tu potential nahi. Execution hai.",
"Khud pe itna kaam kar ki purana tu pehchaan na paaye.",
"Apni respect kama.",
"Jis life ki baat karta hai, uske liye uth.",
"Abhi nahi toh kab?",
"Jab tak jeet nahi, tab tak quit nahi.",
"Future wala tu aaj tujhe judge kar raha hai.",
"Tu sirf survive karne nahi aaya tha.",
"Khud ki expectations pe khara utar.",
"Abhi dard hai. Baad mein pride hogi.",
"Excuses ka chapter khatam.",
"Dreams tab tak dreams hain jab tak kaam shuru nahi hota.",
"Discipline is self-respect.",
"Tu ordinary life ke liye nahi bana.",
"Khud ko ek chance aur de.",
"Abhi jo kar raha hai, wahi future ban raha hai.",
"Khud pe bet laga.",
"Ek saal. Puri zindagi alag.",
"Jis din offer aayega, sab worth lagega.",
"Bas lag ja. Baaki ho jayega.",
"Kaam itna kar ki doubt sharminda ho jaaye.",
"Unemployment temporary hai. Character permanent.",
"Focus is a superpower.",
"Jeetna mushkil hai. Pachtana aur mushkil.",
"Jis aadmi ko dhoond raha hai, woh discipline ke peeche chhupa hai.",
"Tu apni comeback story likh raha hai.",
"Iss baar aadha nahi. Poora.",
"Mission pe reh.",
"Comfort ne kuch nahi diya. Discipline dega.",
"Har distraction tera future chura raha hai.",
"Aaj sacrifice. Kal satisfaction.",
"Kal ki life aaj ke decisions se banti hai.",
"Khud ko disappoint karte karte thak nahi gaya?",
"Bas 6 mahine. Full send.",
"Abhi grind kar. Baad mein shine kar.",
"Your future family deserves this version of you.",
"Becoming him starts today.",
"Earn the life you keep imagining.",
"Lock in. The clock is running.",
"Parents buddhe ho rahe hain. Jaldi kar.",
"Unke sapne pending hain. Teri mehnat bhi.",
"Ek job. Loan ka pressure aadha.",
"Future > Feelings.",
"Usse paane se pehle khud ko paa.",
"Aaj ka focus. Kal ka confidence.",
"Be so good she meets a different version of you.",
"Ghar pe good news ka intezaar ho raha hai.",
"Tu bas ek season of discipline door hai.",
"Papa mummy ko tension nahi, sukoon dena hai.",
"Shiv ji ki tapasya. Apni tapasya.",
"Job milne tak chain se mat baith.",
"Ek offer letter. Puri kahani badal jayegi.",
"Kal ka Shikhar aaj wale Shikhar pe depend karta hai.",
"Surmai nahi. Pehle success.",
"Khud ko itna banao ki log tumhe ignore na kar saken.",
"Aaj discipline. Kal freedom.",
"Waqt kam hai. Bahane aur kam.",
"Tu bas consistent reh. Life palat jayegi.",
"Jis life ka sapna dekhta hai, uske liye kaam bhi kar.",
"OPT chal raha hai. Lock in.",
"Abhi mehnat kar. Baad mein saans lena.",
"Sabko jawab results denge.",
"Abhi struggle kar. Baad mein celebrate kar.",
"Khud pe kaam kar. Duniya khud notice karegi.",
"Yeh chapter khatam nahi hua. Hero training mein hai.",
"Jitna dard hai. Utni badi comeback hogi.",
"Har din ya toh build kar raha hai ya barbaad.",
"Ek din parents ko bolna hai. Ho gaya.",
"Tu job se bas ek interview door hai.",
"Bas ek breakthrough chahiye.",
"Aaj ka discomfort. Kal ki respect.",
"Khud ko prove kar. Kisi aur ko nahi.",
"Woh life free mein nahi milegi.",
"Jab tak offer nahi. Tab tak full focus.",
"Khud ko disappoint karna band kar.",
"Potential se bills nahi bharte. Kaam se bharte hain.",
"Dream life. Daily discipline.",
"Gym. Job. Sleep. Repeat.",
"Lock in. No negotiation.",
"Har application ek chance hai.",
"Har workout ek vote hai future ke liye.",
"Aaj ka sacrifice. Kal ka status.",
"Tu thak sakta hai. Ruk nahi sakta.",
"Parents wait kar rahe hain. Lock tf in.",
"Apni kahani ka comeback likh.",
"Become the man you keep promising yourself you'll become.",
"Pehle aadmi ban. Baaki sab baad mein.",
"Surmai ko text karne se pehle khud ko improve kar.",
"Waqt barbaad karne ka luxury nahi hai.",
"6 mahine focus. Saalon ka farq.",
"Roz thoda better. Bas itna hi.",
"Job. Body. Confidence. Ek ek karke.",
"Feelings baad mein. Mission pehle.",
"Build the life. Then invite love into it.",
"Kal thank you bolega aaj wala sacrifice."

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
            {HABIT_CATEGORIES.map((category) => {
              const categoryHabits = HABITS.filter((habit) => habit.category === category);
              const categoryDone = categoryHabits.filter((habit) => todayData[habit.id]).length;

              return (
                <div key={category} className="habit-category">
                  <div className="habit-category-header">
                    <span>{category}</span>
                    <span>{categoryDone}/{categoryHabits.length}</span>
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
