import {
  DAYS,
  START_HOUR,
  END_HOUR,
  toMinutes,
  assignLanes,
  getCourseColor,
} from "../utils/schedule.js";

// Alto en píxeles de cada hora en la cuadrícula
const HOUR_HEIGHT = 48;

// Lista de horas para la columna izquierda: [7, 8, 9, ..., 22]
const HOURS = [];
for (let hour = START_HOUR; hour < END_HOUR; hour++) {
  HOURS.push(hour);
}

// Cuadrícula semanal: una columna por día y cada clase como un bloque
// ubicado según su hora de inicio y su duración.
export default function WeekGrid({ sessions, courseNames, conflictIds }) {
  const totalHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

  return (
    <section className="panel grid-panel" aria-labelledby="grid-title">
      <h2 id="grid-title">Horario semanal</h2>

      {/* Este contenedor permite desplazarse de lado en pantallas pequeñas */}
      <div className="week-scroll">
        <div className="week-grid">
          {/* Fila de encabezados */}
          <div className="week-corner" />
          {DAYS.map((day) => (
            <div key={day.id} className="week-day-name">
              {day.short}
            </div>
          ))}

          {/* Columna de horas */}
          <div className="week-hours" style={{ height: totalHeight }}>
            {HOURS.map((hour) => (
              <span key={hour} className="week-hour" style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }}>
                {String(hour).padStart(2, "0")}:00
              </span>
            ))}
          </div>

          {/* Una columna por día */}
          {DAYS.map((day) => {
            const daySessions = sessions.filter((session) => session.day === day.id);
            const { laneById, laneCount } = assignLanes(daySessions);

            return (
              <div
                key={day.id}
                className="week-column"
                style={{ height: totalHeight, backgroundSize: `100% ${HOUR_HEIGHT}px` }}
              >
                {daySessions.map((session) => {
                  const start = toMinutes(session.start);
                  const end = toMinutes(session.end);
                  const lane = laneById[session.id];
                  const color = getCourseColor(session.course, courseNames);
                  const hasConflict = conflictIds.has(session.id);

                  // Clases de nombre para el CSS: cruce y bloque angosto
                  let className = "class-block";
                  if (hasConflict) className += " is-conflict";
                  if (laneCount > 1) className += " is-narrow";

                  // Posición y tamaño del bloque, calculados con la hora
                  const style = {
                    top: ((start - START_HOUR * 60) / 60) * HOUR_HEIGHT,
                    height: ((end - start) / 60) * HOUR_HEIGHT,
                    left: `${(lane / laneCount) * 100}%`,
                    width: `${100 / laneCount}%`,
                    "--course-bg": color.bg,
                    "--course-border": color.border,
                  };

                  return (
                    <div
                      key={session.id}
                      className={className}
                      style={style}
                      title={`${session.course}, ${session.start} a ${session.end}`}
                    >
                      <span className="class-name">{session.course}</span>
                      <span className="class-time">
                        {session.start} a {session.end}
                      </span>
                      {session.room && <span className="class-room">{session.room}</span>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
