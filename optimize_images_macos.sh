#!/usr/bin/env bash
# Image optimization helper for macOS (also works on Linux)
# - Resizes images for hero and gallery
# - Outputs AVIF and WebP variants
# - Strips EXIF and auto-orients
# Usage:
#   chmod +x optimize_images_macos.sh
#   ./optimize_images_macos.sh ./assets
# Optional env vars:
#   QUALITY_WEBP=80 QUALITY_JPG=82 QUALITY_AVIF=50 AVIF_SPEED=6
#   HERO_SIZES="1920 1280 768" GALLERY_SIZES="1080 720 480"

set -euo pipefail

# ---- Config (override via env) ----
QUALITY_WEBP="${QUALITY_WEBP:-80}"
QUALITY_JPG="${QUALITY_JPG:-82}"
QUALITY_AVIF="${QUALITY_AVIF:-50}"
AVIF_SPEED="${AVIF_SPEED:-6}"
HERO_SIZES="${HERO_SIZES:-1920 1280 768}"
GALLERY_SIZES="${GALLERY_SIZES:-1080 720 480}"

SRC_DIR="${1:-assets}"
OUT_DIR="${2:-assets-optimized}"

# ---- Dependency checks ----
need() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "ERROR: '$1' no encontrado." >&2
    echo "Instalación sugerida (Homebrew):" >&2
    case "$1" in
      magick|convert)
        echo "  brew install imagemagick" >&2;;
      avifenc)
        echo "  brew install libavif" >&2;;
      cwebp)
        echo "  brew install webp" >&2;;
      *)
        echo "  brew install $1" >&2;;
    esac
    exit 1
  }
}

# Prefer 'magick' (IM7). Fallback to 'convert' (IM6).
if command -v magick >/dev/null 2>&1; then
  IM="magick"
elif command -v convert >/dev/null 2>&1; then
  IM="convert"
else
  need magick
fi
need avifenc
need cwebp

if [[ ! -d "$SRC_DIR" ]]; then
  echo "Directorio de entrada no existe: $SRC_DIR" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

# Decide sizes by filename hint (hero vs gallery/others)
sizes_for() {
  local path="$1"
  local name="$(basename "$path")"
  shopt -s nocasematch || true
  if [[ "$name" =~ hero ]]; then
    echo "$HERO_SIZES"
  else
    echo "$GALLERY_SIZES"
  fi
  shopt -u nocasematch || true
}

# Normalize extension to lowercase (for checks)
lower_ext() {
  local f="$1"
  echo "${f##*.}" | tr '[:upper:]' '[:lower:]'
}

count_total=0
count_done=0

# Find images recursively (jpg/jpeg/png/heic/heif)
# macOS 'find' supports -print0; use it to handle spaces
while IFS= read -r -d '' f; do
  ext="$(lower_ext "$f")"
  rel="${f#"$SRC_DIR"/}"                         # relative path from SRC_DIR
  base="${rel%.*}"                              # without extension
  out_base_dir="$OUT_DIR/$(dirname "$rel")"
  mkdir -p "$out_base_dir"

  sizes=$(sizes_for "$f")
  for w in $sizes; do
    # Create a temp JPEG resized to pass to encoders.
    # HEIC/HEIF are converted first with heif-convert for better macOS compatibility.
    tmpbase="$(mktemp -t optimg)"
    tmp_jpg="${tmpbase}.jpg"
    if [[ "$ext" == "heic" || "$ext" == "heif" ]]; then
      need heif-convert
      tmp_source="${tmpbase}-source.jpg"
      heif-convert "$f" "$tmp_source" >/dev/null 2>&1
      "$IM" "$tmp_source" -auto-orient -strip -resize "${w}x" -quality "$QUALITY_JPG" "$tmp_jpg"
      rm -f "$tmp_source"
    else
      "$IM" "$f" -auto-orient -strip -resize "${w}x" -quality "$QUALITY_JPG" "$tmp_jpg"
    fi

    # Derive output filenames
    out_avif="$out_base_dir/$(basename "${base}")-${w}.avif"
    out_webp="$out_base_dir/$(basename "${base}")-${w}.webp"
    out_jpg="$out_base_dir/$(basename "${base}")-${w}.jpg"

    # Encode AVIF
    avifenc -q "$QUALITY_AVIF" -s "$AVIF_SPEED" "$tmp_jpg" "$out_avif" >/dev/null
    # Encode WebP
    cwebp -quiet -q "$QUALITY_WEBP" "$tmp_jpg" -o "$out_webp" >/dev/null
    # Save optimized JPEG (fallback legacy)
    mv "$tmp_jpg" "$out_jpg"

    echo "✓ ${rel}  =>  $(basename "${base}")-${w}.{avif,webp,jpg}"
    ((count_done++)) || true
  done

  ((count_total++)) || true
done < <(find "$SRC_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.heic" -o -iname "*.heif" \) -print0)

echo
echo "Listo. Imágenes procesadas: $count_total"
echo "Salida en: $OUT_DIR"
echo "Consejo: usa <picture> con .avif + .webp + .jpg y 'srcset/sizes'."
