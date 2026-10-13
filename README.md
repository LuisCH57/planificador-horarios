# Planificador de horarios universitarios

Aplicación web para armar el horario semanal de clases y detectar automáticamente los cruces entre cursos antes de matricularse.

**Demo:** https://luisch57.github.io/planificador-horarios/

## Funcionalidades

- Agregar clases con curso, día, hora de inicio y fin, y aula.
- Ver la semana en una cuadrícula de lunes a sábado, con un color por curso.
- Detectar los cruces de horario y marcarlos en rojo, mostrando las clases que se superponen una al lado de la otra.
- Indicadores de cursos, horas por semana y cruces.
- Sugerir cursos ya registrados al escribir, para agregar varias clases del mismo curso.
- Validar el formulario (curso vacío, hora de fin anterior a la de inicio, horario fuera de rango).
- Guardar el horario en el navegador y cargar un horario de ejemplo.

## Tecnologías

- React 19 (componentes, `useState`, `useEffect`, props)
- Vite (entorno de desarrollo y compilación)
- JavaScript, HTML y CSS (Grid y posicionamiento absoluto para la cuadrícula)
- `localStorage` para guardar los datos
- GitHub Actions y GitHub Pages para publicar automáticamente con cada `push`

## Arquitectura

```
App.jsx              Estado principal (lista de clases) y acciones
├── SessionForm      Formulario con su propio estado (lo que se está escribiendo)
├── ConflictPanel    Resumen de cruces
├── SessionList      Lista de clases
└── WeekGrid         Cuadrícula semanal
utils/schedule.js    Funciones puras: cruces, horas, orden y posiciones
```

Los datos fluyen en una sola dirección: `App` guarda el estado y lo pasa a los componentes como props. Los componentes hijos no modifican los datos; llaman a funciones de `App` (`onAdd`, `onDelete`).

## Decisiones técnicas

- **Detección de cruces:** dos clases se cruzan si son el mismo día y cada una empieza antes de que termine la otra (`inicioA < finB && inicioB < finA`). Las horas se convierten a minutos para compararlas como números.
- **Datos derivados:** los cruces, las horas semanales y la lista de cursos se calculan a partir del estado en cada dibujado, en lugar de guardarse por separado. Así nunca quedan desactualizados.
- **Carriles:** las clases que se cruzan se reparten en carriles para mostrarse lado a lado en vez de taparse.
- **Lógica separada de la interfaz:** los cálculos viven en `utils/schedule.js` como funciones puras, fáciles de probar.

## Limitaciones y mejoras futuras

- Los datos se guardan solo en el navegador donde se registran.
- Agregar edición de clases y exportar el horario como imagen.
- Agregar pruebas automáticas para `utils/schedule.js`.

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Luego abre la dirección que muestra la terminal (por ejemplo, `http://localhost:5173/planificador-horarios/`).
