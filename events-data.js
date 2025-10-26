const eventsData = [
    {
        id: 1,
        title: {
            en: "Cloud Computing with Alibaba Cloud",
            zh: "阿里雲雲端運算課程",
            pt: "Computação em Nuvem com Alibaba Cloud"
        },
        description: {
            en: "Learn the fundamentals of cloud computing using Alibaba Cloud platform. Includes hands-on labs and certification preparation.",
            zh: "學習使用阿里雲平台的雲端運算基礎知識，包括實作實驗室和認證準備。",
            pt: "Aprenda os fundamentos da computação em nuvem usando a plataforma Alibaba Cloud. Inclui laboratórios práticos e preparação para certificação."
        },
        category: "it",
        type: "course",
        date: "2024-12-15",
        time: "14:00-18:00",
        duration: "4 hours",
        location: {
            en: "CPTTM Training Center, Room 301",
            zh: "生產力中心培訓室301",
            pt: "Centro de Formação CPTTM, Sala 301"
        },
        instructor: {
            en: "Dr. Wong Chi Ming",
            zh: "黃志明博士",
            pt: "Dr. Wong Chi Ming"
        },
        fee: "MOP 500",
        totalSeats: 30,
        availableSeats: 12,
        language: {
            en: "Cantonese with English materials",
            zh: "廣東話授課，英文教材",
            pt: "Cantonês com materiais em inglês"
        }
    },
    {
        id: 2,
        title: {
            en: "ESG Certification Seminar",
            zh: "ESG認證研討會",
            pt: "Seminário de Certificação ESG"
        },
        description: {
            en: "Comprehensive seminar on Environmental, Social, and Governance (ESG) certification for enterprises. Learn compliance requirements and best practices.",
            zh: "企業環境、社會和治理(ESG)認證的綜合研討會。了解合規要求和最佳實踐。",
            pt: "Seminário abrangente sobre certificação Ambiental, Social e de Governança (ESG) para empresas. Aprenda requisitos de conformidade e melhores práticas."
        },
        category: "management",
        type: "seminar",
        date: "2024-12-20",
        time: "09:30-12:30",
        duration: "3 hours",
        location: {
            en: "CPTTM Conference Hall",
            zh: "生產力中心會議廳",
            pt: "Salão de Conferências CPTTM"
        },
        instructor: {
            en: "Prof. Maria Santos",
            zh: "瑪利亞·桑托斯教授",
            pt: "Prof. Maria Santos"
        },
        fee: "MOP 300",
        totalSeats: 50,
        availableSeats: 5,
        language: {
            en: "English and Portuguese",
            zh: "英語和葡萄牙語",
            pt: "Inglês e Português"
        }
    },
    {
        id: 3,
        title: {
            en: "Fashion Design Competition 2024",
            zh: "2024時裝設計大賽",
            pt: "Competição de Design de Moda 2024"
        },
        description: {
            en: "Annual fashion design competition for young designers. Showcase your creativity and win prizes up to MOP 10,000.",
            zh: "年度青年設計師時裝設計大賽。展示您的創造力，贏取高達10,000澳門元的獎金。",
            pt: "Competição anual de design de moda para jovens designers. Mostre sua criatividade e ganhe prêmios de até MOP 10.000."
        },
        category: "fashion",
        type: "competition",
        date: "2025-01-15",
        time: "10:00-17:00",
        duration: "Full day",
        location: {
            en: "Macau Cultural Center",
            zh: "澳門文化中心",
            pt: "Centro Cultural de Macau"
        },
        instructor: {
            en: "Judging Panel",
            zh: "評審團",
            pt: "Painel de Juízes"
        },
        fee: "Free",
        totalSeats: 100,
        availableSeats: 67,
        language: {
            en: "Multilingual",
            zh: "多語言",
            pt: "Multilíngue"
        }
    },
    {
        id: 4,
        title: {
            en: "Business English Communication",
            zh: "商業英語溝通課程",
            pt: "Comunicação em Inglês de Negócios"
        },
        description: {
            en: "Improve your business English skills for professional communication, presentations, and negotiations.",
            zh: "提升您的商業英語技能，用於專業溝通、簡報和談判。",
            pt: "Melhore suas habilidades de inglês de negócios para comunicação profissional, apresentações e negociações."
        },
        category: "language",
        type: "course",
        date: "2024-12-10",
        time: "19:00-21:00",
        duration: "2 hours per session, 8 sessions",
        location: {
            en: "CPTTM Training Center, Room 205",
            zh: "生產力中心培訓室205",
            pt: "Centro de Formação CPTTM, Sala 205"
        },
        instructor: {
            en: "Ms. Jennifer Lee",
            zh: "李珍妮女士",
            pt: "Ms. Jennifer Lee"
        },
        fee: "MOP 1,200",
        totalSeats: 20,
        availableSeats: 8,
        language: {
            en: "English",
            zh: "英語",
            pt: "Inglês"
        }
    },
    {
        id: 5,
        title: {
            en: "Python Programming Fundamentals",
            zh: "Python編程基礎課程",
            pt: "Fundamentos de Programação Python"
        },
        description: {
            en: "Learn Python programming from scratch. Perfect for beginners who want to start a career in software development.",
            zh: "從零開始學習Python編程。非常適合想要開始軟體開發職業生涯的初學者。",
            pt: "Aprenda programação Python do zero. Perfeito para iniciantes que desejam iniciar uma carreira em desenvolvimento de software."
        },
        category: "it",
        type: "course",
        date: "2024-12-12",
        time: "18:30-21:30",
        duration: "3 hours per session, 10 sessions",
        location: {
            en: "CPTTM IT Lab",
            zh: "生產力中心電腦室",
            pt: "Laboratório de TI CPTTM"
        },
        instructor: {
            en: "Mr. Chan Siu Ming",
            zh: "陳兆明先生",
            pt: "Sr. Chan Siu Ming"
        },
        fee: "MOP 1,800",
        totalSeats: 25,
        availableSeats: 0,
        language: {
            en: "Cantonese with English materials",
            zh: "廣東話授課，英文教材",
            pt: "Cantonês com materiais em inglês"
        }
    },
    {
        id: 6,
        title: {
            en: "Microsoft Office Specialist Competition",
            zh: "微軟Office專家技能競賽",
            pt: "Competição de Especialista em Microsoft Office"
        },
        description: {
            en: "Test your Microsoft Office skills in Word, Excel, and PowerPoint. Winners receive international certification.",
            zh: "測試您在Word、Excel和PowerPoint的微軟Office技能。獲勝者將獲得國際認證。",
            pt: "Teste suas habilidades do Microsoft Office em Word, Excel e PowerPoint. Os vencedores recebem certificação internacional."
        },
        category: "it",
        type: "competition",
        date: "2025-01-20",
        time: "13:00-17:00",
        duration: "4 hours",
        location: {
            en: "CPTTM IT Lab",
            zh: "生產力中心電腦室",
            pt: "Laboratório de TI CPTTM"
        },
        instructor: {
            en: "Competition Organizers",
            zh: "比賽組織者",
            pt: "Organizadores da Competição"
        },
        fee: "MOP 200",
        totalSeats: 40,
        availableSeats: 23,
        language: {
            en: "Interface in multiple languages",
            zh: "多語言界面",
            pt: "Interface em vários idiomas"
        }
    },
    {
        id: 7,
        title: {
            en: "Digital Marketing Strategy Workshop",
            zh: "數碼營銷策略工作坊",
            pt: "Workshop de Estratégia de Marketing Digital"
        },
        description: {
            en: "Learn effective digital marketing strategies including SEO, social media marketing, and content creation.",
            zh: "學習有效的數碼營銷策略，包括SEO、社交媒體營銷和內容創作。",
            pt: "Aprenda estratégias eficazes de marketing digital, incluindo SEO, marketing de mídia social e criação de conteúdo."
        },
        category: "management",
        type: "course",
        date: "2024-12-18",
        time: "14:00-17:00",
        duration: "3 hours",
        location: {
            en: "CPTTM Training Center, Room 401",
            zh: "生產力中心培訓室401",
            pt: "Centro de Formação CPTTM, Sala 401"
        },
        instructor: {
            en: "Ms. Sophia Chen",
            zh: "陳思敏女士",
            pt: "Ms. Sophia Chen"
        },
        fee: "MOP 600",
        totalSeats: 35,
        availableSeats: 15,
        language: {
            en: "Cantonese and Mandarin",
            zh: "廣東話及普通話",
            pt: "Cantonês e Mandarim"
        }
    },
    {
        id: 8,
        title: {
            en: "Graphic Design with Adobe Creative Suite",
            zh: "Adobe創意套件平面設計課程",
            pt: "Design Gráfico com Adobe Creative Suite"
        },
        description: {
            en: "Master Adobe Photoshop, Illustrator, and InDesign for professional graphic design work.",
            zh: "掌握Adobe Photoshop、Illustrator和InDesign，從事專業平面設計工作。",
            pt: "Domine Adobe Photoshop, Illustrator e InDesign para trabalho profissional de design gráfico."
        },
        category: "fashion",
        type: "course",
        date: "2024-12-22",
        time: "10:00-13:00",
        duration: "3 hours per session, 6 sessions",
        location: {
            en: "CPTTM Design Studio",
            zh: "生產力中心設計工作室",
            pt: "Estúdio de Design CPTTM"
        },
        instructor: {
            en: "Mr. Luis Fernandes",
            zh: "費爾南德斯先生",
            pt: "Sr. Luis Fernandes"
        },
        fee: "MOP 1,500",
        totalSeats: 18,
        availableSeats: 4,
        language: {
            en: "English and Portuguese",
            zh: "英語和葡萄牙語",
            pt: "Inglês e Português"
        }
    },
    {
        id: 9,
        title: {
            en: "Huawei HCIA Cloud Computing Certification",
            zh: "華為HCIA雲端運算認證課程",
            pt: "Certificação Huawei HCIA Cloud Computing"
        },
        description: {
            en: "Official Huawei certification course covering cloud computing fundamentals and Huawei Cloud services.",
            zh: "華為官方認證課程，涵蓋雲端運算基礎知識和華為雲服務。",
            pt: "Curso de certificação oficial da Huawei que abrange fundamentos de computação em nuvem e serviços Huawei Cloud."
        },
        category: "it",
        type: "exam",
        date: "2025-01-10",
        time: "09:00-12:00",
        duration: "3 hours",
        location: {
            en: "CPTTM IT Lab",
            zh: "生產力中心電腦室",
            pt: "Laboratório de TI CPTTM"
        },
        instructor: {
            en: "Huawei Certified Instructor",
            zh: "華為認證講師",
            pt: "Instrutor Certificado Huawei"
        },
        fee: "MOP 800",
        totalSeats: 30,
        availableSeats: 18,
        language: {
            en: "English examination",
            zh: "英語考試",
            pt: "Exame em inglês"
        }
    },
    {
        id: 10,
        title: {
            en: "Portuguese for Business Professionals",
            zh: "商業葡萄牙語專業課程",
            pt: "Português para Profissionais de Negócios"
        },
        description: {
            en: "Learn Portuguese language skills specifically tailored for business contexts and professional environments.",
            zh: "學習專為商業環境和專業場合量身定制的葡萄牙語技能。",
            pt: "Aprenda habilidades de língua portuguesa especificamente adaptadas para contextos de negócios e ambientes profissionais."
        },
        category: "language",
        type: "course",
        date: "2024-12-14",
        time: "19:00-21:00",
        duration: "2 hours per session, 12 sessions",
        location: {
            en: "CPTTM Training Center, Room 203",
            zh: "生產力中心培訓室203",
            pt: "Centro de Formação CPTTM, Sala 203"
        },
        instructor: {
            en: "Ms. Ana Silva",
            zh: "安娜·席爾瓦女士",
            pt: "Ms. Ana Silva"
        },
        fee: "MOP 1,400",
        totalSeats: 15,
        availableSeats: 9,
        language: {
            en: "Portuguese with English support",
            zh: "葡萄牙語授課，英語輔助",
            pt: "Português com suporte em inglês"
        }
    },
    {
        id: 11,
        title: {
            en: "Entrepreneurship and Innovation Seminar",
            zh: "創業與創新研討會",
            pt: "Seminário de Empreendedorismo e Inovação"
        },
        description: {
            en: "Discover the key principles of entrepreneurship and innovation in the digital age. Network with successful entrepreneurs.",
            zh: "探索數碼時代創業和創新的關鍵原則。與成功企業家建立聯繫。",
            pt: "Descubra os princípios-chave do empreendedorismo e inovação na era digital. Faça networking com empreendedores de sucesso."
        },
        category: "management",
        type: "seminar",
        date: "2025-01-05",
        time: "14:00-18:00",
        duration: "4 hours",
        location: {
            en: "CPTTM Conference Hall",
            zh: "生產力中心會議廳",
            pt: "Salão de Conferências CPTTM"
        },
        instructor: {
            en: "Panel of Entrepreneurs",
            zh: "企業家座談小組",
            pt: "Painel de Empreendedores"
        },
        fee: "MOP 400",
        totalSeats: 60,
        availableSeats: 32,
        language: {
            en: "English and Cantonese",
            zh: "英語和廣東話",
            pt: "Inglês e Cantonês"
        }
    },
    {
        id: 12,
        title: {
            en: "Cybersecurity Essentials",
            zh: "網絡安全基礎課程",
            pt: "Fundamentos de Cibersegurança"
        },
        description: {
            en: "Learn the fundamentals of cybersecurity, including threat detection, risk management, and security best practices.",
            zh: "學習網絡安全基礎知識，包括威脅檢測、風險管理和安全最佳實踐。",
            pt: "Aprenda os fundamentos de cibersegurança, incluindo detecção de ameaças, gestão de riscos e melhores práticas de segurança."
        },
        category: "it",
        type: "course",
        date: "2024-12-16",
        time: "18:30-21:30",
        duration: "3 hours per session, 8 sessions",
        location: {
            en: "CPTTM IT Lab",
            zh: "生產力中心電腦室",
            pt: "Laboratório de TI CPTTM"
        },
        instructor: {
            en: "Mr. Kevin Lam",
            zh: "林家偉先生",
            pt: "Sr. Kevin Lam"
        },
        fee: "MOP 1,600",
        totalSeats: 22,
        availableSeats: 11,
        language: {
            en: "English",
            zh: "英語",
            pt: "Inglês"
        }
    }
];

