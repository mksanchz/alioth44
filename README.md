# Logia Alioth No. 44 — Sitio Web

Sitio web oficial de la Logia Masónica **Alioth No. 44**, perteneciente a la
**Muy Respetable Gran Logia del Estado de México**.

## Estructura de Archivos

```
alioth44/
├── index.html          ← Página principal (single-page)
├── css/
│   └── styles.css      ← Estilos (variables, layout, responsive)
├── js/
│   └── main.js         ← JavaScript (navbar, lightbox, form, animaciones)
├── img/
│   ├── placeholder-logo.svg     ← SVG de referencia
│   ├── logo-alioth.png          ← [INSERTAR] Logo Logia Alioth No. 44
│   ├── logo-gran-logia.png      ← [INSERTAR] Logo Gran Logia E.M.
│   └── galeria/
│       ├── foto-1.jpg           ← [INSERTAR] Fotos de la galería
│       └── ...
└── README.md
```

## Personalización

### 1. Logos
Reemplaza los placeholders en `index.html`:
```html
<!-- Busca las clases: logo-alioth y logo-gran-logia -->
<!-- Sustituye el <div class="logo-placeholder ..."> por: -->
<img src="img/logo-alioth.png" alt="Logo Logia Alioth No. 44" width="70" height="70">
<img src="img/logo-gran-logia.png" alt="Logo Gran Logia del Estado de México" width="70" height="70">
```

### 2. Cuadro Logial
En la sección `#cuadro`, reemplaza `[Nombre del Hermano]` con los nombres reales
y sustituye los SVG placeholder de fotos por etiquetas `<img>`:
```html
<!-- Dentro de .officer-photo-placeholder, reemplaza el SVG por: -->
<img src="img/hermano-nombre.jpg" alt="H∴ Nombre Apellido">
```

### 3. Galería de Fotos
En la sección `#galeria`, reemplaza cada `.gallery-placeholder` con:
```html
<img src="img/galeria/foto-1.jpg" alt="Descripción">
```
En `js/main.js`, descomenta la sección de imágenes reales en el lightbox.

### 4. Formulario de Contacto
Para activar el envío con **Formspree**:
1. Regístrate en [formspree.io](https://formspree.io)
2. Crea un nuevo formulario y copia el ID
3. En `index.html`, cambia el atributo del form:
   ```html
   action="https://formspree.io/f/TU_ID_AQUI"
   ```
4. En `js/main.js`, descomenta el bloque `fetch` con la URL de Formspree

### 5. Textos e Información
Busca y reemplaza todos los `[placeholder]` en `index.html`:
- `[Año de Fundación]` → año real
- `[Nombre del Hermano]` → nombres reales de oficiales
- `[AAAA]` → año del cuadro logial
- `[Dirección del Templo...]` → dirección real
- `[Día y hora de las tenidas...]` → horario real
- `[correo@logialioth44.org]` → correo real

## Paleta de Colores
| Variable       | Valor     | Uso                  |
|----------------|-----------|----------------------|
| `--black`      | `#0a0a0a` | Fondo principal      |
| `--dark-red`   | `#8b0000` | Acento, botones      |
| `--gold`       | `#c9a84c` | Dorado, títulos      |
| `--white`      | `#f5f0e8` | Texto claro          |

## Tecnologías
- HTML5 semántico
- CSS3 (Grid + Flexbox, sin Bootstrap)
- JavaScript vanilla (ES6+)
- Google Fonts: Cinzel + Lato
- Sin dependencias externas ni frameworks
