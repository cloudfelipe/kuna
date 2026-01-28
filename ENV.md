# Variables de Entorno

Este proyecto utiliza variables de entorno para configurar valores dinámicos. Configúralas en Netlify (Site Settings → Environment Variables) o en un archivo `.env` local.

## Variables Disponibles

### Tracking y Analytics

#### `GA_ID` (opcional)
- **Descripción**: ID de Google Analytics 4
- **Formato**: `G-XXXXXXXXXX`
- **Default**: `G-XXXXXXXXXX`
- **Ejemplo**: `GA_ID=G-ABC123XYZ`

#### `FB_PIXEL_ID` (opcional)
- **Descripción**: ID del Meta/Facebook Pixel para tracking de conversiones
- **Formato**: Número de 15-16 dígitos
- **Default**: `XXXXXXXXXXXXXXX`
- **Ejemplo**: `FB_PIXEL_ID=123456789012345`

### Contacto

#### `WHATSAPP_NUMBER` (opcional)
- **Descripción**: Número de WhatsApp para CTAs (incluir código de país)
- **Formato**: `57XXXXXXXXXX` (sin espacios, sin +)
- **Default**: `57XXXXXXXXXX`
- **Ejemplo**: `WHATSAPP_NUMBER=573001234567`

### SEO y Metadata

#### `SITE_URL` (opcional)
- **Descripción**: URL canónica del sitio
- **Default**: `https://apartamentoenkuna.netlify.app/page1.html`
- **Ejemplo**: `SITE_URL=https://tudominio.com`

#### `META_IMAGE` (opcional)
- **Descripción**: URL de la imagen para OG tags y Twitter cards
- **Default**: `https://apartamentoenkuna.netlify.app/assets-optimized/hero2-1920.jpg`
- **Ejemplo**: `META_IMAGE=https://tudominio.com/imagen.jpg`

### Contenido

#### `PRICE` (opcional)
- **Descripción**: Precio del arriendo (se usa en display y tracking de conversiones)
- **Formato**: Número con o sin puntos (se limpia automáticamente)
- **Default**: `4200000`
- **Ejemplos válidos**: 
  - `PRICE=4200000`
  - `PRICE=4.200.000`
  - `PRICE=5000000`

**Nota**: El precio se usa en:
- Display HTML como `$4.200.000` (formateado automáticamente)
- Eventos de Meta Pixel como `4200000` (número sin formato)
- Eventos de Google Analytics como `4200000` (número sin formato)

## Configuración en Netlify

1. Ve a: **Site Settings → Environment Variables**
2. Agrega cada variable con su valor
3. Haz un nuevo deploy o trigger un rebuild

## Configuración Local

Crea un archivo `.env` en la raíz del proyecto:

```bash
# .env
GA_ID=G-ABC123XYZ
FB_PIXEL_ID=123456789012345
WHATSAPP_NUMBER=573001234567
SITE_URL=https://apartamentoenkuna.netlify.app/page1.html
META_IMAGE=https://apartamentoenkuna.netlify.app/assets-optimized/hero2-1920.jpg
PRICE=4200000
```

Luego ejecuta:

```bash
npm run build
```

**Importante**: El archivo `.env` está en `.gitignore` y NO debe commitearse al repositorio.

## Build Process

El archivo `build.js` lee estas variables y las inyecta en los templates:
- `page1.template.html` → `page-es.html`, `page-en.html`, `index.html`
- `page1.template.js` → `page-es.js`, `page-en.js`

Los tokens se reemplazan con el formato `{{NOMBRE_VARIABLE}}`.