let currentPage = 1;
const eventsPerPage = 6;
let filteredEvents = [...eventsData];
let currentFilters = {
    category: 'all',
    type: 'all',
    startDate: '',
    endDate: '',
    searchQuery: ''
};

function getLocalizedValue(obj, lang) {
    return obj[lang] || obj.en;
}

function filterEvents() {
    filteredEvents = eventsData.filter(event => {
        const matchesCategory = currentFilters.category === 'all' || event.category === currentFilters.category;
        const matchesType = currentFilters.type === 'all' || event.type === currentFilters.type;
        
        let matchesDate = true;
        if (currentFilters.startDate) {
            matchesDate = matchesDate && event.date >= currentFilters.startDate;
        }
        if (currentFilters.endDate) {
            matchesDate = matchesDate && event.date <= currentFilters.endDate;
        }
        
        let matchesSearch = true;
        if (currentFilters.searchQuery) {
            const query = currentFilters.searchQuery.toLowerCase();
            const titleEn = event.title.en.toLowerCase();
            const titleZh = event.title.zh.toLowerCase();
            const titlePt = event.title.pt.toLowerCase();
            const descEn = event.description.en.toLowerCase();
            const descZh = event.description.zh.toLowerCase();
            const descPt = event.description.pt.toLowerCase();
            
            matchesSearch = titleEn.includes(query) || titleZh.includes(query) || 
                          titlePt.includes(query) || descEn.includes(query) || 
                          descZh.includes(query) || descPt.includes(query);
        }
        
        return matchesCategory && matchesType && matchesDate && matchesSearch;
    });
    
    currentPage = 1;
}

