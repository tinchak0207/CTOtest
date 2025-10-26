# CPTTM Event Registration Platform

A modern, responsive frontend mimicking the events.cpttm.org.mo website - an event registration platform operated by the Macau Productivity and Technology Transfer Center (CPTTM).

## About CPTTM

The Macau Productivity and Technology Transfer Center (CPTTM) was founded in 1996 as a non-profit organization jointly established by the Macau SAR Government and the private sector. The mission is to support enterprises to utilize effectively new conceptual thinking, information and resources in order to increase the value-added of its products or services, with the aim to promote higher productivity and stronger competitiveness.

## Features

### Multi-language Support
- **English** - Primary interface language
- **Traditional Chinese (中文)** - For Chinese-speaking users
- **Portuguese (Português)** - Reflecting Macau's bilingual heritage
- Language switching via URL parameters (?l=e for English, ?l=c for Chinese, ?l=p for Portuguese)
- Persistent language preference saved in localStorage

### Event Management
- **Event Listings** - Browse hundreds of courses, seminars, competitions, and examinations
- **Advanced Filtering** - Filter by category, type, and date range
- **Search Functionality** - Full-text search across all event titles and descriptions
- **Pagination** - Efficient navigation through large event catalogs
- **Event Details** - Comprehensive information including date, time, location, instructor, duration, language, fees, and available seats

### Course Categories
1. **Information Technology** - Cloud computing, programming, cybersecurity
2. **Fashion & Creativity** - Design, fashion, creative arts
3. **Business Language** - English, Chinese, Portuguese for business
4. **Enterprise Management** - Business operations, management, strategy

### Event Types
- Training Courses
- Seminars and Conferences
- Competitions (Fashion Design, Office Skills)
- Professional Certification Examinations

### User Features
- Student login system (frontend demo)
- Event registration with seat availability tracking
- Event sharing functionality
- Responsive design for mobile, tablet, and desktop
- Smooth scrolling and modern animations

## Technology Partnerships

The platform showcases CPTTM's partnerships with:
- **Huawei** - Technology training partnership since 2021
- **Alibaba Cloud** - Cloud certification partnership since 2022
- **China National VQA** - Vocational Qualification Assessment coordination

## Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript** - No framework dependencies
- **Font Awesome** - Icon library
- **Responsive Design** - Mobile-first approach with breakpoints at 640px and 968px

## File Structure

```
.
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── app.js              # Main application logic and event handlers
├── i18n.js             # Internationalization and language management
├── events-data.js      # Event data and filtering logic
├── assets/
│   └── logo.svg        # CPTTM logo
└── README.md           # This file
```

## Getting Started

1. Open `index.html` in a modern web browser
2. No build process or dependencies required
3. All files are self-contained and can be served from any static web server

## Usage

### Browsing Events
1. Scroll to the "Upcoming Events & Courses" section
2. Use the filter controls to narrow down events by category, type, or date
3. Click on any event card to view detailed information

### Searching
1. Use the hero search bar to search for specific courses or topics
2. Results update automatically based on your search query

### Language Switching
1. Click the language buttons (EN, 中文, PT) in the header
2. Alternatively, use URL parameters: `?l=e` (English), `?l=c` (Chinese), `?l=p` (Portuguese)

### Registration
1. Click "Register" on any event card
2. The system will prompt for login (demo functionality)
3. Seat availability is tracked in real-time

## Responsive Breakpoints

- **Desktop**: > 968px - Full layout with all features
- **Tablet**: 640px - 968px - Adjusted navigation and grid layouts
- **Mobile**: < 640px - Single column layout, stacked navigation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Features Implemented

✅ Multi-language support (English, Chinese, Portuguese)  
✅ Event listing and filtering  
✅ Advanced search functionality  
✅ Category-based navigation  
✅ Date range filtering  
✅ Student login modal  
✅ Event detail modal  
✅ Seat availability tracking  
✅ Responsive design  
✅ Smooth animations  
✅ Social sharing  
✅ Pagination  
✅ Partnership showcase  
✅ About section with statistics  
✅ Footer with contact information  

## Sample Events

The platform includes 12 sample events covering:
- Cloud Computing (Alibaba Cloud, Huawei HCIA)
- ESG Certification
- Fashion Design Competition
- Business Language Courses
- Programming Fundamentals
- Microsoft Office Skills
- Digital Marketing
- Graphic Design
- Cybersecurity
- Entrepreneurship Seminars

## Design Philosophy

The design follows modern web standards with:
- Clean, professional aesthetic
- Blue color scheme (#0066cc, #004d99) representing trust and professionalism
- Orange accent color (#ff6600) for call-to-action elements
- Ample whitespace for readability
- Clear visual hierarchy
- Accessible color contrasts
- Intuitive navigation

## Future Enhancements

Potential improvements for a production version:
- Backend API integration
- Real authentication system
- Payment processing
- Email notifications
- Calendar integration
- User dashboard
- Course materials download
- Instructor profiles
- Student reviews and ratings
- Advanced analytics

## License

This is a demonstration project mimicking the CPTTM events platform.

## Contact

For questions about CPTTM:
- Website: www.cpttm.org.mo
- Phone: +853 2878 1313
- Location: Macau, China

---

**Note**: This is a frontend demonstration project. All event data is sample data for demonstration purposes. For actual event registration, please visit the official CPTTM website at events.cpttm.org.mo.
