# 💪 GACIF Entrenamiento App

**Aplicación de registro de entrenamiento para recomposición corporal**

Una app moderna, responsiva y minimalista para registrar tu entrenamiento en el gym, monitorear tu progresión de cargas, y compartir briefs semanales con tu coach.

---

## 🎯 Características principales

✅ **Registro de entrenamientos** — Registra series, kilos y repeticiones en tiempo real  
✅ **Temporizador de descanso** — Cuenta regresiva automática de 2 minutos entre series  
✅ **Progresión de cargas** — Visualiza gráficamente la evolución de tu máximo peso por ejercicio  
✅ **Brief semanal** — Genera resúmenes semanales copiables para compartir con tu coach  
✅ **Consultas al coach** — Espacio para anotar dudas y observaciones durante el entreno  
✅ **Módulo antropométrico** — Registra peso, masa grasa y masa muscular; visualiza tu recomposición  
✅ **RPE por ejercicio** — Esfuerzo percibido 1-10 para cada movimiento  
✅ **Exportar datos** — Descarga tu historial completo en JSON  
✅ **Modo dark** — Diseño optimizado para entrenar de noche (colores GACIF)  
✅ **Almacenamiento local** — Tus datos se guardan automáticamente en el navegador

---

## 🚀 Instalación rápida

