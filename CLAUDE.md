# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static single-page real estate listing website for an apartment rental in the Kuna building, San Antonio de Pereira (Rionegro, Colombia). The site is built with vanilla HTML, CSS, and JavaScript with no build process or dependencies.

## Project Structure

- **page1.html**: Single HTML file containing the entire website with embedded CSS and JavaScript
- **assets/**: Directory containing property photos and images
  - Hero images (`hero.jpeg`, `hero2.jpeg`)
  - Property photos (`foto1.jpeg`, `foto2_1.jpeg`, etc.)
  - Floor plans (`plano1.jpg`, `plano2.jpg`)
  - Original HEIC format images (source files)

## Development

### Running the site
Open `page1.html` directly in a web browser. No server or build process required.

```bash
open page1.html  # macOS
```

Or use a local development server for live reload:
```bash
python3 -m http.server 8000
# Then visit http://localhost:8000/page1.html
```

### Key Configuration

**WhatsApp Contact Number**: The WhatsApp contact number is configured in the JavaScript section at line 348. Update the `WHATSAPP_NUMBER` constant to set the contact number for all WhatsApp CTAs throughout the page.

## Architecture

The page follows a single-page design with:

1. **Sticky Navigation**: Links to different sections via anchor tags with animated underline on hover
2. **Hero Section**: Full-screen header with property highlight and primary CTA (no badges)
3. **Pricing Card Section**: Grid-based pricing display with 6 key features including price, specs, and rental info
4. **Content Sections**: Modular sections for property details, gallery, virtual tour, amenities, location, rental information, and contact
5. **Interactive Components**:
   - Tab system for gallery/floor plans (controlled by JavaScript)
   - Floating WhatsApp button with scroll-based size adjustment
   - Grid-based gallery with left-to-right ordering
6. **Embedded iframe**: Matterport 360° virtual tour

### Design System

CSS custom properties (lines 10-22) define the color palette and design tokens:
- Professional color scheme with teal accent (`--accent: #0ea5a6`)
- Component patterns: cards, badges, pills, grids
- Responsive breakpoints at 1000px and 700px (lines 104-114)

### JavaScript Functionality

All JavaScript is inline (lines 326-357):
- Tab switching for gallery views
- Scroll-based WhatsApp button resize
- Dynamic WhatsApp link generation with pre-filled messages

## Content Updates

To update property information:
- **Price/Details**: Modify the pricing-card section including price, specs grid (6 items with icons)
- **Features**: Update the features grid (12 items in 4-column layout with emoji icons)
- **Images**: Replace files in `assets/` and update `src` attributes in gallery section
- **Virtual Tour**: Replace Matterport embed URL
- **Location**: Update location-list items organized by category (Education, Shopping, Health, Recreation)
- **Gallery Layout**: Images display in left-to-right grid order (not columns)
