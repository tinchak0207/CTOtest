document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderEvents();
    setupEventListeners();
    checkUrlParams();
}

function setupEventListeners() {
    const loginBtn = document.querySelector('.login-btn');
    const loginModal = document.getElementById('login-modal');
    const eventModal = document.getElementById('event-modal');
    const closeModals = document.querySelectorAll('.close-modal');
    
    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
    });
    
    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').classList.remove('active');
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
    
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        alert(`Welcome back, ${username}! (This is a demo - no actual authentication)`);
        loginModal.classList.remove('active');
    });
    
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            currentFilters.category = category;
            document.getElementById('category-filter').value = category;
            filterEvents();
            renderEvents();
            
            document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const category = btn.closest('.category-card').getAttribute('data-category');
            currentFilters.category = category;
            document.getElementById('category-filter').value = category;
            filterEvents();
            renderEvents();
            
            document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    const applyFiltersBtn = document.getElementById('apply-filters');
    applyFiltersBtn.addEventListener('click', () => {
        currentFilters.category = document.getElementById('category-filter').value;
        currentFilters.type = document.getElementById('type-filter').value;
        currentFilters.startDate = document.getElementById('start-date').value;
        currentFilters.endDate = document.getElementById('end-date').value;
        
        filterEvents();
        renderEvents();
    });
    
    const heroSearchInput = document.getElementById('hero-search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    const performSearch = () => {
        currentFilters.searchQuery = heroSearchInput.value;
        filterEvents();
        renderEvents();
        
        document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
    };
    
    searchBtn.addEventListener('click', performSearch);
    
    heroSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderEvents();
            document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderEvents();
            document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
    });
}

function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event');
    
    if (eventId) {
        setTimeout(() => {
            showEventDetail(parseInt(eventId));
        }, 500);
    }
}

function resetFilters() {
    currentFilters = {
        category: 'all',
        type: 'all',
        startDate: '',
        endDate: '',
        searchQuery: ''
    };
    
    document.getElementById('category-filter').value = 'all';
    document.getElementById('type-filter').value = 'all';
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    document.getElementById('hero-search-input').value = '';
    
    filterEvents();
    renderEvents();
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.category-card, .event-card, .partner-card, .stat-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.5s ease-out';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
}

setTimeout(animateOnScroll, 100);

const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

document.getElementById('start-date').setAttribute('min', getCurrentDate());
document.getElementById('end-date').setAttribute('min', getCurrentDate());

document.getElementById('start-date').addEventListener('change', function() {
    document.getElementById('end-date').setAttribute('min', this.value);
});

console.log('%cCPTTM Event Registration Platform', 'font-size: 20px; font-weight: bold; color: #0066cc;');
console.log('%cMacau Productivity and Technology Transfer Center', 'font-size: 14px; color: #666;');
console.log('%cFounded in 1996 | Serving Macau\'s Professional Development', 'font-size: 12px; color: #999;');
