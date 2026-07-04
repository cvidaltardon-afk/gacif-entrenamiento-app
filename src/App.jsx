import React, { useState, useEffect, useRef, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ---------- Estilos GACIF Mejorados ----------
const styles = `
  :root {
    --gacif-bg: #0A1E35;
    --gacif-bg-secondary: #143454;
    --gacif-bg-tertiary: #1E4A6A;
    --gacif-plata: #C0C0C0;
    --gacif-plata-dark: #A0A0A0;
    --gacif-gray: #8899AA;
    --gacif-gray-dark: #667788;
    --gacif-light: #D0D0D0;
    --gacif-white: #FFFFFF;
    --gacif-border: #1a3a5c;
    --gacif-border-light: #2a5a8c;
  }
  
  .bg-gacif-950 { background-color: var(--gacif-bg); }
  .bg-gacif-900 { background-color: var(--gacif-bg-secondary); }
  .bg-gacif-800 { background-color: var(--gacif-bg-tertiary); }
  .text-gacif-plata { color: var(--gacif-plata); }
  .border-gacif-plata { border-color: var(--gacif-plata); }
  .text-gacif-gray { color: var(--gacif-gray); }
  .text-gacif-gray-dark { color: var(--gacif-gray-dark); }
  .text-gacif-light { color: var(--gacif-light); }
  .text-gacif-white { color: var(--gacif-white); }
  .border-gacif-border { border-color: var(--gacif-border); }
  .border-gacif-border-light { border-color: var(--gacif-border-light); }
  
  .bg-emerald-950 { background-color: #0d3b2c; }
  .bg-emerald-500 { background-color: #10b981; }
  .text-emerald-400 { color: #34d399; }
  .text-emerald-700 { color: #047857; }
  .border-emerald-700 { border-color: #047857; }
  
  .bg-red-400 { background-color: #f87171; }
  .text-red-400 { color: #f87171; }
  
  /* Mejor tipografía */
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
    letter-spacing: -0.5px;
  }
  
  h1, h2, h3 { letter-spacing: -1px; }
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = styles;
  document.head.appendChild(style);
}

// ---------- Utilidades ----------
const uid = () => Math.random().toString(36).slice(2, 9);

function mondayOf(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function fmtWeek(weekKey) {
  const d = new Date(weekKey + "T00:00:00");
  const end = new Date(d);
  end.setDate(end.getDate() + 6);
  const opts = { day: "numeric", month: "short" };
  return `${d.toLocaleDateString("es-CL", opts)} – ${end.toLocaleDateString("es-CL", opts)}`;
}

function ConfirmButton({ label, confirmLabel = "¿Seguro? Toca de nuevo", onConfirm, className = "" }) {
  const [confirming, setConfirming] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => timer.current && clearTimeout(timer.current), []);

  const handleClick = () => {
    if (confirming) {
      if (timer.current) clearTimeout(timer.current);
      setConfirming(false);
      onConfirm();
    } else {
      setConfirming(true);
      timer.current = setTimeout(() => setConfirming(false), 3000);
    }
  };

  return (
    <button onClick={handleClick} className={`${className} ${confirming ? "animate-pulse" : ""}`}>
      {confirming ? confirmLabel : label}
    </button>
  );
}

// Rutina por defecto
const defaultRoutine = {
  days: [
    {
      id: "d1",
      name: "Día 1 · Lunes",
      subtitle: "Cadena anterior · Cuádriceps",
      exercises: [
        { id: uid(), name: "Box Squat (Máquina Smith)", sets: [{ kg: 55, reps: 16 }, { kg: 65, reps: 14 }, { kg: 65, reps: 14 }, { kg: 75, reps: 12 }] },
        { id: uid(), name: "Prensa 45°", sets: [{ kg: 80, reps: 16 }, { kg: 90, reps: 14 }, { kg: 90, reps: 14 }, { kg: 100, reps: 12 }] },
        { id: uid(), name: "Extensión de cuádriceps", sets: [{ kg: 45, reps: 16 }, { kg: 55, reps: 14 }, { kg: 55, reps: 14 }, { kg: 60, reps: 12 }] },
        { id: uid(), name: "Abductores sentado", sets: [{ kg: 90, reps: 18 }, { kg: 100, reps: 16 }, { kg: 100, reps: 16 }, { kg: 105, reps: 14 }] },
        { id: uid(), name: "Elevación de talones (Smith)", sets: [{ kg: 45, reps: 18 }, { kg: 60, reps: 16 }, { kg: 60, reps: 16 }, { kg: 75, reps: 14 }] },
      ],
      cardio: { minutes: 25, desc: "5' suave / 5' intenso, alternado" },
    },
    {
      id: "d2",
      name: "Día 2 · Miércoles",
      subtitle: "Torso (tracción) · Brazos",
      exercises: [
        { id: uid(), name: "Jalón al pecho (polea alta)", sets: [{ kg: 35, reps: 14 }, { kg: 45, reps: 12 }, { kg: 45, reps: 12 }, { kg: 50, reps: 10 }] },
        { id: uid(), name: "Remo sentado (polea baja)", sets: [{ kg: 35, reps: 14 }, { kg: 45, reps: 12 }, { kg: 45, reps: 12 }, { kg: 50, reps: 10 }] },
        { id: uid(), name: "Pull down con barra", sets: [{ kg: 25, reps: 16 }, { kg: 30, reps: 14 }, { kg: 30, reps: 14 }, { kg: 35, reps: 12 }] },
        { id: uid(), name: "Extensión de tríceps (polea)", sets: [{ kg: 20, reps: 14 }, { kg: 30, reps: 12 }, { kg: 30, reps: 12 }, { kg: 45, reps: 10 }] },
        { id: uid(), name: "Curl de bíceps (polea baja)", sets: [{ kg: 20, reps: 14 }, { kg: 25, reps: 12 }, { kg: 25, reps: 12 }, { kg: 35, reps: 10 }] },
      ],
      cardio: { minutes: 25, desc: "5' suave / 5' intenso, alternado" },
    },
    {
      id: "d3",
      name: "Día 3 · Viernes",
      subtitle: "Cadena posterior · Core",
      exercises: [
        { id: uid(), name: "Peso muerto rumano", sets: [{ kg: 65, reps: 12 }, { kg: 75, reps: 10 }, { kg: 75, reps: 10 }, { kg: 85, reps: 8 }] },
        { id: uid(), name: "Deadlift split KTB (por lado)", sets: [{ kg: 20, reps: 10 }, { kg: 30, reps: 8 }, { kg: 30, reps: 8 }, { kg: 30, reps: 8 }] },
        { id: uid(), name: "Curl femoral acostado", sets: [{ kg: 20, reps: 14 }, { kg: 30, reps: 12 }, { kg: 30, reps: 12 }, { kg: 35, reps: 10 }] },
        { id: uid(), name: "Elevación de talones sentado", sets: [{ kg: 25, reps: 18 }, { kg: 35, reps: 16 }, { kg: 35, reps: 16 }, { kg: 45, reps: 14 }] },
        { id: uid(), name: "Glúteos en banco romano (corporal)", sets: [{ kg: 0, reps: 14 }, { kg: 0, reps: 14 }, { kg: 0, reps: 14 }] },
        { id: uid(), name: "Elevación de piernas banco inclinado", sets: [{ kg: 0, reps: 12 }, { kg: 0, reps: 12 }, { kg: 0, reps: 12 }] },
      ],
      cardio: { minutes: 25, desc: "5' suave / 5' intenso, alternado" },
    },
    {
      id: "d4",
      name: "Día 4 · Martes",
      subtitle: "CrossFit / Entrenamiento híbrido",
      exercises: [
        { id: uid(), name: "WOD Fuerza", sets: [{ kg: 0, reps: 0 }] },
        { id: uid(), name: "WOD Metcon / Acondicionamiento", sets: [{ kg: 0, reps: 0 }] },
      ],
      cardio: { minutes: 0, desc: "" },
    },
    {
      id: "d5",
      name: "Día 5 · Jueves",
      subtitle: "CrossFit / Entrenamiento híbrido",
      exercises: [
        { id: uid(), name: "WOD Fuerza", sets: [{ kg: 0, reps: 0 }] },
        { id: uid(), name: "WOD Metcon / Acondicionamiento", sets: [{ kg: 0, reps: 0 }] },
      ],
      cardio: { minutes: 0, desc: "" },
    },
  ],
};

const STORAGE_KEY = "gym-recomp-data-v2";

export default function App() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("entrenar");
  const [activeDayId, setActiveDayId] = useState(null);
  const [saveState, setSaveState] = useState("idle");
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [editWeek, setEditWeek] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const loaded = useRef(false);
  const saveTimer = useRef(null);
  const timerRef = useRef(null);

  const currentWeek = mondayOf(new Date());
  const displayWeek = selectedWeek || currentWeek;
  const canEdit = displayWeek === currentWeek || editWeek === displayWeek;

  // Temporizador
  useEffect(() => {
    if (!timerActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    if (timerSeconds <= 0) {
      setTimerActive(false);
      try { new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg==').play().catch(()=>{}); } catch(e) {}
      return;
    }
    timerRef.current = setInterval(() => setTimerSeconds(s => s - 1), 1000);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [timerActive, timerSeconds]);

  // Cargar datos
  useEffect(() => {
    (async () => {
      let initial = { routine: defaultRoutine, logs: {}, queries: {}, measurements: [] };
      try {
        if (typeof window !== "undefined" && window.storage) {
          const res = await window.storage.get(STORAGE_KEY);
          if (res && res.value) initial = JSON.parse(res.value);
        }
      } catch (e) {}
      setData(initial);
      const wd = new Date().getDay();
      const idx = wd >= 5 ? 2 : wd >= 3 ? 1 : 0;
      setActiveDayId(initial.routine.days[Math.min(idx, initial.routine.days.length - 1)]?.id || null);
      loaded.current = true;
    })();
  }, []);

  // Guardado automático
  useEffect(() => {
    if (!loaded.current || !data) return;
    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        if (typeof window !== "undefined" && window.storage) {
          await window.storage.set(STORAGE_KEY, JSON.stringify(data));
          setSaveState("saved");
          setTimeout(() => setSaveState("idle"), 1500);
        } else {
          setSaveState("error");
        }
      } catch (e) {
        setSaveState("error");
      }
    }, 700);
    return () => saveTimer.current && clearTimeout(saveTimer.current);
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen bg-gacif-950 flex items-center justify-center">
        <div className="text-gacif-gray text-sm tracking-widest uppercase animate-pulse">Cargando registros…</div>
      </div>
    );
  }

  const { routine, logs, queries = {}, measurements = [] } = data;

  const getLog = (weekKey, dayId) => logs?.[weekKey]?.[dayId] || null;
  const updateLog = (weekKey, dayId, updater) => {
    setData((prev) => {
      const next = structuredClone(prev);
      if (!next.logs[weekKey]) next.logs[weekKey] = {};
      if (!next.logs[weekKey][dayId]) next.logs[weekKey][dayId] = { date: new Date().toISOString().slice(0, 10), exercises: {}, cardio: null };
      updater(next.logs[weekKey][dayId]);
      return next;
    });
  };

  const findPrev = (dayId, exId, exName) => {
    const weeks = Object.keys(logs).filter((w) => w < currentWeek).sort().reverse();
    for (const w of weeks) {
      const dl = logs[w]?.[dayId];
      if (!dl) continue;
      let entry = dl.exercises?.[exId];
      if (!entry) {
        entry = Object.values(dl.exercises || {}).find((e) => e.name && e.name.toLowerCase() === exName.toLowerCase());
      }
      if (entry && entry.sets?.some((s) => s.done)) return { week: w, entry };
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gacif-950 text-gacif-white pb-24" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Cabecera Mejorada */}
      <header className="sticky top-0 z-20 px-6 pt-6 pb-6 bg-gacif-950 border-b border-gacif-border">
        <div className="flex items-end justify-between max-w-3xl mx-auto mb-6">
          <div>
            <div className="text-gacif-gray text-[11px] font-bold tracking-widest uppercase mb-2">Recomposición</div>
            <h1 className="text-4xl font-black tracking-tight leading-tight">Registro de entrenamiento</h1>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-widest text-gacif-gray mb-1">Semana</div>
            <div className="text-lg font-bold text-gacif-white">{fmtWeek(displayWeek)}</div>
            <div className="text-[10px] mt-2 h-3">
              {saveState === "saving" && <span className="text-gacif-gray">guardando…</span>}
              {saveState === "saved" && <span className="text-emerald-400">✓ guardado</span>}
              {saveState === "error" && <span className="text-red-400">sin conexión</span>}
            </div>
          </div>
        </div>

        {/* Navegación de semanas mejorada */}
        <WeekNav
          currentWeek={currentWeek}
          selectedWeek={selectedWeek}
          setSelectedWeek={(w) => {
            setSelectedWeek(w);
            setEditWeek(null);
          }}
        />

        {/* Temporizador flotante */}
        {timerActive && (
          <div className="mt-4 rounded-2xl bg-gacif-plata text-gacif-bg p-3 flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider">Descanso</span>
            <span className="text-3xl font-black tabular-nums">{Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}</span>
            <button onClick={() => setTimerActive(false)} className="text-lg font-bold">✕</button>
          </div>
        )}
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-6">
        {tab === "entrenar" && (
          <TrainTab
            routine={routine}
            activeDayId={activeDayId}
            setActiveDayId={setActiveDayId}
            displayWeek={displayWeek}
            currentWeek={currentWeek}
            canEdit={canEdit}
            editWeek={editWeek}
            setEditWeek={setEditWeek}
            timerActive={timerActive}
            setTimerActive={setTimerActive}
            setTimerSeconds={setTimerSeconds}
            getLog={getLog}
            updateLog={updateLog}
            findPrev={findPrev}
            queries={queries[displayWeek] || ""}
            setData={setData}
          />
        )}
        {tab === "rutina" && <RoutineTab routine={routine} setData={setData} />}
        {tab === "progreso" && <ProgressTab routine={routine} logs={logs} displayWeek={displayWeek} />}
        {tab === "brief" && <BriefTab routine={routine} logs={logs} currentWeek={currentWeek} displayWeek={displayWeek} queries={queries} />}
        {tab === "medidas" && <MeasurementsTab measurements={measurements} setData={setData} />}
      </main>

      {/* Navegación inferior mejorada */}
      <nav className="fixed bottom-0 inset-x-0 bg-gacif-900 border-t border-gacif-border z-30">
        <div className="max-w-3xl mx-auto grid grid-cols-5">
          {[
            { id: "entrenar", label: "Entrenar", icon: "▶" },
            { id: "rutina", label: "Rutina", icon: "✎" },
            { id: "progreso", label: "Progreso", icon: "▲" },
            { id: "brief", label: "Brief", icon: "☰" },
            { id: "medidas", label: "Medidas", icon: "⊕" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-4 flex flex-col items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                tab === t.id ? "text-gacif-plata" : "text-gacif-gray hover:text-gacif-light"
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function WeekNav({ currentWeek, selectedWeek, setSelectedWeek }) {
  const prev = addDays(selectedWeek || currentWeek, -7);
  const next = addDays(selectedWeek || currentWeek, 7);
  const isCurrentWeek = !selectedWeek || selectedWeek === currentWeek;

  return (
    <div className="flex gap-3 items-center">
      <button onClick={() => setSelectedWeek(prev)} className="w-10 h-10 rounded-xl bg-gacif-800 border border-gacif-border text-base font-black text-gacif-gray hover:border-gacif-plata transition-colors">
        ‹
      </button>
      <button
        onClick={() => setSelectedWeek(null)}
        className={`flex-1 rounded-xl py-2.5 text-sm font-bold text-center transition-colors ${
          isCurrentWeek ? "bg-gacif-plata text-gacif-bg" : "bg-gacif-800 border border-gacif-border text-gacif-gray hover:border-gacif-plata"
        }`}
      >
        Hoy
      </button>
      <button onClick={() => setSelectedWeek(next)} className="w-10 h-10 rounded-xl bg-gacif-800 border border-gacif-border text-base font-black text-gacif-gray hover:border-gacif-plata transition-colors">
        ›
      </button>
    </div>
  );
}

// TrainTab con temporizador y consultas
function TrainTab({ routine, activeDayId, setActiveDayId, displayWeek, currentWeek, canEdit, editWeek, setEditWeek, timerActive, setTimerActive, setTimerSeconds, getLog, updateLog, findPrev, queries, setData }) {
  const day = routine.days.find((d) => d.id === activeDayId) || routine.days[0];
  if (!day) return <p className="text-gacif-gray text-base">No hay días.</p>;
  const log = getLog(displayWeek, day.id);
  const [showQueries, setShowQueries] = useState(!!queries);

  return (
    <div>
      {displayWeek !== currentWeek && (
        <div className={`mb-6 rounded-2xl border p-4 flex items-center justify-between gap-3 ${
          canEdit ? "border-gacif-plata bg-gacif-800" : "border-gacif-border bg-gacif-900"
        }`}>
          {canEdit ? (
            <>
              <div>
                <div className="text-sm font-bold text-gacif-plata uppercase tracking-wider">✎ Modo edición</div>
                <p className="text-xs text-gacif-gray mt-1">Modificando semana {displayWeek < currentWeek ? "anterior" : "futura"}.</p>
              </div>
              <button onClick={() => setEditWeek(null)} className="shrink-0 px-4 py-2 rounded-lg bg-gacif-900 border border-gacif-border text-xs font-bold text-gacif-light">
                Bloquear
              </button>
            </>
          ) : (
            <>
              <div>
                <div className="text-sm font-bold text-gacif-gray uppercase">Solo lectura</div>
                <p className="text-xs text-gacif-gray-dark mt-1">Desbloquea para editar.</p>
              </div>
              <ConfirmButton
                label="✎ Editar"
                confirmLabel="¿Confirmar?"
                onConfirm={() => setEditWeek(displayWeek)}
                className="shrink-0 px-4 py-2 rounded-lg bg-gacif-plata text-gacif-bg text-xs font-bold"
              />
            </>
          )}
        </div>
      )}

      {/* Botones de días mejorados */}
      <div className="flex gap-3 mb-6">
        {routine.days.map((d) => (
          <button
            key={d.id}
            onClick={() => setActiveDayId(d.id)}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold border transition-colors ${
              d.id === day.id ? "bg-gacif-border-light text-gacif-white border-gacif-plata" : "bg-gacif-800 text-gacif-gray border-gacif-border hover:border-gacif-plata"
            }`}
          >
            {d.name.split("·")[0].trim()}
          </button>
        ))}
      </div>

      {/* Título del día mejorado */}
      <div className="mb-6">
        <h2 className="text-2xl font-black">{day.name}</h2>
        <p className="text-gacif-gray text-base mt-1">{day.subtitle}</p>
      </div>

      {/* Consultas del coach */}
      <button onClick={() => setShowQueries(!showQueries)} className="mb-4 text-xs font-bold text-gacif-plata uppercase tracking-wider hover:text-gacif-light transition-colors">
        {showQueries ? "− Consultas para el coach" : "+ Consultas para el coach"}
      </button>
      {showQueries && (
        <textarea
          value={queries}
          onChange={(e) => setData(prev => ({...prev, queries: {...prev.queries, [displayWeek]: e.target.value}}))}
          disabled={!canEdit}
          placeholder="Dudas, movimientos limitantes, observaciones…"
          rows={3}
          className={`w-full rounded-xl bg-gacif-800 border border-gacif-border px-4 py-3 text-sm text-gacif-light placeholder-gacif-gray focus:outline-none focus:border-gacif-plata mb-6 ${!canEdit ? "opacity-60" : ""}`}
        />
      )}

      {/* Ejercicios */}
      {day.exercises.map((ex, i) => {
        const isWOD = ex.name.toLowerCase().includes("wod");
        return isWOD ? (
          <WODCard
            key={ex.id}
            ex={ex}
            dayId={day.id}
            displayWeek={displayWeek}
            isCurrentWeek={canEdit}
            logEntry={log?.exercises?.[ex.id] || null}
            updateLog={updateLog}
          />
        ) : (
          <ExerciseCard
            key={ex.id}
            ex={ex}
            dayId={day.id}
            displayWeek={displayWeek}
            isCurrentWeek={canEdit}
            logEntry={log?.exercises?.[ex.id] || null}
            prev={findPrev(day.id, ex.id, ex.name)}
            updateLog={updateLog}
            timerActive={timerActive}
            setTimerActive={setTimerActive}
            setTimerSeconds={setTimerSeconds}
          />
        );
      })}

      {day.cardio && day.cardio.minutes > 0 && (
        <CardioCard day={day} displayWeek={displayWeek} isCurrentWeek={canEdit} log={log} updateLog={updateLog} />
      )}
    </div>
  );
}

