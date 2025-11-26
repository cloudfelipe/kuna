# Kuna

Landing page estática para el apartamento en el edificio Kuna.

## Desarrollo local

```bash
npm install   # no hay dependencias, pero deja listo el script
npm run build # genera page1.html y page1.js a partir de las plantillas
open page1.html
```

Los archivos fuente son `page1.template.html` y `page1.template.js`. No edites los generados (`page1.html` / `page1.js`) porque se recrean en cada build.

## Variables de entorno

Configura estas variables (por ejemplo en Netlify → Site settings → Environment) antes de desplegar:

| Variable          | Descripción                                     |
|-------------------|-------------------------------------------------|
| `GA_ID`           | ID de Google Analytics 4 (formato `G-XXXXXX`)   |
| `FB_PIXEL_ID`     | ID del Meta Pixel                               |
| `WHATSAPP_NUMBER` | Número para los CTA de WhatsApp (sin +)         |
| `SITE_URL`        | URL canonica del landing (ej. `https://...`)    |

Si no las defines se usarán los marcadores `G-XXXXXXXXXX`, etc., solo útiles para desarrollo.

## Deploy en Netlify

El archivo `netlify.toml` ya indica el build command:

```
npm run build
```

Netlify ejecutará el script, generará los archivos reales con los IDs de entorno y publicará la raíz del repositorio. Asegúrate de configurar las variables anteriores en el dashboard del sitio antes de desplegar.
