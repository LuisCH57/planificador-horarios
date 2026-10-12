import { useState, useEffect } from "react";
import SessionForm from "./components/SessionForm.jsx";
import SessionList from "./components/SessionList.jsx";
import ConflictPanel from "./components/ConflictPanel.jsx";
import WeekGrid from "./components/WeekGrid.jsx";
import { findConflicts, getWeeklyHours } from "./utils/schedule.js";
import { EXAMPLE_SESSIONS } from "./data/example.js";
import "./App.css";

// Clave en localStorage (con prefijo para no chocar con otros proyectos)
const STORAGE_KEY = "planificador-horarios:sessions";

function loadSessions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === null ? [] : JSON.parse(saved);
  } catch (error) {
    console.error("No se pudieron leer las clases guardadas:", error);
    return [];
  }
}

// Componente principal: guarda el ESTADO y se lo pasa a los demás componentes
export default function App() {
  // 1. ESTADO: la lista de clases (única fuente de verdad)
  const [sessions, setSessions] = useState(loadSessions);

  // 2. GUARDAR: cada vez que "sessions" cambia, se guarda en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // 3. DATOS DERIVADOS: se calculan a partir del estado en cada dibujado,
  //    no se guardan por separado
  const conflicts = findConflicts(sessions);
  const conflictIds = new Set(conflicts.flatMap(([a, b]) => [a.id, b.id]));
  const courseNames = [...new Set(sessions.map((session) => session.course))];
  const weeklyHours = getWeeklyHours(sessions);

  // 4. ACCIONES: la única forma de cambiar el estado es con setSessions
  function addSession(data) {
    const newSession = { ...data, id: crypto.randomUUID() };
    setSessions([...sessions, newSession]);
  }

  function deleteSession(id) {
    setSessions(sessions.filter((session) => session.id !== id));
  }

  function loadExample() {
    setSessions(EXAMPLE_SESSIONS);
  }

  function clearAll() {
    if (confirm("¿Borrar todas las clases del horario?")) {
      setSessions([]);
    }
  }

  // 5. DIBUJAR: describimos cómo se ve la pantalla con estos datos.
  //    React la actualiza solo cuando el estado cambia.
  return (
    <>
      <header className="app-header">
        <div className="container header-inner">
          <div>
            <h1>Planificador de horarios</h1>
            <p className="subtitle">Arma tu semana de clases y detecta los cruces antes de matricularte.</p>
          </div>

          <dl className="stats">
            <div>
              <dt>Cursos</dt>
              <dd>{courseNames.length}</dd>
            </div>
            <div>
              <dt>Horas por semana</dt>
              <dd>{weeklyHours}</dd>
            </div>
            <div className={conflicts.length > 0 ? "stat-alert" : ""}>
              <dt>Cruces</dt>
              <dd>{conflicts.length}</dd>
            </div>
          </dl>
        </div>
      </header>

      <main className="container layout">
        <div className="sidebar">
          <SessionForm courseNames={courseNames} onAdd={addSession} />
          <ConflictPanel conflicts={conflicts} hasSessions={sessions.length > 0} />
          <SessionList
            sessions={sessions}
            courseNames={courseNames}
            conflictIds={conflictIds}
            onDelete={deleteSession}
            onLoadExample={loadExample}
          />
          {sessions.length > 0 && (
            <button type="button" className="text-button" onClick={clearAll}>
              Borrar todo el horario
            </button>
          )}
        </div>

        <WeekGrid sessions={sessions} courseNames={courseNames} conflictIds={conflictIds} />
      </main>

      <footer className="app-footer container">
        <p>
          Proyecto 3 de mi <a href="https://luisch57.github.io">ruta de proyectos</a>. Hecho con React. Los datos se
          guardan solo en este navegador.
        </p>
      </footer>
    </>
  );
}