// ExerciseCard mejorada
function ExerciseCard({ ex, dayId, displayWeek, isCurrentWeek, logEntry, prev, updateLog, timerActive, setTimerActive, setTimerSeconds }) {
  const [showNote, setShowNote] = useState(!!logEntry?.note);
  const sets = ex.sets.map((target, i) => {
    const rec = logEntry?.sets?.[i];
    return rec ? { ...rec } : { kg: target.kg, reps: target.reps, done: false };
  });

  const setSet = (i, patch) => {
    updateLog(displayWeek, dayId, (dl) => {
      if (!dl.exercises[ex.id]) dl.exercises[ex.id] = { name: ex.name, sets: sets.map((s) => ({ ...s })), note: logEntry?.note || "", rpe: logEntry?.rpe || "" };
      dl.exercises[ex.id].name = ex.name;
      if (!dl.exercises[ex.id].sets[i]) dl.exercises[ex.id].sets[i] = { ...sets[i] };
      Object.assign(dl.exercises[ex.id].sets[i], patch);
      if (patch.done && !timerActive) {
        setTimerSeconds(120);
        setTimerActive(true);
      }
    });
  };

  const setNote = (note) => {
    updateLog(displayWeek, dayId, (dl) => {
      if (!dl.exercises[ex.id]) dl.exercises[ex.id] = { name: ex.name, sets: sets.map((s) => ({ ...s })), note: "", rpe: "" };
      dl.exercises[ex.id].note = note;
    });
  };

  const setRPE = (rpe) => {
    updateLog(displayWeek, dayId, (dl) => {
      if (!dl.exercises[ex.id]) dl.exercises[ex.id] = { name: ex.name, sets: sets.map((s) => ({ ...s })), note: logEntry?.note || "", rpe: "" };
      dl.exercises[ex.id].rpe = rpe;
    });
  };

  const doneCount = sets.filter((s) => s.done).length;
  const allDone = doneCount === sets.length;

  return (
    <section className={`mb-6 rounded-2xl border ${allDone ? "border-emerald-700 bg-emerald-950" : "border-gacif-border bg-gacif-800"} p-5`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="font-bold text-lg leading-snug">{ex.name}</h3>
          {prev ? (
            <p className="text-xs text-gacif-gray mt-1">Semana pasada: {prev.entry.sets.filter((s) => s.done).map((s) => `${s.kg}×${s.reps}`).join(" · ") || "—"}</p>
          ) : (
            <p className="text-xs text-gacif-gray-dark mt-1">Sin registro previo</p>
          )}
        </div>
        <span className="text-xs font-bold text-gacif-gray shrink-0">{doneCount}/{sets.length}</span>
      </div>

      <div className="space-y-2">
        {sets.map((s, i) => (
          <SetRow key={i} i={i} s={s} target={ex.sets[i]} onChange={(patch) => isCurrentWeek ? setSet(i, patch) : null} bodyweight={ex.sets[i].kg === 0} disabled={!isCurrentWeek} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gacif-gray uppercase block mb-2">RPE (1-10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={logEntry?.rpe || ""}
            onChange={(e) => setRPE(e.target.value)}
            disabled={!isCurrentWeek}
            className={`w-full rounded-lg bg-gacif-900 border border-gacif-border px-3 py-2 text-sm text-center focus:outline-none focus:border-gacif-plata ${!isCurrentWeek ? "opacity-60" : ""}`}
          />
        </div>
        <div className="flex items-end">
          <button onClick={() => setShowNote(!showNote)} className="text-xs font-bold text-gacif-gray uppercase hover:text-gacif-light transition-colors">
            {showNote ? "Ocultar nota" : "Agregar nota"}
          </button>
        </div>
      </div>

      {showNote && (
        <textarea
          value={logEntry?.note || ""}
          onChange={(e) => setNote(e.target.value)}
          disabled={!isCurrentWeek}
          placeholder="Sensaciones, limitantes, técnica…"
          rows={2}
          className={`mt-3 w-full rounded-lg bg-gacif-900 border border-gacif-border p-3 text-sm text-gacif-light placeholder-gacif-gray focus:outline-none focus:border-gacif-plata ${!isCurrentWeek ? "opacity-60" : ""}`}
        />
      )}
    </section>
  );
}

function SetRow({ i, s, target, onChange, bodyweight, disabled }) {
  const kgStep = target.kg >= 40 ? 5 : 2.5;
  return (
    <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 ${s.done ? "bg-emerald-900" : "bg-gacif-900"} ${disabled ? "opacity-60" : ""}`}>
      <span className="w-6 text-center text-xs font-black text-gacif-gray-dark">{i + 1}</span>

      {bodyweight ? (
        <div className="flex-1 text-center text-sm font-bold text-gacif-gray">Peso corporal</div>
      ) : (
        <div className="flex-1 flex items-center justify-center gap-1.5">
          <Btn onClick={() => onChange({ kg: Math.max(0, +(s.kg - kgStep).toFixed(1)) })} disabled={disabled}>−</Btn>
          <div className="w-20 text-center">
            <span className="text-xl font-black tabular-nums">{s.kg}</span>
            <span className="text-[10px] text-gacif-gray"> kg</span>
          </div>
          <Btn onClick={() => onChange({ kg: +(s.kg + kgStep).toFixed(1) })} disabled={disabled}>+</Btn>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center gap-1.5">
        <Btn onClick={() => onChange({ reps: Math.max(0, s.reps - 1) })} disabled={disabled}>−</Btn>
        <div className="w-16 text-center">
          <span className="text-xl font-black tabular-nums">{s.reps}</span>
          <span className="text-[10px] text-gacif-gray"> rep</span>
        </div>
        <Btn onClick={() => onChange({ reps: s.reps + 1 })} disabled={disabled}>+</Btn>
      </div>

      <button
        onClick={() => onChange({ done: !s.done })}
        disabled={disabled}
        className={`w-12 h-12 rounded-lg font-black text-lg flex items-center justify-center shrink-0 ${
          s.done ? "bg-emerald-500 text-gacif-bg" : "bg-gacif-800 text-gacif-gray border border-gacif-border"
        } ${disabled ? "opacity-60 cursor-default" : "hover:border-gacif-plata transition-colors"}`}
      >
        ✓
      </button>
    </div>
  );
}

function Btn({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} className={`w-9 h-9 rounded-lg bg-gacif-800 text-gacif-light font-black text-base border border-gacif-border active:bg-gacif-900 transition-colors ${disabled ? "opacity-60 cursor-default" : "hover:border-gacif-plata"}`}>
      {children}
    </button>
  );
}

function WODCard({ ex, dayId, displayWeek, isCurrentWeek, logEntry, updateLog }) {
  const [open, setOpen] = useState(!!logEntry?.wodDetail);
  const detail = logEntry?.wodDetail || { title: "", reps: "", time: "", score: "", rpe: "", note: "" };

  const setDetail = (patch) => {
    updateLog(displayWeek, dayId, (dl) => {
      if (!dl.exercises[ex.id]) dl.exercises[ex.id] = { name: ex.name, sets: [], wodDetail: { title: "", reps: "", time: "", score: "", rpe: "", note: "" } };
      Object.assign(dl.exercises[ex.id].wodDetail, patch);
    });
  };

  return (
    <section className={`mb-6 rounded-2xl border ${Object.values(detail).some((v) => v) ? "border-emerald-700 bg-emerald-950" : "border-gacif-border bg-gacif-800"} p-5`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-start justify-between text-left">
        <div>
          <h3 className="font-bold text-lg">{ex.name}</h3>
          <p className="text-xs text-gacif-gray mt-1">{detail.title ? `"${detail.title}"` : "Registra el WOD"}</p>
        </div>
        <span className="text-gacif-gray font-black text-lg">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <input
            value={detail.title}
            onChange={(e) => setDetail({ title: e.target.value })}
            disabled={!isCurrentWeek}
            placeholder="Nombre del WOD"
            className={`w-full rounded-lg bg-gacif-900 border border-gacif-border px-3 py-2 text-sm font-bold focus:outline-none focus:border-gacif-plata ${!isCurrentWeek ? "opacity-60" : ""}`}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={detail.reps}
              onChange={(e) => setDetail({ reps: e.target.value })}
              disabled={!isCurrentWeek}
              placeholder="Reps"
              className={`rounded-lg bg-gacif-900 border border-gacif-border px-3 py-2 text-sm focus:outline-none focus:border-gacif-plata ${!isCurrentWeek ? "opacity-60" : ""}`}
            />
            <input
              value={detail.time}
              onChange={(e) => setDetail({ time: e.target.value })}
              disabled={!isCurrentWeek}
              placeholder="Tiempo (25:45 min)"
              className={`rounded-lg bg-gacif-900 border border-gacif-border px-3 py-2 text-sm focus:outline-none focus:border-gacif-plata ${!isCurrentWeek ? "opacity-60" : ""}`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              value={detail.score}
              onChange={(e) => setDetail({ score: e.target.value })}
              disabled={!isCurrentWeek}
              placeholder="Score"
              className={`rounded-lg bg-gacif-900 border border-gacif-border px-3 py-2 text-sm focus:outline-none focus:border-gacif-plata ${!isCurrentWeek ? "opacity-60" : ""}`}
            />
            <input
              value={detail.rpe}
              onChange={(e) => setDetail({ rpe: e.target.value })}
              disabled={!isCurrentWeek}
              placeholder="RPE (1-10)"
              type="number"
              min="1"
              max="10"
              className={`rounded-lg bg-gacif-900 border border-gacif-border px-3 py-2 text-sm focus:outline-none focus:border-gacif-plata ${!isCurrentWeek ? "opacity-60" : ""}`}
            />
          </div>
          <textarea
            value={detail.note}
            onChange={(e) => setDetail({ note: e.target.value })}
            disabled={!isCurrentWeek}
            placeholder="Notas…"
            rows={2}
            className={`w-full rounded-lg bg-gacif-900 border border-gacif-border p-3 text-sm text-gacif-light placeholder-gacif-gray focus:outline-none focus:border-gacif-plata ${!isCurrentWeek ? "opacity-60" : ""}`}
          />
        </div>
      )}
    </section>
  );
}

function CardioCard({ day, displayWeek, isCurrentWeek, log, updateLog }) {
  const c = log?.cardio || { done: false, machine: "", note: "", date: new Date().toISOString().slice(0, 10) };
  const setCardio = (patch) => {
    updateLog(displayWeek, day.id, (dl) => {
      if (!dl.cardio) dl.cardio = { done: false, machine: "", note: "", date: new Date().toISOString().slice(0, 10) };
      Object.assign(dl.cardio, patch);
    });
  };

  return (
    <section className={`mb-6 rounded-2xl border p-5 ${c.done ? "border-emerald-700 bg-emerald-950" : "border-gacif-border bg-gacif-800"}`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-lg">Cardio · {day.cardio.minutes} min</h3>
          <p className="text-gacif-gray text-sm mt-1">{day.cardio.desc}</p>
        </div>
        <button
          onClick={() => setCardio({ done: !c.done })}
          disabled={!isCurrentWeek}
          className={`px-5 h-12 rounded-lg font-black text-base shrink-0 transition-colors ${c.done ? "bg-emerald-500 text-gacif-bg" : "bg-gacif-800 text-gacif-gray border border-gacif-border hover:border-gacif-plata"}`}
        >
          {c.done ? "✓ Hecho" : "Marcar"}
        </button>
      </div>

      <input
        type="date"
        value={c.date || new Date().toISOString().slice(0, 10)}
        onChange={(e) => setCardio({ date: e.target.value })}
        disabled={!isCurrentWeek}
        className={`w-full rounded-lg bg-gacif-900 border border-gacif-border px-3 py-2 text-sm mb-3 focus:outline-none focus:border-gacif-plata ${!isCurrentWeek ? "opacity-60" : ""}`}
      />

      <input
        value={c.machine}
        onChange={(e) => setCardio({ machine: e.target.value })}
        disabled={!isCurrentWeek}
        placeholder="Máquina (escaladora, elíptica…)"
        className={`w-full rounded-lg bg-gacif-900 border border-gacif-border px-3 py-2 text-sm mb-3 placeholder-gacif-gray focus:outline-none focus:border-gacif-plata ${!isCurrentWeek ? "opacity-60" : ""}`}
      />

      <textarea
        value={c.note}
        onChange={(e) => setCardio({ note: e.target.value })}
        disabled={!isCurrentWeek}
        placeholder="Nota (zonas, sensaciones…)"
        rows={1}
        className={`w-full rounded-lg bg-gacif-900 border border-gacif-border p-3 text-sm placeholder-gacif-gray focus:outline-none focus:border-gacif-plata ${!isCurrentWeek ? "opacity-60" : ""}`}
      />
    </section>
  );
}

// Pestaña Rutina
function RoutineTab({ routine, setData }) {
  return (
    <div>
      <div className="mb-6 rounded-xl bg-gacif-800 border border-gacif-border p-4">
        <p className="text-sm text-gacif-gray">Actualiza la rutina del coach. Ahora puedes duplicar la semana pasada como plantilla.</p>
      </div>

      {routine.days.map((day, di) => (
        <DayEditor key={day.id} day={day} di={di} setData={setData} totalDays={routine.days.length} />
      ))}

      <button
        onClick={() =>
          setData((prev) => {
            const next = structuredClone(prev);
            next.routine.days.push({ id: uid(), name: `Día ${next.routine.days.length + 1}`, subtitle: "", exercises: [], cardio: { minutes: 0, desc: "" } });
            return next;
          })
        }
        className="w-full mt-2 mb-8 rounded-xl border border-dashed border-gacif-border-light py-4 text-sm font-bold text-gacif-gray hover:text-gacif-light transition-colors"
      >
        + Agregar día
      </button>
    </div>
  );
}

function DayEditor({ day, di, setData, totalDays }) {
  const [open, setOpen] = useState(false);

  const update = (fn) => {
    setData((prev) => {
      const next = structuredClone(prev);
      fn(next.routine);
      return next;
    });
  };

  return (
    <section className="mb-4 rounded-2xl border border-gacif-border bg-gacif-800 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gacif-900 transition-colors">
        <div>
          <h3 className="font-bold text-lg">{day.name}</h3>
          <p className="text-xs text-gacif-gray mt-1">{day.subtitle || `${day.exercises.length} ejercicios`}</p>
        </div>
        <span className="text-gacif-gray font-black text-lg">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="px-5 pb-4 bg-gacif-900">
          <input
            value={day.name}
            onChange={(e) => update((r) => (r.days[di].name = e.target.value))}
            className="w-full rounded-lg bg-gacif-800 border border-gacif-border px-3 py-2 text-sm font-bold mb-3 focus:outline-none focus:border-gacif-plata"
          />
          <input
            value={day.subtitle}
            onChange={(e) => update((r) => (r.days[di].subtitle = e.target.value))}
            className="w-full rounded-lg bg-gacif-800 border border-gacif-border px-3 py-2 text-sm mb-4 focus:outline-none focus:border-gacif-plata"
            placeholder="Enfoque"
          />

          {day.exercises.map((ex, ei) => (
            <ExerciseEditor key={ex.id} ex={ex} di={di} ei={ei} update={update} />
          ))}

          <button
            onClick={() =>
              update((r) => r.days[di].exercises.push({ id: uid(), name: "Nuevo ejercicio", sets: [{ kg: 20, reps: 12 }, { kg: 20, reps: 12 }, { kg: 20, reps: 12 }] }))
            }
            className="w-full rounded-xl border border-dashed border-gacif-border-light py-3 text-sm font-bold text-gacif-plata mb-4 hover:text-gacif-light transition-colors"
          >
            + Agregar ejercicio
          </button>

          <div className="rounded-xl bg-gacif-800 border border-gacif-border p-3 mb-4">
            <div className="text-xs font-bold uppercase text-gacif-gray mb-2">Cardio</div>
            <div className="flex gap-2">
              <input
                type="number"
                value={day.cardio?.minutes ?? 0}
                onChange={(e) => update((r) => (r.days[di].cardio = { ...r.days[di].cardio, minutes: +e.target.value || 0 }))}
                className="w-20 rounded-lg bg-gacif-900 border border-gacif-border px-3 py-2 text-sm text-center font-bold focus:outline-none focus:border-gacif-plata"
              />
              <span className="text-xs text-gacif-gray">min</span>
              <input
                value={day.cardio?.desc ?? ""}
                onChange={(e) => update((r) => (r.days[di].cardio = { ...r.days[di].cardio, desc: e.target.value }))}
                placeholder="Descripción"
                className="flex-1 rounded-lg bg-gacif-900 border border-gacif-border px-3 py-2 text-sm focus:outline-none focus:border-gacif-plata"
              />
            </div>
          </div>

          {totalDays > 1 && (
            <ConfirmButton
              label="🗑 Eliminar este día"
              confirmLabel="¿Eliminar? Toca de nuevo"
              onConfirm={() =>
                update((r) => {
                  r.days = r.days.filter((d) => d.id !== day.id);
                })
              }
              className="text-xs font-bold text-red-400"
            />
          )}
        </div>
      )}
    </section>
  );
}

function ExerciseEditor({ ex, di, ei, update }) {
  return (
    <div className="rounded-xl bg-gacif-800 border border-gacif-border p-3 mb-3">
      <div className="flex gap-2 items-center mb-2">
        <input
          value={ex.name}
          onChange={(e) => update((r) => (r.days[di].exercises[ei].name = e.target.value))}
          className="flex-1 rounded-lg bg-gacif-900 border border-gacif-border px-3 py-2 text-sm font-bold focus:outline-none focus:border-gacif-plata"
        />
        <ConfirmButton
          label="×"
          confirmLabel="✓?"
          onConfirm={() =>
            update((r) => {
              r.days[di].exercises = r.days[di].exercises.filter((e) => e.id !== ex.id);
            })
          }
          className="w-9 h-9 rounded-lg bg-gacif-900 border border-gacif-border text-red-400 font-black shrink-0"
        />
      </div>

      {ex.sets.map((s, si) => (
        <div key={si} className="flex items-center gap-2 mb-2">
          <span className="w-6 text-center text-xs font-black text-gacif-gray-dark">{si + 1}</span>
          <input
            type="number"
            value={s.kg}
            onChange={(e) => update((r) => (r.days[di].exercises[ei].sets[si].kg = +e.target.value || 0))}
            className="w-20 rounded-lg bg-gacif-900 border border-gacif-border px-2 py-2 text-sm text-center font-bold focus:outline-none focus:border-gacif-plata"
          />
          <span className="text-xs text-gacif-gray">kg</span>
          <input
            type="number"
            value={s.reps}
            onChange={(e) => update((r) => (r.days[di].exercises[ei].sets[si].reps = +e.target.value || 0))}
            className="w-16 rounded-lg bg-gacif-900 border border-gacif-border px-2 py-2 text-sm text-center font-bold focus:outline-none focus:border-gacif-plata"
          />
          <span className="text-xs text-gacif-gray">rep</span>
          <button
            onClick={() =>
              update((r) => {
                r.days[di].exercises[ei].sets = r.days[di].exercises[ei].sets.filter((_, idx) => idx !== si);
              })
            }
            className="ml-auto w-8 h-8 rounded-lg bg-gacif-900 text-gacif-gray font-black text-xs hover:text-gacif-light transition-colors"
          >
            ×
          </button>
        </div>
      ))}

      <button
        onClick={() =>
          update((r) => {
            const arr = r.days[di].exercises[ei].sets;
            const last = arr[arr.length - 1] || { kg: 20, reps: 12 };
            arr.push({ ...last });
          })
        }
        className="text-xs font-bold text-gacif-plata hover:text-gacif-light transition-colors"
      >
        + Serie
      </button>
    </div>
  );
}

// Pestaña Progreso
function ProgressTab({ routine, logs, displayWeek }) {
  const allExercises = useMemo(() => {
    const names = new Map();
    routine.days.forEach((d) => d.exercises.forEach((e) => names.set(e.name, e)));
    Object.values(logs).forEach((weekLog) =>
      Object.entries(weekLog).forEach(([dayId, dl]) =>
        Object.entries(dl.exercises || {}).forEach(([exId, e]) => {
          if (e.name && !names.has(e.name)) names.set(e.name, { name: e.name });
        })
      )
    );
    return [...names.values()];
  }, [routine, logs]);

  const [selected, setSelected] = useState(allExercises[0]?.name || "");
  useEffect(() => {
    if (!selected && allExercises.length) setSelected(allExercises[0].name);
  }, [allExercises, selected]);

  const weekSummary = useMemo(() => {
    const log = logs[displayWeek];
    if (!log) return null;
    let sessions = 0,
      seriesDone = 0,
      seriesTotal = 0,
      cardioMin = 0;
    Object.values(log).forEach((dl) => {
      if (Object.keys(dl.exercises || {}).length > 0 || (dl.cardio && dl.cardio.done)) sessions++;
      Object.values(dl.exercises || {}).forEach((e) => {
        seriesTotal += e.sets?.length || 0;
        seriesDone += e.sets?.filter((s) => s.done).length || 0;
      });
      if (dl.cardio?.done) cardioMin += (log[0]?.cardio?.minutes || 0);
    });
    return { sessions, seriesDone, seriesTotal, cardioMin };
  }, [logs, displayWeek]);

  const series = useMemo(() => {
    if (!selected) return [];
    const pts = [];
    Object.keys(logs)
      .sort()
      .forEach((week) => {
        let maxKg = null,
          vol = 0;
        Object.values(logs[week]).forEach((dl) =>
          Object.values(dl.exercises || {}).forEach((e) => {
            if (e.name?.toLowerCase() === selected.toLowerCase()) {
              e.sets.forEach((s) => {
                if (s.done) {
                  vol += s.kg * s.reps;
                  if (maxKg === null || s.kg > maxKg) maxKg = s.kg;
                }
              });
            }
          })
        );
        if (maxKg !== null) pts.push({ week: fmtWeek(week).split("–")[0].trim(), maxKg, vol });
      });
    return pts;
  }, [logs, selected]);

  return (
    <div>
      <h2 className="text-2xl font-black mb-4">Progresión</h2>

      {weekSummary && (
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-gacif-800 border border-gacif-border p-4 text-center">
            <div className="text-xs uppercase text-gacif-gray font-bold mb-1">Sesiones</div>
            <div className="text-3xl font-black text-gacif-plata">{weekSummary.sessions}</div>
          </div>
          <div className="rounded-xl bg-gacif-800 border border-gacif-border p-4 text-center">
            <div className="text-xs uppercase text-gacif-gray font-bold mb-1">Series</div>
            <div className="text-3xl font-black text-gacif-plata">{weekSummary.seriesDone}/{weekSummary.seriesTotal}</div>
          </div>
        </div>
      )}

      {Object.keys(logs).length === 0 ? (
        <div className="rounded-2xl border border-gacif-border bg-gacif-800 p-8 text-center">
          <p className="text-base text-gacif-gray">Sin registros aún.</p>
        </div>
      ) : (
        <>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full rounded-xl bg-gacif-800 border border-gacif-border px-4 py-3 text-sm font-bold mb-4 focus:outline-none focus:border-gacif-plata"
          >
            {allExercises.map((e) => (
              <option key={e.name} value={e.name}>
                {e.name}
              </option>
            ))}
          </select>

          {series.length === 0 ? (
            <p className="text-base text-gacif-gray">Sin series completadas.</p>
          ) : (
            <div className="rounded-2xl border border-gacif-border bg-gacif-800 p-4">
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <LineChart data={series}>
                    <CartesianGrid stroke="#2a5a8c" strokeDasharray="3 3" />
                    <XAxis dataKey="week" tick={{ fill: "#8899AA", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#8899AA", fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #1a3a5c", borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="maxKg" stroke="#C0C0C0" strokeWidth={3} dot={{ r: 5, fill: "#C0C0C0" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Pestaña Brief
function BriefTab({ routine, logs, currentWeek, displayWeek, queries }) {
  const weeks = Object.keys(logs).sort().reverse();
  const [week, setWeek] = useState(weeks.includes(displayWeek) ? displayWeek : weeks[0] || displayWeek);
  const [copied, setCopied] = useState(false);
  const areaRef = useRef(null);

  const text = useMemo(() => buildBrief(routine, logs, week, queries), [routine, logs, week, queries]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (e) {
      if (areaRef.current) {
        areaRef.current.select();
        document.execCommand("copy");
        setCopied(true);
      }
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const exportData = () => {
    const json = JSON.stringify({ logs, queries }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `entrenamientos-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div>
      <h2 className="text-2xl font-black mb-4">Brief semanal</h2>

      {weeks.length === 0 ? (
        <div className="rounded-2xl border border-gacif-border bg-gacif-800 p-8 text-center">
          <p className="text-base text-gacif-gray">Sin semanas registradas.</p>
        </div>
      ) : (
        <>
          <div className="flex gap-3 mb-4">
            <select
              value={week}
              onChange={(e) => setWeek(e.target.value)}
              className="flex-1 rounded-xl bg-gacif-800 border border-gacif-border px-4 py-3 text-sm font-bold focus:outline-none focus:border-gacif-plata"
            >
              {weeks.map((w) => (
                <option key={w} value={w}>
                  {fmtWeek(w)}
                </option>
              ))}
            </select>
            <button onClick={copy} className={`px-5 rounded-xl font-black text-sm transition-colors ${copied ? "bg-emerald-500 text-gacif-bg" : "bg-gacif-plata text-gacif-bg hover:bg-gacif-light"}`}>
              {copied ? "✓" : "Copy"}
            </button>
          </div>
          <textarea
            ref={areaRef}
            readOnly
            value={text}
            rows={22}
            className="w-full rounded-2xl bg-gacif-800 border border-gacif-border p-4 text-xs text-gacif-light leading-relaxed focus:outline-none"
            style={{ fontFamily: "ui-monospace, monospace" }}
          />
          <button
            onClick={exportData}
            className="w-full mt-4 rounded-xl bg-gacif-800 border border-gacif-border px-4 py-3 text-sm font-bold text-gacif-plata hover:border-gacif-plata transition-colors"
          >
            ⬇ Exportar todos los datos (JSON)
          </button>
        </>
      )}
    </div>
  );
}

function buildBrief(routine, logs, week, queries) {
  const weekLog = logs[week];
  if (!weekLog) return "Sin registros.";
  const lines = [];
  lines.push(`BRIEF SEMANAL`);
  lines.push(`${fmtWeek(week)}`);
  lines.push(`${"=".repeat(50)}`);

  routine.days.forEach((day) => {
    const dl = weekLog[day.id];
    if (!dl) return;
    lines.push("");
    lines.push(`${day.name.toUpperCase()} — ${day.subtitle}`);
    lines.push("-".repeat(50));
    Object.values(dl.exercises || {}).forEach((e) => {
      if (e.wodDetail) {
        const wd = e.wodDetail;
        lines.push(`• ${e.name}: "${wd.title}" (${wd.score})`);
        if (wd.time) lines.push(`  Tiempo: ${wd.time}`);
        if (wd.rpe) lines.push(`  RPE: ${wd.rpe}/10`);
        if (wd.note) lines.push(`  Nota: ${wd.note}`);
      } else {
        const done = e.sets.filter((s) => s.done);
        const setsTxt = done.map((s) => (s.kg > 0 ? `${s.kg}×${s.reps}` : `corporal×${s.reps}`)).join(" · ");
        lines.push(`• ${e.name}: ${setsTxt || "—"}`);
        if (e.rpe) lines.push(`  RPE: ${e.rpe}/10`);
        if (e.note) lines.push(`  ${e.note}`);
      }
    });
    if (dl.cardio?.done) {
      lines.push(`• Cardio ${day.cardio?.minutes || ""}': ${dl.cardio.machine || "—"}`);
      if (dl.cardio.note) lines.push(`  ${dl.cardio.note}`);
    }
  });

  if (queries && queries[week]) {
    lines.push("");
    lines.push("CONSULTAS PARA EL COACH");
    lines.push(queries[week]);
  }

  lines.push("");
  lines.push("=".repeat(50));
  return lines.join("\n");
}

// Pestaña Antropometría
function MeasurementsTab({ measurements, setData }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [weight, setWeight] = useState("");
  const [fatMass, setFatMass] = useState("");
  const [muscleMass, setMuscleMass] = useState("");

  const add = () => {
    if (!date || !weight) return;
    setData((prev) => {
      const next = structuredClone(prev);
      next.measurements = (next.measurements || []).sort((a, b) => new Date(a.date) - new Date(b.date));
      next.measurements.push({ date, weight: parseFloat(weight), fatMass: parseFloat(fatMass) || null, muscleMass: parseFloat(muscleMass) || null });
      return next;
    });
    setWeight("");
    setFatMass("");
    setMuscleMass("");
  };

  const sortedMeasurements = useMemo(() => (measurements || []).sort((a, b) => new Date(a.date) - new Date(b.date)), [measurements]);

  return (
    <div>
      <h2 className="text-2xl font-black mb-4">Controles antropométricos</h2>

      <div className="rounded-2xl border border-gacif-border bg-gacif-800 p-4 mb-5">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg bg-gacif-900 border border-gacif-border px-3 py-2 text-sm focus:outline-none focus:border-gacif-plata" />
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Peso (kg)" step="0.1" className="rounded-lg bg-gacif-900 border border-gacif-border px-3 py-2 text-sm focus:outline-none focus:border-gacif-plata" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input type="number" value={fatMass} onChange={(e) => setFatMass(e.target.value)} placeholder="Grasa (kg)" step="0.1" className="rounded-lg bg-gacif-900 border border-gacif-border px-3 py-2 text-sm focus:outline-none focus:border-gacif-plata" />
          <input type="number" value={muscleMass} onChange={(e) => setMuscleMass(e.target.value)} placeholder="Músculo (kg)" step="0.1" className="rounded-lg bg-gacif-900 border border-gacif-border px-3 py-2 text-sm focus:outline-none focus:border-gacif-plata" />
        </div>
        <button onClick={add} className="w-full rounded-lg bg-gacif-plata text-gacif-bg font-bold py-2.5 text-sm">
          + Registrar
        </button>
      </div>

      {sortedMeasurements.length === 0 ? (
        <p className="text-base text-gacif-gray">Sin controles aún.</p>
      ) : (
        <>
          {weight && (
            <div className="rounded-2xl border border-gacif-border bg-gacif-800 p-4 mb-4">
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <LineChart data={sortedMeasurements}>
                    <CartesianGrid stroke="#2a5a8c" />
                    <XAxis dataKey="date" tick={{ fill: "#8899AA", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#8899AA", fontSize: 10 }} domain={["auto", "auto"]} />
                    <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #1a3a5c", borderRadius: 8 }} />
                    <Line type="monotone" dataKey="weight" stroke="#fbbf24" strokeWidth={3} dot={{ r: 4 }} />
                    {sortedMeasurements[0]?.fatMass && <Line type="monotone" dataKey="fatMass" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />}
                    {sortedMeasurements[0]?.muscleMass && <Line type="monotone" dataKey="muscleMass" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {sortedMeasurements.map((m, i) => (
              <div key={i} className="rounded-lg bg-gacif-800 border border-gacif-border p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">{m.date}</span>
                  <ConfirmButton
                    label="🗑"
                    confirmLabel="¿Borrar?"
                    onConfirm={() =>
                      setData((prev) => ({
                        ...prev,
                        measurements: prev.measurements.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="text-xs text-red-400 font-bold"
                  />
                </div>
                <p className="text-xs text-gacif-gray mt-1">{m.weight} kg {m.fatMass && `· ${m.fatMass} kg grasa`} {m.muscleMass && `· ${m.muscleMass} kg músculo`}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
