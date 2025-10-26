# CPTTM Event Platform - Demo Guide

## Quick Start

1. **Open the Website**
   - Simply open `index.html` in your web browser
   - Or run a local server: `python3 -m http.server 8080`
   - Navigate to `http://localhost:8080`

## Feature Demonstrations

### 1. Multi-Language Support

**English (Default)**
- URL: `index.html` or `index.html?l=e`
- Click the "EN" button in the header

**Traditional Chinese**
- URL: `index.html?l=c`
- Click the "中文" button in the header

**Portuguese**
- URL: `index.html?l=p`
- Click the "PT" button in the header

**Language Persistence**
- Your language choice is saved in localStorage
- Returns to your preferred language on next visit

### 2. Browse Events by Category

Click on any category card:
- **Information Technology** - Cloud, programming, cybersecurity courses
- **Fashion & Creativity** - Design and creative arts
- **Business Language** - English, Chinese, Portuguese courses
- **Enterprise Management** - Business and management training

The page automatically scrolls to the events section with the category pre-filtered.

### 3. Search Functionality

**Hero Search Bar**
- Located in the main banner
- Search for: "Python", "Cloud", "Fashion", "English", etc.
- Press Enter or click the search icon
- Results update instantly

### 4. Advanced Filtering

**Date Range Filter**
- Select a start date
- Select an end date (optional)
- Shows events within the specified period

**Category Filter**
- All Categories
- Information Technology
- Fashion & Creativity
- Business Language
- Enterprise Management

**Type Filter**
- All Types
- Course
- Seminar
- Competition
- Examination

**Apply Filters Button**
- Combines all filter criteria
- Updates results in real-time

### 5. Event Details

**View Details**
- Click on any event card
- Opens a modal with complete information:
  - Date and time
  - Location
  - Instructor
  - Duration
  - Language of instruction
  - Fee
  - Available seats

**Registration**
- Click "Register Now" in the detail modal
- Or click "Register" on the event card
- Shows login prompt (demo only)

**Share Event**
- Click "Share Event" button
- Generates shareable URL with language preference
- Uses native sharing API if available
- Falls back to clipboard copy

### 6. Pagination

- Events are displayed 6 per page
- Use Previous/Next buttons to navigate
- Current page indicator shows progress
- Smooth scroll to top when changing pages

### 7. Student Login (Demo)

- Click "Student Login" in the header
- Enter any username and password
- Demo authentication (no actual validation)
- Modal closes after "login"

### 8. Responsive Design Testing

**Desktop (> 968px)**
- Full navigation bar
- 3-4 column event grid
- Side-by-side layout elements

**Tablet (640px - 968px)**
- Wrapped navigation
- 2 column event grid
- Adjusted spacing

**Mobile (< 640px)**
- Stacked navigation
- Single column layout
- Full-width buttons
- Touch-friendly spacing

**To Test:**
- Resize your browser window
- Use browser DevTools (F12) Device Toolbar
- Test on actual mobile devices

## Sample Event Data

The platform includes 12 pre-loaded events:

1. **Cloud Computing with Alibaba Cloud** (Course, IT)
2. **ESG Certification Seminar** (Seminar, Management)
3. **Fashion Design Competition 2024** (Competition, Fashion)
4. **Business English Communication** (Course, Language)
5. **Python Programming Fundamentals** (Course, IT) - Fully Booked
6. **Microsoft Office Specialist Competition** (Competition, IT)
7. **Digital Marketing Strategy Workshop** (Course, Management)
8. **Graphic Design with Adobe Creative Suite** (Course, Fashion)
9. **Huawei HCIA Cloud Computing Certification** (Exam, IT)
10. **Portuguese for Business Professionals** (Course, Language)
11. **Entrepreneurship and Innovation Seminar** (Seminar, Management)
12. **Cybersecurity Essentials** (Course, IT)

## Testing Scenarios

