# Contributing to CPTTM Event Platform

Thank you for your interest in contributing to the CPTTM Event Registration Platform! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+)
- Text editor or IDE (VS Code, Sublime Text, etc.)
- Basic knowledge of HTML, CSS, and JavaScript
- Git for version control

### Setup
1. Clone the repository
2. Open `index.html` in your browser to test
3. Or run a local server: `python3 -m http.server 8080`

## Project Structure

```
/
├── index.html          # Main HTML structure
├── styles.css          # All styling (1 file, ~600 lines)
├── app.js              # Main application logic
├── i18n.js             # Internationalization system
├── events-data.js      # Event data and filtering
├── assets/             # Images and graphics
│   └── logo.svg
├── favicon.svg         # Website favicon
├── README.md           # Main documentation
├── DEMO.md             # Demo and usage guide
└── CONTRIBUTING.md     # This file
```

## Code Style Guidelines

### HTML
- Use semantic HTML5 elements
- Include ARIA labels for accessibility
- Use data attributes for i18n: `data-i18n="key.path"`
- Maintain proper indentation (4 spaces)
- Close all tags properly

**Example:**
```html
<button class="btn" data-i18n="button.submit" aria-label="Submit form">
    Submit
</button>
```

### CSS
- Use CSS custom properties for colors and common values
- Follow BEM-like naming convention
- Group related styles together
- Use meaningful class names
- Support responsive design (mobile-first)

**Example:**
```css
.event-card {
    background-color: var(--white);
    border-radius: 10px;
    box-shadow: var(--shadow);
}

.event-card__title {
    font-size: 20px;
    color: var(--text-dark);
}

.event-card--featured {
    border: 2px solid var(--primary-color);
}
```

### JavaScript
- Use ES6+ features (arrow functions, const/let, template literals)
- Write descriptive function names
- Add comments for complex logic
- Avoid global variables (use IIFE or modules)
- Handle errors gracefully

**Example:**
```javascript
function filterEvents() {
    filteredEvents = eventsData.filter(event => {
        const matchesCategory = currentFilters.category === 'all' || 
                               event.category === currentFilters.category;
        return matchesCategory;
    });
    renderEvents();
}
```

## Adding New Features

### Adding a New Language

1. **Update i18n.js:**
```javascript
const translations = {
    en: { /* existing */ },
    zh: { /* existing */ },
    pt: { /* existing */ },
    es: { // New Spanish translation
        nav: {
            home: "Inicio",
            events: "Eventos",
            // ... more translations
        }
    }
};
```

2. **Add language button in index.html:**
```html
<button class="lang-btn" data-lang="es">ES</button>
```

3. **Test all pages and features in the new language**

### Adding New Events

Edit `events-data.js`:

```javascript
const eventsData = [
    // existing events...
    {
        id: 13,
        title: {
            en: "New Event Title",
            zh: "新活動標題",
            pt: "Novo Título do Evento"
        },
        description: {
            en: "Event description...",
            zh: "活動描述...",
            pt: "Descrição do evento..."
        },
        category: "it", // or "fashion", "language", "management"
        type: "course", // or "seminar", "competition", "exam"
        date: "2025-01-30",
        time: "14:00-17:00",
        duration: "3 hours",
        location: {
            en: "Location name",
            zh: "地點名稱",
            pt: "Nome do local"
        },
        instructor: {
            en: "Instructor Name",
            zh: "講師名稱",
            pt: "Nome do Instrutor"
        },
        fee: "MOP 500",
        totalSeats: 30,
        availableSeats: 30,
        language: {
            en: "English",
            zh: "英語",
            pt: "Inglês"
        }
    }
];
```

### Adding a New Category

1. **Add category icon and card in index.html:**
```html
<div class="category-card" data-category="newcat">
    <div class="category-icon">
        <i class="fas fa-icon-name"></i>
    </div>
    <h3 data-i18n="categories.newcat.title">Category Title</h3>
    <p data-i18n="categories.newcat.desc">Category description</p>
    <button class="category-btn" data-i18n="categories.viewMore">View Courses</button>
</div>
```

