import { getDay } from "../utils/schedule.js";

// Muestra los cruces de horario encontrados.
// Props:
// - conflicts: lista de pares [claseA, claseB] que se cruzan
// - hasSessions: si ya hay clases registradas
export default function ConflictPanel({ conflicts, hasSessions }) {
  if (!hasSessions) {
    return null; // sin clases no hay nada que revisar
  }

  if (conflicts.length === 0) {
    return (
      <section className="panel conflict-panel conflict-panel-ok" aria-live="polite">
        <h2>Sin cruces</h2>
        <p>Ninguna de tus clases se superpone con otra.</p>
      </section>
    );
  }

  return (
    <section className="panel conflict-panel conflict-panel-alert" aria-live="polite">
      <h2>{conflicts.length === 1 ? "1 cruce de horario" : `${conflicts.length} cruces de horario`}</h2>
      <ul className="conflict-list">
        {conflicts.map(([a, b]) => (
          <li key={`${a.id}-${b.id}`}>
            <strong>{a.course}</strong> ({a.start} a {a.end}) y <strong>{b.course}</strong> ({b.start} a {b.end}),
            el {getDay(a.day).name.toLowerCase()}.
          </li>
        ))}
      </ul>
    </section>
  );
}