### Requisitos
- **Node.js** v16+ ([descargar aquí](https://nodejs.org))
- **npm** o **yarn** (incluido con Node)
- **Git** (para clonar el repositorio)

### Pasos

1. **Clona el repositorio**
```bash
git clone https://github.com/tu-usuario/gacif-entrenamiento-app.git
cd gacif-entrenamiento-app
```

2. **Instala dependencias**
```bash
npm install
```

3. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

4. **Abre en tu navegador**
```
http://localhost:3000
```

---

## 📱 Estructura de carpetas

```
gacif-entrenamiento-app/
├── src/
│   ├── main.jsx          # Punto de entrada React
│   ├── App.jsx           # Componente principal (toda la lógica)
│   └── index.css         # Estilos globales y paleta GACIF
├── index.html            # HTML base
├── package.json          # Dependencias y scripts
├── vite.config.js        # Configuración de build
├── .gitignore            # Archivos a ignorar en Git
└── README.md             # Este archivo
```

---

## 🎨 Diseño y colores

**Paleta corporativa GACIF:**
- **Azul marino oscuro** `#0A1E35` — Fondo principal
- **Azul marino secundario** `#143454` — Tarjetas y elementos
- **Gris plata** `#C0C0C0` — Acentos, botones principales
- **Blanco** `#FFFFFF` — Textos principales
- **Gris azulado** `#8899AA` — Textos secundarios

Diseño **mobile-first** optimizado para entrenar desde el teléfono en el gym.

---

## 🛠️ Scripts disponibles

```bash
# Inicia servidor de desarrollo (hot reload)
npm run dev

# Construye la app para producción
npm run build

# Visualiza la build de producción localmente
npm run preview

# Ejecuta linter (opcional)
npm run lint
```

---

## 📊 Cómo usar la app

### Pestaña **Entrenar**
1. Selecciona el día (Lunes/Miércoles/Viernes para gym)
2. Ajusta kg y reps con los botones +/-
3. Marca ✓ cuando termines una serie → temporizador inicia automáticamente
4. Agrega notas de sensaciones (colapsable)
5. Registra RPE (1-10) del esfuerzo
6. Marca Cardio cuando completes

### Pestaña **Rutina**
1. Edita nombre y enfoque de cada día
2. Ajusta cargas objetivo y reps para cada serie
3. Agrega/elimina ejercicios y series con los botones
4. Configura minutos de cardio y descripción
5. Los cambios se guardan automáticamente

### Pestaña **Progreso**
1. Selecciona un ejercicio del dropdown
2. Visualiza gráfico de tu carga máxima semana a semana
3. Resumen de sesiones, series y cardio acumulado

### Pestaña **Brief**
1. Elige la semana a resumir
2. Copia el texto copiable con todas tus series, WODs, cardio y consultas
3. Pégalo en WhatsApp/email al coach
4. Descarga JSON con todo tu historial

### Pestaña **Medidas**
1. Registra peso, masa grasa y masa muscular en cada control
2. Visualiza las 3 curvas superpuestas
3. Monitorea tu recomposición corporal

---

## 🌐 Deployment

### Opción 1: GitHub Pages (Gratis, estático)

1. **Sube a GitHub**
```bash
git remote add origin https://github.com/tu-usuario/gacif-entrenamiento-app.git
git branch -M main
git push -u origin main
```

2. **Activa GitHub Pages**
   - Ve a Settings → Pages
   - Build and deployment → Source: GitHub Actions
   - Crea archivo `.github/workflows/deploy.yml` (ver abajo)

3. **Build y deploy automático**
```bash
npm run build
git add dist/
git commit -m "Deploy"
git push
```

### Opción 2: Vercel (Recomendado, fácil)

1. **Push a GitHub** (ver arriba)
2. **Importa en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "New Project"
   - Selecciona tu repositorio de GitHub
   - Vercel detecta que es Vite automáticamente
   - Click Deploy

3. **Listo** — Tu app estará en `tu-proyecto.vercel.app`

### Opción 3: Netlify (También fácil)

1. **Push a GitHub** (ver arriba)
2. **Deploy**
   - Ve a [netlify.com](https://netlify.com)
   - "New site from Git"
   - Conecta GitHub, selecciona repo
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click Deploy

---

## 📄 GitHub Actions Workflow (Opcional)

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
```

---

## 💾 Almacenamiento de datos

La app guarda automáticamente en **localStorage** del navegador con clave:
```
gym-recomp-data-v2
```

**Formato:** JSON con estructura:
```javascript
{
  routine: { days: [...] },
  logs: { "2024-01-01": { "day-id": {...} } },
  queries: { "2024-01-01": "Notas..." },
  measurements: [{ date, weight, fatMass, muscleMass }]
}
```

### Exportar tus datos
- Pestaña **Brief** → Botón "⬇ Exportar"
- Se descarga archivo JSON con todo tu historial
- Puedes analizarlo en Excel o migrar a otra herramienta

### Respaldar manualmente
```javascript
// En consola del navegador
copy(JSON.stringify(localStorage.getItem('gym-recomp-data-v2')))
// Pega en un archivo .json
```

---

## 🔧 Desarrollo local

### Estructura de componentes

La app está en un **único componente** (`App.jsx`) para simplicidad:

- **App** — Componente raíz con estado global
- **TrainTab** — Pantalla de entrenamiento
- **RoutineTab** — Editor de rutina
- **ProgressTab** — Gráficos de progresión
- **BriefTab** — Briefs y exportar
- **MeasurementsTab** — Antropometría

Todos comparten estado centralizado en `data` con `setData`.

### Extensiones futuras

Para agregar más funcionalidades:

1. **Backend**: Reemplaza `window.storage` con llamadas a API
2. **Autenticación**: Agrega Firebase o Auth0
3. **Social**: Comparte briefs con otros atletas
4. **Estadísticas**: Análisis más profundo con gráficos avanzados

---

## 🐛 Troubleshooting

### "No se guardan los datos"
- Abre DevTools (F12) → Application → localStorage
- Verifica que `gym-recomp-data-v2` exista
- Si no, intenta cargar un ejercicio y marcar una serie

### "El temporizador no suena"
- Verifica volumen del dispositivo
- Algunos navegadores requieren interacción previa
- Intenta en otro navegador

### "App lenta o congelada"
- Limpia localStorage: `localStorage.clear()`
- Recarga la página
- Verifica que no haya muchas semanas de registros

---

## 📝 Licencia

Este proyecto está bajo licencia **MIT**. Úsalo libremente, duplícalo, modifícalo.

---

## 👨‍💻 Autor

Desarrollado para **GACIF** (Gimnasio/CrossFit)  
Diseño corporativo integrado — Azul marino y plata

---

## 🤝 Contribuciones

Si encuentras bugs o tienes sugerencias:

1. Abre un **Issue** en GitHub
2. Fork el repo y envía un **Pull Request**
3. Contacta al maintainer

---

## 📞 Soporte

¿Preguntas o problemas?
- 📧 Abre un Issue en GitHub
- 💬 Contacta a tu coach en GACIF

---

## 🎯 Roadmap

- [ ] Integración con Apple Health / Google Fit
- [ ] Sincronización en la nube (Firebase)
- [ ] Notificaciones de recordatorio de entrenamientos
- [ ] Galería de vídeos de ejercicios
- [ ] Historial de chats con el coach
- [ ] Leaderboard con otros atletas
- [ ] PWA (instalable en home screen)

---

**¡Éxito en tu recomposición corporal! 💪**