function renderEvents() {
    const eventsGrid = document.getElementById('events-grid');
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    
    if (filteredEvents.length === 0) {
        eventsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-calendar-times"></i>
                <h3>${t('eventCard.noResults')}</h3>
                <p>${t('eventCard.tryDifferentFilters')}</p>
            </div>
        `;
        document.getElementById('current-page').textContent = '0';
        document.getElementById('total-pages').textContent = '0';
        return;
    }
    
    const startIdx = (currentPage - 1) * eventsPerPage;
    const endIdx = startIdx + eventsPerPage;
    const pageEvents = filteredEvents.slice(startIdx, endIdx);
    
    eventsGrid.innerHTML = pageEvents.map(event => {
        const title = getLocalizedValue(event.title, currentLang);
        const description = getLocalizedValue(event.description, currentLang);
        const location = getLocalizedValue(event.location, currentLang);
        
        const seatsPercentage = (event.availableSeats / event.totalSeats) * 100;
        let seatsClass = '';
        let seatsText = `${event.availableSeats} ${t('eventCard.seatsAvailable')}`;
        
        if (event.availableSeats === 0) {
            seatsClass = 'full';
            seatsText = t('eventCard.fullyBooked');
        } else if (seatsPercentage < 20) {
            seatsClass = 'limited';
            seatsText = `${event.availableSeats} ${t('eventCard.seatsAvailable')} - ${t('eventCard.limitedSeats')}`;
        }
        
        const typeBadge = t(`filter.${event.type}`);
        const categoryName = t(`categories.${event.category}.title`);
        
        const iconMap = {
            it: 'fa-laptop-code',
            fashion: 'fa-palette',
            language: 'fa-language',
            management: 'fa-briefcase'
        };
        
        return `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-image">
                    <i class="fas ${iconMap[event.category]}"></i>
                    <div class="event-type-badge">${typeBadge}</div>
                </div>
                <div class="event-content">
                    <span class="event-category">${categoryName}</span>
                    <h3 class="event-title">${title}</h3>
                    <p class="event-description">${description}</p>
                    <div class="event-meta">
                        <div class="event-meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${event.date}</span>
                        </div>
                        <div class="event-meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${event.time}</span>
                        </div>
                        <div class="event-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${location}</span>
                        </div>
                    </div>
                    <div class="event-footer">
                        <span class="event-seats ${seatsClass}">${seatsText}</span>
                        <button class="register-btn" ${event.availableSeats === 0 ? 'disabled' : ''}>
                            ${t('eventCard.register')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('current-page').textContent = currentPage;
    document.getElementById('total-pages').textContent = totalPages;
    
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
    
    document.querySelectorAll('.event-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('register-btn')) {
                const eventId = parseInt(card.getAttribute('data-event-id'));
                showEventDetail(eventId);
            }
        });
    });
    
    document.querySelectorAll('.register-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const eventId = parseInt(btn.closest('.event-card').getAttribute('data-event-id'));
            registerForEvent(eventId);
        });
    });
}