2. **Add translations in i18n.js:**
```javascript
categories: {
    // existing categories...
    newcat: {
        title: "New Category",
        desc: "Category description"
    }
}
```

3. **Add category to filter in index.html:**
```html
<option value="newcat" data-i18n="categories.newcat.title">New Category</option>
```

4. **Add icon mapping in events-data.js:**
```javascript
const iconMap = {
    it: 'fa-laptop-code',
    fashion: 'fa-palette',
    language: 'fa-language',
    management: 'fa-briefcase',
    newcat: 'fa-new-icon' // Add your Font Awesome icon
};
```

## Testing Guidelines

### Manual Testing Checklist

- [ ] Test in Chrome, Firefox, Safari, and Edge
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test all language versions (EN, ZH, PT)
- [ ] Test all filters (category, type, date range)
- [ ] Test search functionality
- [ ] Test event detail modals
- [ ] Test login modal
- [ ] Test pagination
- [ ] Test browser back/forward buttons
- [ ] Test keyboard navigation
- [ ] Test with JavaScript disabled (graceful degradation)

### Accessibility Testing

- [ ] Use semantic HTML elements
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Ensure keyboard navigation works
- [ ] Check color contrast ratios (WCAG AA minimum)
- [ ] Add ARIA labels where needed
- [ ] Test with browser zoom (200%)

### Performance Testing

- [ ] Check page load time (< 2 seconds)
- [ ] Optimize images (use SVG when possible)
- [ ] Minimize JavaScript execution time
- [ ] Test with slow 3G network
- [ ] Check for memory leaks

## Responsive Design Breakpoints

```css
/* Mobile: < 640px */
@media (max-width: 640px) {
    /* Single column layout */
    /* Stack navigation */
    /* Full-width buttons */
}

/* Tablet: 640px - 968px */
@media (max-width: 968px) {
    /* 2 column grid */
    /* Wrapped navigation */
    /* Adjusted spacing */
}

/* Desktop: > 968px */
/* Default styles (mobile-first approach) */
```

## Internationalization (i18n)

### Adding Translatable Text

1. **Add data attribute to HTML:**
```html
<h2 data-i18n="section.title">Default Text</h2>
```

2. **Add translations to i18n.js:**
```javascript
const translations = {
    en: {
        section: {
            title: "English Title"
        }
    },
    zh: {
        section: {
            title: "中文標題"
        }
    },
    pt: {
        section: {
            title: "Título em Português"
        }
    }
};
```

3. **For placeholder text:**
```html
<input data-i18n-placeholder="form.placeholder">
```

### Translation Guidelines

- Keep translations consistent across all languages
- Use formal tone for professional platform
- Consider cultural context
- Test text length (some languages are longer)
- Avoid idioms that don't translate well

## Git Workflow

1. **Create a feature branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes:**
```bash
git add .
git commit -m "Add: descriptive commit message"
```

3. **Push to repository:**
```bash
git push origin feature/your-feature-name
```

4. **Create a pull request**

### Commit Message Format

```
Type: Brief description

Longer description if needed

- Bullet point 1
- Bullet point 2
```

**Types:**
- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Update existing feature
- `Refactor:` Code refactoring
- `Docs:` Documentation changes
- `Style:` CSS/styling changes
- `Test:` Testing changes

## Common Issues and Solutions

### Issue: Language not switching
**Solution:** Check that all translations exist in i18n.js and data-i18n attributes are correct

### Issue: Events not displaying
**Solution:** Check browser console for JavaScript errors, verify events-data.js is loaded

### Issue: Responsive layout broken
**Solution:** Test CSS media queries, check for conflicting styles

### Issue: Modal not closing
**Solution:** Verify event listeners are attached, check z-index conflicts

## Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [Font Awesome Icons](https://fontawesome.com/icons)
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Questions?

If you have questions about contributing:
1. Check the README.md and DEMO.md
2. Review existing code for examples
3. Open an issue for discussion

## License

This project is a demonstration platform mimicking the CPTTM website.

---

**Thank you for contributing to make this platform better!**