### Scenario 1: New Student Registration Flow
1. Open website in English
2. Browse Fashion & Creativity category
3. Click on "Fashion Design Competition 2024"
4. View event details
5. Click "Register Now"
6. Login prompt appears
7. Enter credentials (demo)

### Scenario 2: Multi-Language Event Search
1. Switch to Chinese (中文)
2. Search for "雲端" (cloud)
3. View filtered results
4. Switch to Portuguese
5. Notice all text updates to Portuguese
6. Click on an event to see details in Portuguese

### Scenario 3: Mobile User Experience
1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Select iPhone or Android device
4. Test navigation menu
5. Test category cards (should be single column)
6. Test event cards (should stack)
7. Test modals (should be responsive)

### Scenario 4: Event Discovery
1. Select date range (e.g., December 2024)
2. Filter by "Information Technology"
3. Filter by type "Course"
4. Click "Apply Filters"
5. Browse filtered results
6. Click "View Details" on an event
7. Share the event

### Scenario 5: Seat Availability Tracking
1. Browse events
2. Notice different seat availability indicators:
   - Green "X seats available" (plenty of seats)
   - Yellow "Limited seats!" (< 20% remaining)
   - Red "Fully booked" (0 seats)
3. Try to register for fully booked event (button disabled)

## Browser Compatibility

**Recommended Browsers:**
- Google Chrome 90+
- Mozilla Firefox 88+
- Safari 14+
- Microsoft Edge 90+

**Features Used:**
- CSS Grid and Flexbox
- CSS Custom Properties (variables)
- ES6+ JavaScript (arrow functions, template literals, modules)
- Intersection Observer API
- LocalStorage API
- Fetch API (for future enhancements)

## Performance Notes

- No external dependencies except Font Awesome (from CDN)
- All JavaScript is vanilla (no framework overhead)
- CSS is optimized with custom properties
- Images use SVG format (scalable and lightweight)
- Total page size: ~100KB (excluding Font Awesome)

## Customization

### Change Color Scheme
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #0066cc;    /* Main blue */
    --secondary-color: #004d99;  /* Dark blue */
    --accent-color: #ff6600;     /* Orange */
}
```

### Add New Events
Edit `events-data.js` and add new event objects to the `eventsData` array.

### Add New Language
1. Edit `i18n.js`
2. Add new language object to `translations`
3. Add language button in `index.html`

### Modify Layout
Edit `styles.css` responsive breakpoints:
```css
@media (max-width: 968px) { /* Tablet */ }
@media (max-width: 640px) { /* Mobile */ }
```

## Known Limitations (Demo)

- No backend integration
- No real authentication
- No payment processing
- No email notifications
- Event data is hard-coded
- No database persistence
- Registration is simulated
- Search is client-side only

## Next Steps for Production

If developing this into a real platform:

1. **Backend Development**
   - REST API or GraphQL
   - Database (PostgreSQL, MongoDB)
   - Authentication (JWT, OAuth)
   - Payment gateway integration

2. **Enhanced Features**
   - User dashboard
   - Course materials upload/download
   - Certificate generation
   - Email notifications
   - Calendar integration (Google Calendar, iCal)
   - Video conferencing integration
   - Analytics and reporting

3. **Optimization**
   - CDN for static assets
   - Image optimization
   - Code minification
   - Lazy loading
   - Service workers for offline support
   - Progressive Web App (PWA)

4. **Testing**
   - Unit tests (Jest)
   - Integration tests (Cypress)
   - Accessibility testing (WCAG 2.1)
   - Performance testing (Lighthouse)
   - Cross-browser testing

5. **Deployment**
   - CI/CD pipeline
   - Staging environment
   - Production deployment
   - Monitoring and logging
   - Error tracking (Sentry)

## Support

For questions or issues with this demo:
- Review the code comments
- Check the README.md
- Examine browser console for errors

For the actual CPTTM platform:
- Visit: events.cpttm.org.mo
- Phone: +853 2878 1313
- Email: info@cpttm.org.mo

---

**Enjoy exploring the CPTTM Event Registration Platform demo!**
