# GACIF Entrenamiento App

Aplicación de registro de entrenamiento para recomposición corporal con seguimiento antropométrico.

## 🚀 Quick Start

### Opción 1: Ejecutar localmente

```bash
# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev

# Compilar para producción
npm run build
```

### Opción 2: Deploy en Vercel (recomendado)

1. Sube este repo a GitHub
2. Ve a https://vercel.com
3. Conecta tu repo de GitHub
4. Vercel detectará Vite automáticamente
5. Deploy listo 🎉

## 📱 Características

- ✅ Registro de entrenamientos en tiempo real
- ✅ Temporizador de 2 minutos (descanso entre series)
- ✅ Seguimiento antropométrico (peso, grasa, músculo)
- ✅ Brief semanal para compartir con coach
- ✅ RPE (Rate of Perceived Exertion) por ejercicio
- ✅ Datos almacenados localmente (sin servidor)
- ✅ Exportar historial en JSON

## 🎨 Diseño GACIF

Paleta corporativa:
- Azul marino oscuro: `#0A1E35`
- Plata: `#C0C0C0`
- Blanco: `#FFFFFF`

## 📁 Estructura

```
gacif-app-completa/
├── src/
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos GACIF
├── index.html           # HTML raíz
├── package.json         # Dependencias
├── vite.config.js       # Config Vite
├── vercel.json          # Config Vercel
└── .gitignore           # Archivos ignorados
```

## 🔧 Dependencias principales

- **React 18** - Framework UI
- **Vite 5** - Build tool
- **Recharts** - Gráficos de línea

## 📊 Storage

Datos guardados en `localStorage` bajo la clave `gym-recomp-data-v2` con debounce de 700ms.

## 📝 Notas

- Compatible con celular (responsive)
- Funciona offline después del primer acceso
- Datos persisten entre sesiones
- Sin servidor, 100% cliente-side

---

Creado para Cristián Vidal Tardón | GACIF 💪
