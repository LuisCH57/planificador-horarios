import { useState } from "react";
import { DAYS, START_HOUR, END_HOUR, toMinutes } from "../utils/schedule.js";

// Valores iniciales del formulario
const EMPTY_FORM = {
  course: "",
  day: "1",
  start: "08:00",
  end: "10:00",
  room: "",
};

// Formulario para agregar una clase.
// Props:
// - courseNames: cursos ya registrados (para sugerirlos al escribir)
// - onAdd: función del componente padre que agrega la clase
export default function SessionForm({ courseNames, onAdd }) {
  // Estado: lo que el usuario está escribiendo y el mensaje de error
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  // Un solo manejador para todos los campos: usa el atributo "name"
  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const course = form.course.trim();
    const start = toMinutes(form.start);
    const end = toMinutes(form.end);

    if (course === "") {
      setError("Escribe el nombre del curso.");
      return;
    }
    if (end <= start) {
      setError("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }
    if (start < START_HOUR * 60 || end > END_HOUR * 60) {
      setError(`El horario debe estar entre las ${START_HOUR}:00 y las ${END_HOUR}:00.`);
      return;
    }

    setError("");
    onAdd({
      course: course,
      day: Number(form.day),
      start: form.start,
      end: form.end,
      room: form.room.trim(),
    });

    // Conservar el curso y el día: es común agregar varias clases del mismo curso
    setForm({ ...form, room: "" });
  }

  return (
    <form className="panel" onSubmit={handleSubmit} noValidate>
      <h2>Agregar clase</h2>

      <div className="field">
        <label htmlFor="course">Curso</label>
        <input
          id="course"
          name="course"
          type="text"
          list="course-suggestions"
          placeholder="Ej.: Cálculo II"
          maxLength={50}
          value={form.course}
          onChange={handleChange}
        />
        {/* Sugerencias con los cursos que ya registraste */}
        <datalist id="course-suggestions">
          {courseNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </div>

      <div className="field">
        <label htmlFor="day">Día</label>
        <select id="day" name="day" value={form.day} onChange={handleChange}>
          {DAYS.map((day) => (
            <option key={day.id} value={day.id}>
              {day.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="start">Inicio</label>
          <input id="start" name="start" type="time" step="1800" value={form.start} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="end">Fin</label>
          <input id="end" name="end" type="time" step="1800" value={form.end} onChange={handleChange} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="room">Aula (opcional)</label>
        <input
          id="room"
          name="room"
          type="text"
          placeholder="Ej.: A-301"
          maxLength={30}
          value={form.room}
          onChange={handleChange}
        />
      </div>

      {/* Solo se muestra si hay un error */}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="button">
        Agregar clase
      </button>
    </form>
  );
}
