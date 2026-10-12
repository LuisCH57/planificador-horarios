// ==========================================================
// Funciones "puras" del horario: reciben datos y devuelven
// resultados, sin tocar la pantalla. Son fáciles de probar.
// ==========================================================

// Días que muestra el horario (1 = lunes ... 6 = sábado)
export const DAYS = [
  { id: 1, short: "Lun", name: "Lunes" },
  { id: 2, short: "Mar", name: "Martes" },
  { id: 3, short: "Mié", name: "Miércoles" },
  { id: 4, short: "Jue", name: "Jueves" },
  { id: 5, short: "Vie", name: "Viernes" },
  { id: 6, short: "Sáb", name: "Sábado" },
];

// Rango de horas visible en la cuadrícula
export const START_HOUR = 7;
export const END_HOUR = 23;

// Colores para los cursos (fondo suave, borde y texto oscuro)
const COURSE_COLORS = [
  { bg: "#dff3f1", border: "#0b7a75" },
  { bg: "#e5ecfb", border: "#3559b7" },
  { bg: "#fcefd9", border: "#a86400" },
  { bg: "#f1e6f8", border: "#7b3fa3" },
  { bg: "#e4f4e2", border: "#2f7a2a" },
  { bg: "#fbe5ea", border: "#b0365a" },
  { bg: "#e3f1f8", border: "#1f6f94" },
  { bg: "#efece4", border: "#6b5a3a" },
];

// "08:30" -> 510 (minutos desde la medianoche)
export function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getDay(dayId) {
  return DAYS.find((day) => day.id === dayId);
}

// Dos clases se cruzan si son el mismo día y sus horarios se superponen.
// Ejemplo: 08:00-10:00 y 09:00-11:00 se cruzan; 08:00-10:00 y 10:00-12:00 no.
export function overlaps(a, b) {
  return (
    a.day === b.day &&
    toMinutes(a.start) < toMinutes(b.end) &&
    toMinutes(b.start) < toMinutes(a.end)
  );
}

// Compara cada clase con todas las demás y devuelve los pares que se cruzan
export function findConflicts(sessions) {
  const pairs = [];
  for (let i = 0; i < sessions.length; i++) {
    for (let j = i + 1; j < sessions.length; j++) {
      if (overlaps(sessions[i], sessions[j])) {
        pairs.push([sessions[i], sessions[j]]);
      }
    }
  }
  return pairs;
}

// Total de horas de clase por semana
export function getWeeklyHours(sessions) {
  let minutes = 0;
  for (const session of sessions) {
    minutes += toMinutes(session.end) - toMinutes(session.start);
  }
  return minutes / 60;
}

// Ordena por día y luego por hora de inicio
export function sortSessions(sessions) {
  return sessions.slice().sort((a, b) => {
    if (a.day !== b.day) {
      return a.day - b.day;
    }
    return toMinutes(a.start) - toMinutes(b.start);
  });
}

// Cada curso recibe un color según el orden en que se agregó
export function getCourseColor(courseName, courseNames) {
  const index = courseNames.indexOf(courseName);
  return COURSE_COLORS[index % COURSE_COLORS.length];
}

// Reparte en "carriles" las clases de un mismo día para que las que se
// cruzan aparezcan una al lado de la otra en vez de taparse.
// Devuelve el carril de cada clase y cuántos carriles hacen falta.
export function assignLanes(daySessions) {
  const laneEnds = []; // minuto en que termina la última clase de cada carril
  const laneById = {};

  for (const session of sortSessions(daySessions)) {
    const start = toMinutes(session.start);
    let lane = laneEnds.findIndex((end) => end <= start); // primer carril libre

    if (lane === -1) {
      lane = laneEnds.length; // ninguno libre: abrir un carril nuevo
      laneEnds.push(0);
    }

    laneEnds[lane] = toMinutes(session.end);
    laneById[session.id] = lane;
  }

  return { laneById, laneCount: Math.max(laneEnds.length, 1) };
}
