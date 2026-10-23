# ConSentido · web

Sitio estático (HTML + CSS + JS, sin dependencias). Estructura y UX inspiradas en platzi.com; identidad de ConSentido (Fraunces + Plus Jakarta Sans, naranja, azul marino, mostaza y crema).

## Cómo verlo

```bash
cd consentido-web && python3 -m http.server 5178
```

Abre http://localhost:5178.

## Páginas

| Ruta | Archivo | Para quién |
| --- | --- | --- |
| `/` | `index.html` | Home con las dos puertas |
| `/para-ti/` | `para-ti/index.html` | Personas: sede digital personal, formación, 1:1 |
| `/para-equipos/` | `para-equipos/index.html` | Organizaciones. Sigue la estructura de platzi.com/business: portada con formulario, sectores y datos, "¿Has dicho alguna de estas frases?", un método con cuatro formas, Procesos/Cultura, resultados y FAQ |

Las tres comparten `styles.css` y `app.js`. Un enlace a `para-equipos/#procesos` o `#cultura` abre esa metodología desplegada. Para publicarlo, sube la carpeta tal cual a Netlify, Vercel, GitHub Pages o tu hosting.

## Secciones (equivalencia con Platzi)

| Platzi | ConSentido |
| --- | --- |
| Buscador en el menú | "¿Qué quieres ordenar hoy?" (atajo `/`) |
| Hero con tarjetas de cursos flotando | Hero con tarjetas de la oferta (1:1, sede digital, diagnóstico, newsletter) |
| Historias de éxito en carrusel | Historias con sentido (marquee) |
| Showcase con scroll fijo (Adaptable · Simple · Interactivo) | Tres escalas con scroll fijo: para ti, tu equipo, tu organización; la maqueta de sede digital cambia en cada una |
| Elige qué aprender hoy | Elige qué quieres ordenar hoy |
| Rutas | El Método ConSentido (6 pasos interactivos) |
| Planes Personas / Empresas | Para ti / Para tu equipo, con tabla comparativa |
| Comunidad | Clase abierta, microclases, comunidad |
| Metas flotando | Convierte lo que quieres en lo que haces |
| Botón flotante de WhatsApp | Botón flotante de contacto |

## Pendientes antes de publicar

- [ ] Reemplazar las 6 historias de ejemplo por casos reales con permiso (`index.html`, sección HISTORIAS).
- [ ] Confirmar precios: plantillas desde $50.000, curso desde $300.000, 1:1 desde $1.200.000.
- [ ] Correo real (hoy `hola@consentido.lat`), LinkedIn e Instagram en el footer.
- [ ] Número de WhatsApp en el botón flotante (`href="https://wa.me/57XXXXXXXXXX"`).
- [ ] Conectar el formulario (newsletter, Notion, Make o n8n) en `app.js`, bloque "PENDIENTE".
- [ ] Logos de Notion Certified Consultants y ACMP, con permiso.
- [ ] Crear el autodiagnóstico gratis que promete el hero.
- [ ] Para equipos: reemplazar los sectores, citas y métricas de ejemplo ("— h", "— %") por casos reales con permiso.
- [ ] Para equipos: tener al menos un mini-caso para la sección "Confían en ConSentido" y confirmar el precio del diagnóstico.
- [ ] Para ti: publicar al menos 4 entregas de la newsletter antes de prometerla como "activa".