function showEventDetail(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    const title = getLocalizedValue(event.title, currentLang);
    const description = getLocalizedValue(event.description, currentLang);
    const location = getLocalizedValue(event.location, currentLang);
    const instructor = getLocalizedValue(event.instructor, currentLang);
    const language = getLocalizedValue(event.language, currentLang);
    
    const detailContent = document.getElementById('event-detail-content');
    detailContent.innerHTML = `
        <div class="event-detail">
            <h2>${title}</h2>
            <div class="event-detail-meta">
                <p><strong>${t('eventDetail.date')}:</strong> ${event.date}</p>
                <p><strong>${t('eventDetail.time')}:</strong> ${event.time}</p>
                <p><strong>${t('eventDetail.location')}:</strong> ${location}</p>
                <p><strong>${t('eventDetail.instructor')}:</strong> ${instructor}</p>
                <p><strong>${t('eventDetail.duration')}:</strong> ${event.duration}</p>
                <p><strong>${t('eventDetail.language')}:</strong> ${language}</p>
                <p><strong>${t('eventDetail.fee')}:</strong> ${event.fee}</p>
                <p><strong>${t('eventDetail.seats')}:</strong> ${event.availableSeats} / ${event.totalSeats}</p>
            </div>
            <div class="event-detail-description">
                <h3>Description</h3>
                <p>${description}</p>
            </div>
            <div class="event-detail-actions">
                <button class="btn-register" onclick="registerForEvent(${event.id})" ${event.availableSeats === 0 ? 'disabled' : ''}>
                    <i class="fas fa-user-plus"></i> ${t('eventDetail.register')}
                </button>
                <button class="btn-share" onclick="shareEvent(${event.id})">
                    <i class="fas fa-share-alt"></i> ${t('eventDetail.share')}
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('event-modal').classList.add('active');
}

function registerForEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event || event.availableSeats === 0) return;
    
    alert(`Registration for "${getLocalizedValue(event.title, currentLang)}" will be processed. Please login to continue.`);
    document.getElementById('login-modal').classList.add('active');
}

function shareEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    const url = `${window.location.origin}${window.location.pathname}?event=${eventId}&l=${currentLang === 'en' ? 'e' : currentLang === 'zh' ? 'c' : 'p'}`;
    
    if (navigator.share) {
        navigator.share({
            title: getLocalizedValue(event.title, currentLang),
            text: getLocalizedValue(event.description, currentLang),
            url: url
        });
    } else {
        navigator.clipboard.writeText(url);
        alert('Event link copied to clipboard!');
    }
}

window.renderEvents = renderEvents;
