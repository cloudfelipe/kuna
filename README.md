# Kuna

Landing page estática para el apartamento en el edificio Kuna.

## Desarrollo local

```bash
npm install   # no hay dependencias, pero deja listo el script
npm run build # genera page1.html y page1.js a partir de las plantillas
open page1.html
```

Los archivos fuente son `page1.template.html` y `page1.template.js`. No edites los generados (`page1.html` / `page1.js`) porque se recrean en cada build.

El optimizador `optimize_images_macos.sh` acepta imágenes `jpg`, `jpeg`, `png`, `heic` y `heif`, y genera variantes `avif`, `webp` y `jpg` en `assets-optimized/`.

## Variables de entorno

Configura estas variables (por ejemplo en Netlify → Site settings → Environment) antes de desplegar:

| Variable          | Descripción                                     | Default           |
|-------------------|-------------------------------------------------|-------------------|
| `GA_ID`           | ID de Google Analytics 4 (formato `G-XXXXXX`)   | `G-XXXXXXXXXX`    |
| `FB_PIXEL_ID`     | ID del Meta Pixel (15-16 dígitos)               | `XXXXXXXXXXXXXXX` |
| `WHATSAPP_NUMBER` | Número para los CTA de WhatsApp (sin +)         | `57XXXXXXXXXX`    |
| `SITE_URL`        | URL canónica del landing                        | URL de Netlify    |
| `META_IMAGE`      | URL de imagen para OG tags                      | URL de Netlify    |
| `PRICE`           | Precio del arriendo (con o sin puntos)          | `4200000`         |
| `PRICE_TWO_PARKING` | Precio mostrado para la opción con 2 parqueaderos | valor de `PRICE` |
| `PRICE_ONE_PARKING` | Precio mostrado para la opción con 1 parqueadero | valor de `PRICE` |

**📄 Para más detalles sobre cada variable, consulta [ENV.md](ENV.md)**

Si no las defines se usarán los valores por defecto, útiles para desarrollo.

## Deploy en Netlify

El archivo `netlify.toml` ya indica el build command:

```
npm run build
```

Netlify ejecutará el script, generará los archivos reales con los IDs de entorno y publicará la raíz del repositorio. Asegúrate de configurar las variables anteriores en el dashboard del sitio antes de desplegar.
