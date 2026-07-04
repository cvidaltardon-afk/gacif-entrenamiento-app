# ⚡ Guía rápida - 5 minutos

Cómo empezar lo antes posible.

---

## 🎯 Inicio en 5 pasos

### 1. Descargar Node.js
[nodejs.org](https://nodejs.org) → Download LTS

Instala normalmente.

### 2. Descargar el código
```bash
git clone https://github.com/tu-usuario/gacif-entrenamiento-app.git
cd gacif-entrenamiento-app
```

O descarga ZIP desde GitHub y extrae.

### 3. Instalar y correr
```bash
npm install
npm run dev
```

### 4. Abre en navegador
```
http://localhost:3000
```

### 5. ¡Listo!
Prueba registrar un ejercicio. Los datos se guardan automáticamente. 🎉

---

## 📤 Deployar (2 min)

### Opción A: Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

Sigue el wizard. ¡Listo en 2 minutos!

### Opción B: GitHub Pages
```bash
git push origin main
```

GitHub Actions construye y deploya automáticamente. Mira en Actions tab.

---

## 🔧 Cambios comunes

### Cambiar colores GACIF
En `src/index.css`, modifica variables CSS:
```css
:root {
  --gacif-bg: #0A1E35;      /* Azul principal */
  --gacif-plata: #C0C0C0;   /* Acentos */
}
```

### Agregar nuevo día/ejercicio
El editor está en Pestaña **Rutina**. Puedes agregar días y ejercicios desde la UI.

### Cambiar nombre de app
En `index.html`:
```html
<title>Mi App de Entrenamiento</title>
```

### Desactivar temporizador
En `src/App.jsx`, comenta la línea:
```javascript
// try { new Audio(...).play().catch(()=>{}); } catch(e) {}
```

---

## 📱 Responsive
Abre DevTools (F12) → Mobile view para probar en phone.

---

## 🐛 Si algo falla

```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

Si sigue fallando:
- Lee README.md
- Abre Issue en GitHub
- Verifica que Node v16+ está instalado: `node --version`

---

## 📚 Documentos importantes

- **README.md** — Descripción completa
- **SETUP.md** — Instalación detallada + GitHub
- **DEPLOYMENT.md** — Hosting (Vercel, Netlify, etc)
- **CONTRIBUTING.md** — Cómo contribuir

---

## ✅ Checklist

- [ ] Node.js instalado
- [ ] Código descargado
- [ ] `npm install` completado
- [ ] `npm run dev` corriendo
- [ ] http://localhost:3000 abierto
- [ ] Registra un ejercicio (debería guardarse)

---

## 🚀 Siguiente

Ahora elige:

1. **Deployar a producción** → DEPLOYMENT.md
2. **Hacer cambios en el código** → Lee src/App.jsx
3. **Contribuir mejoras** → CONTRIBUTING.md
4. **Configurar dominio personalizado** → DEPLOYMENT.md sección "Dominio personalizado"

---

## 💡 Consejos

- Usa Chrome DevTools (F12) para debuggear
- localStorage en Application tab para ver datos guardados
- `npm run build` genera `dist/` listo para producción
- Los datos se guardan en el navegador, **no en servidor**

---

## 🆘 Ayuda rápida

| Problema | Solución |
|----------|----------|
| "npm: command not found" | Instala Node.js |
| "Port 3000 in use" | `npm run dev -- --port 3001` |
| "Can't find module" | `npm install` |
| "Blank page" | F12 → Console, busca errores rojos |
| "Datos no se guardan" | F12 → Application → localStorage |

---

**¡A entrenar! 💪**
