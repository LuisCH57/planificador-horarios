import { getDay, getCourseColor, sortSessions } from "../utils/schedule.js";

// Lista de clases registradas, ordenadas por día y hora.
// Props:
// - sessions, courseNames, conflictIds: datos que vienen del componente App
// - onDelete, onLoadExample: funciones de App para modificar los datos
export default function SessionList({ sessions, courseNames, conflictIds, onDelete, onLoadExample }) {
  // Estado vacío: invitar a agregar clases o a cargar un ejemplo
  if (sessions.length === 0) {
    return (
      <section className="panel">
        <h2>Tus clases</h2>
        <p className="empty">Todavía no agregas clases. Usa el formulario o prueba con un horario de ejemplo.</p>
        <button type="button" className="button-secondary" onClick={onLoadExample}>
          Cargar horario de ejemplo
        </button>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Tus clases</h2>
      <ul className="session-list">
        {sortSessions(sessions).map((session) => {
          const color = getCourseColor(session.course, courseNames);
          const hasConflict = conflictIds.has(session.id);

          return (
            <li key={session.id} className="session-item">
              <span className="color-dot" style={{ backgroundColor: color.border }} aria-hidden="true" />
              <div className="session-info">
                <span className="session-course">{session.course}</span>
                <span className="session-meta">
                  {getDay(session.day).short} {session.start} a {session.end}
                  {session.room && `, ${session.room}`}
                </span>
              </div>
              {hasConflict && <span className="tag-conflict">Cruce</span>}
              <button
                type="button"
                className="delete-button"
                onClick={() => onDelete(session.id)}
                aria-label={`Eliminar ${session.course} del ${getDay(session.day).name}`}
              >
                Eliminar
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
