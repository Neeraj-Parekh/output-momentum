# Portfolio Website - Modular Architecture

## 📁 File Structure

```
project_portfolio_collection/
├── index.html              # Main portfolio (loads modules)
├── data.js                 # All data + ratings manager
├── styles.css              # All CSS (extracted)
├── app.js                  # Core application logic
├── ratings-cms.html        # ⚙️ Internal ratings manager (separate page)
└── online_viewer_net(9).html  # Original monolithic version (backup)
```

## 🎯 What Changed

### **Before**: Single 1000+ line HTML file with embedded CSS/JS
### **After**: 5 clean, modular files with separation of concerns

---

## 📋 File Descriptions

### **index.html**
- **Purpose**: Minimal HTML structure, loads all modules
- **Size**: ~50 lines
- **Loads**: `data.js` → `app.js`
- **Features**: Tailwind CDN, fonts, theme script

### **data.js**
- **Purpose**: All static data (profiles, projects, definitions, tooltips)
- **Managers**:
  - **RatingsManager**: Internal project ratings system
    - `setRating(projectId, company, rating, skills, notes)` — Save rating
    - `getRating(projectId, company)` — Get rating
    - `getRankedProjects(company)` — Get projects sorted by rating
    - `deleteRating(projectId, company)` — Clear rating
    - Auto-saves to `localStorage` key `portfolio_ratings`
  - **ImageGalleryManager**: Project image gallery system
    - `addImage(projectId, imageUrl, caption)` — Add image with metadata
    - `removeImage(projectId, index)` — Delete image by index
    - `getImages(projectId)` — Retrieve all project images
    - `setGalleryMode(projectId, mode)` — Set display mode (carousel/grid/collage)
    - Auto-saves to `localStorage` key `portfolio_images`

### **styles.css**
- **Purpose**: All styling extracted from original `<style>` block + gallery styles
- **Size**: ~500 lines (added gallery CSS)
- **New Classes**: 
  - `.project-header` — Clickable project title with collapse toggle
  - `.project-content` — Collapsible content area
  - `.project-collapse-toggle` — Arrow indicator (rotates on collapse)
  - **Gallery Styles**:
    - `.gallery-carousel` — Carousel container with fade transitions
    - `.carousel-slide`, `.carousel-nav`, `.carousel-dot` — Carousel elements
    - `.gallery-grid` → `.grid-item` — Responsive grid layout
    - `.gallery-collage` → `.collage-item` — Masonry collage layout
    - Image hover effects, captions, transitions across all modes

### **app.js**
- **Purpose**: All application logic, rendering, event handlers
- **Size**: ~1000 lines (added gallery rendering)
- **Key Functions**:
  - `buildPage()` — Main render function
  - `getOrderedProjects()` — Returns projects in ranked/default order
  - `toggleProjectCollapse(projId)` — Collapse/expand project
  - `showRatingsCMS()` — Open ratings manager modal
  - `showTermModal()` / `showCLDialog()` — Educational modals
  - **Gallery Functions**:
    - `buildCarouselGallery(images, projId, theme)` — Render carousel with navigation
    - `buildGridGallery(images, theme)` — Render responsive grid layout
    - `buildCollageGallery(images, theme)` — Render masonry collage layout
    - `carouselPrev()`, `carouselNext()`, `carouselGoto()` — Carousel controls
    - `buildProjectGallery(proj, theme)` — Route to appropriate gallery mode

### **ratings-cms.html**
- **Purpose**: Standalone page for rating projects internally and managing images
- **Features**:
  - ⭐ Star rating (1-5) per project
  - 🔢 Ranking priority (numeric ordering)
  - 🏷️ Skills tags (comma-separated)
  - 📝 Notes field for context
  - 💾 Auto-saves all ratings to localStorage
  - 📋 Export button to copy rating details
  - 📸 Gallery Management Section:
    - Add images via URL + caption
    - Remove images individually
    - Select gallery mode (Carousel/Grid/Collage)
    - View all project images with live preview
  - 🔙 Back link to main portfolio

---

## ✨ New Features

### **1. Project Collapse/Expand**
- Click any project title to collapse/expand all content
- State persists in `localStorage` (`portfolio_collapsed`)
- Smooth CSS transitions with `.project-content` animation

### **2. Internal Ratings System**
- **Access**: Click ⚙️ button in header → Opens ratings modal
- **Or**: Open `ratings-cms.html` directly in new tab
- **Data Storage**: Browser `localStorage` key: `portfolio_ratings`
- **Company-Specific**: Rate projects for "CopperCloud", "Company2", etc.

### **3. Dynamic Project Ordering**
- If ratings exist for a company, projects sort by rating (highest first)
- Unrated projects appear at bottom in default order
- Chronological order maintained by default if no ratings

### **4. Design Consistency**
- ✅ Same dark/light theme as original
- ✅ Same amber accent color (#b45309)
- ✅ Same animations (pulse, glow, reveal)
- ✅ Same responsive layout (Tailwind grid)

### **5. Image Gallery System**
- **Three Display Modes**:
  - 🎠 **Carousel**: Slide-based navigation with prev/next buttons and indicator dots
  - 📊 **Grid**: Responsive multi-column layout with uniform sizing
  - 🎨 **Collage**: Masonry-style grid with varying image sizes
- **Image Management**:
  - Add images via URL + optional caption
  - Remove images individually
  - Switch gallery mode per project
  ### **ratings-cms.html**
  - **Purpose**: Standalone internal scoring screen for company-specific ranking
  - **Features**:
    - ⭐ Star rating (1-5) per project
    - 🔢 Numeric ranking that controls main-site order
    - 📝 Notes field for internal context
    - 💾 Auto-saves to browser `localStorage`
    - 📋 Copy JSON summary for reference
    - 🔙 Back link to the public portfolio
# Open in browser
  ### **1. Project Collapse/Expand**
  - Click any project title to collapse/expand all content
  - State persists in `localStorage` (`portfolio_collapsed`)
  - Smooth CSS transitions with `.project-content` animation
# Then visit http://localhost:8000
  ### **2. Internal Ratings System**
  - **Access**: Click the settings button in the main header or open `ratings-cms.html`
  - **Data Storage**: Browser `localStorage` key: `portfolio_ratings`
  - **Company-Specific**: Score projects separately for CopperCloud or any other company name
**Option B**: Open directly
  ### **3. Dynamic Project Ordering**
  - The public portfolio stays chronological by default
  - Once you assign internal rankings, the public order follows the numeric rank
  - Higher-priority projects use lower rank numbers

  ### **5. Collapsed Project State**
  - Project collapse state is preserved in the browser
  - Reopening the site keeps any cards you collapsed closed
3. Paste image URL + optional caption
4. Click "Add" button
5. Images appear in project card gallery automatically
6. Choose gallery mode: Carousel (default), Grid, or Collage
7. View in index.html → galleries display in selected mode

### **Gallery Navigation**
- **Carousel**: Click ❮ / ❯ buttons or dots to navigate
  ### **Run the Main Portfolio**
  ```bash
  python -m http.server 8000
  ```

  Then open `http://localhost:8000/index.html`.
- **Grid**: Scroll if many images; hover to see captions
- **Collage**: Hover over images to reveal captions; masonry layout auto-arranges

### **Remove Images**
1. ratings-cms.html → project gallery section
2. Click × next to image
  ### **Access Ratings Manager**
  Open `http://localhost:8000/ratings-cms.html` directly, or click the settings button on the main site.
3. Confirm removal
4. Gallery updates automatically

  ### **See Results**
  1. Return to `index.html`
  2. Projects now display in the order dictated by your numeric rankings
---

## 💾 Data Persistence

All data stored in browser `localStorage`:

### **Ratings** 
- **Key**: `portfolio_ratings`
- **Format**: JSON object mapping `projectId → company → { rating, ranking, skills, notes }`
- **Key**: `portfolio_collapsed`
- **Format**: JSON object `{ projectId: boolean }` (true = collapsed)
- **Updated by**: `toggleProjectCollapse()` function

### **Gallery Images**
  ### **Use the Ratings Screen**
  1. Open `ratings-cms.html`
  2. Enter the company name you want to score for
  3. Set star ratings for each project
  4. Assign numeric ranks to control ordering on the main site
  5. Add notes if needed
  6. Return to `index.html` to see the updated order
- **Key**: `portfolio_images`
### **Export All Data**
  ### **Export All Data**
```javascript
// In browser console - get all stored data:
{
  ratings: JSON.parse(localStorage.getItem('portfolio_ratings')),
  collapsed: JSON.parse(localStorage.getItem('portfolio_collapsed')),
    company: localStorage.getItem('portfolio_active_company')
}
```

### **Import Data**
```javascript
// Restore from backup (replace with actual data):
localStorage.setItem('portfolio_ratings', '{"edge-cl":{"CopperCloud":{"rating":5,...}}}')
localStorage.setItem('portfolio_images', '{"edge-cl":[{"url":"https://...","caption":"Demo"}]}')
```

### **Clear All Data**
```javascript
localStorage.removeItem('portfolio_ratings');
localStorage.removeItem('portfolio_collapsed');
localStorage.removeItem('portfolio_images');
```

---

## 🔧 Maintenance & Customization

### **Add New Project**
1. Add to `PROJECTS` array in `data.js`
2. Include all fields: `id`, `title`, `status`, `relevance`, `arch`, `metrics`, `tags`, `code`, `walk`
3. Will automatically appear in ratings manager

### **Add New Tooltip**
1. Add to `TOOLTIPS` object in `data.js`
2. Auto-highlighted in code blocks

### **Modify Theme Colors**
- Primary accent: `#b45309` (amber)
- Dark mode bg: `#0c0a09`
- Light mode bg: `#FAF9F6`
- Found in `app.js` `buildPage()` function

### **Change Company Name**
```javascript
// In app.js, line ~20:
state.currentCompany = 'YourCompany';
// Or set dynamically when opening CMS
```

---

## 🎨 CSS Customization

### **Collapse Animation Speed**
Edit in `styles.css`:
```css
.project-content {
    transition: max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1), /* Change 0.4s */
                opacity 0.3s ease;
}
```

### **Add Custom Styling**
- Global styles: Modify `styles.css`
- Tailwind utilities: Already configured in `index.html`
- Inline: Dynamic colors passed through `buildPage()` color vars

---

## 📊 File Size Impact

| File | Lines | Size | Purpose |
|------|-------|------|---------|
| Original HTML | 1400+ | ~60KB | Monolithic |
| **index.html** | 45 | ~2KB | Structure |
| **data.js** | 550 | ~25KB | Data |
| **styles.css** | 400 | ~18KB | Styling |
| **app.js** | 900 | ~40KB | Logic |
| **ratings-cms.html** | 350 | ~15KB | Ratings UI |
| **TOTAL** | 2245 | ~100KB | Modular |

*No size penalty — added features are worth the extra 40KB*

---

## 🐛 Troubleshooting

### **Projects not showing in rated order**
- Check `ratings-cms.html` — ratings may not be saved
- Open browser DevTools → Application → localStorage → `portfolio_ratings`
- Verify JSON format

### **Collapse state not persisting**
- Check localStorage → `portfolio_collapsed`
- Browser privacy settings may disable localStorage

### **Ratings modal not opening**
- Check console for JS errors
- Verify `data.js` and `app.js` loaded (Network tab)

### **Styles look broken**
- Clear browser cache
- Verify `styles.css` is loading (Network tab)
- Check Tailwind CDN is accessible

---

## 🔗 Quick Links

- **Main Portfolio**: `index.html`
- **Rating Manager**: `ratings-cms.html`
- **Data Source**: `data.js`
- **App Logic**: `app.js`
- **Styles**: `styles.css`

---

## 📝 Notes

- **Backward Compat**: Original `online_viewer_net(9).html` still available for reference
- **Mobile Responsive**: All layouts work on mobile/tablet via Tailwind
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Performance**: Minimal JS, no heavy libraries (pure vanilla JS + Tailwind)

---

**Last Updated**: May 2026  
**Portfolio Subject**: Neeraj Ganesh Parekh - Embedded Systems Engineer  
**Target Company**: CopperCloud IOTech
