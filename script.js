// ===== FEEDS CONFIGURATION =====
const FEEDS = {
  // Wiadomości główne
  "TVN24": "https://tvn24.pl/najnowsze.xml",
  "Onet": "https://wiadomosci.onet.pl/rss",
  "Interia": "https://fakty.interia.pl/feed",
  "Gazeta.pl": "https://rss.gazeta.pl/pub/rss/gazetapl_top.xml",
  "Wyborcza": "https://wyborcza.pl/0,0.xml?as=2&startsz=0",
  "Polsat News": "https://www.polsatnews.pl/rss/swiat.xml",
  "Wp.pl": "https://wiadomosci.wp.pl/ver,rss,rss.xml",
  "RMF24": "https://www.rmf24.pl/fakty/feed",
  "Press.pl": "https://www.press.pl/rss/press.xml",
  "Rzeczpospolita": "https://www.rp.pl/rss_main",
  
  // Technologia
  "Spider's Web": "https://www.spidersweb.pl/feed",
  "Benchmark.pl": "https://www.benchmark.pl/rss/ciezki_sprzet.xml",
  "Antyweb": "https://antyweb.pl/feed",
  "Komputerswiat.pl": "https://www.komputerswiat.pl/feed/artykuly",
  "Tabletowo": "https://www.tabletowo.pl/feed/",
  "Android.com.pl": "https://android.com.pl/feed",
  "GeekWeek": "https://geekweek.pl/feed/",
  "Niebezpiecznik": "https://niebezpiecznik.pl/feed/",
  "Zaufana Trzecia Strona": "https://zaufanatrzeciastrona.pl/feed/",
  "Chip.pl": "https://www.chip.pl/feed",
  "Computerworld": "https://www.computerworld.pl/rss",
  "Sekurak": "https://sekurak.pl/feed/",
  "Tech WP.pl": "https://tech.wp.pl/rss.xml",
  "Cyberdefence24": "https://www.cyberdefence24.pl/feed",
  
  // Biznes i Finanse
  "Business Insider": "https://businessinsider.com.pl/.feed",
  "Money.pl": "https://www.money.pl/rss/rss.xml",
  "Biznes.interia.pl": "https://biznes.interia.pl/feed",
  "Stooq": "https://stooq.pl/feed/news/pl/",
  "Bankier.pl": "https://www.bankier.pl/rss/wiadomosci.xml",
  "MamStartup": "https://mamstartup.pl/feed",
  
  // Media i Marketing
  "Wirtualnemedia.pl": "https://www.wirtualnemedia.pl/rss/wirtualnemedia_rss.xml",
  "Media2.pl": "https://www.media2.pl/feed.xml",
  
  // Polityka i Społeczeństwo
  "OKO.press": "https://oko.press/feed/",
  "Krytyka Polityczna": "https://krytykapolityczna.pl/feed/",
  
  // Kultura
  "Interia Kultura": "https://kultura.interia.pl/feed",
  
  // Sport
  "Eurosport": "https://www.eurosport.pl/rss.xml",
  
  // Międzynarodowe
  "BBC News": "http://feeds.bbci.co.uk/news/world/rss.xml",
  "The Guardian": "https://www.theguardian.com/world/rss",
  "Reuters": "https://www.reutersagency.com/feed/",
  "DW": "https://rss.dw.com/xml/rss-en-all",
  "Euronews": "https://www.euronews.com/rss"
};

// Kategorie źródeł - słowa kluczowe do automatycznej kategoryzacji
const CATEGORY_KEYWORDS = {
  "Polityka": [
    "sejm", "senat", "rząd", "minister", "premier", "prezydent", "poseł", "senator",
    "partia", "polityk", "wybory", "ustawa", "parlament", "głosowanie", "koalicja",
    "opozycja", "reforma", "konstytucja", "kandydat", "kampania", "dymisja", "polityczny",
    "pis", "po", "lewica", "konfederacja", "td", "psl", "sojusz", "tusk", "kaczyński"
  ],
  "Finanse": [
    "giełda", "akcje", "inwestycja", "waluta", "złoty", "dolar", "euro", "kryptowaluta",
    "bitcoin", "nbp", "inflacja", "stopa", "kredyt", "obligacje", "finanse", "ekonomia",
    "bank", "bankier", "startup", "biznes", "spółka", "zysk", "strata", "wycena",
    "fundusz", "pieniądze", "koszty", "budżet", "podatek", "vat", "pit", "inwestor",
    "firma", "przedsiębiorstwo", "gospodarka", "wzrost", "pkb", "recesja"
  ],
  "Technologia": [
    "smartfon", "komputer", "laptop", "procesor", "gpu", "intel", "amd", "nvidia",
    "apple", "iphone", "android", "samsung", "aplikacja", "oprogramowanie", "windows",
    "linux", "ai", "sztuczna inteligencja", "chatgpt", "robot", "dron", "elektryk",
    "tesla", "facebook", "google", "microsoft", "amazon", "twitter", "meta", "chip",
    "cyberbezpieczeństwo", "atak", "haker", "wirus", "malware", "ransomware", "phishing",
    "internet", "5g", "wifi", "bluetooth", "iot", "chmura", "cloud", "gaming", "gra",
    "konsola", "playstation", "xbox", "nvidia", "streaming", "youtube", "netflix"
  ],
  "Sport": [
    "mecz", "liga", "piłka", "football", "euro", "mundial", "mistrzostwo", "trening",
    "zawodnik", "sportowiec", "olimpiada", "medal", "złoto", "srebrny", "brązowy",
    "legia", "lech", "wisła", "górnik", "ekstraklasa", "reprezentacja", "kadra",
    "lewandowski", "siatkówka", "koszykówka", "tenis", "formuła", "f1", "rally",
    "boks", "mma", "ufc", "athlon", "maraton", "bieganie", "kolarstwo", "tour de france",
    "narciarstwo", "skoki", "mundial", "puchar", "champions league", "liga mistrzów"
  ],
  "Kultura": [
    "film", "kino", "oscar", "serial", "netflix", "aktor", "aktorka", "reżyser",
    "muzyka", "koncert", "festiwal", "album", "piosenka", "artysta", "muzyk",
    "książka", "literatura", "autor", "powieść", "poeta", "teatr", "spektakl",
    "wystawa", "galeria", "muzeum", "sztuka", "malarz", "rzeźba", "fotografia",
    "kultura", "kulturalny", "rozrywka", "nagroda", "nobel", "nike"
  ],
  "Zdrowie": [
    "covid", "koronawirus", "pandemia", "szczepionka", "wirus", "choroba", "lekarz",
    "szpital", "zdrowie", "pacjent", "nfz", "medycyna", "lek", "terapia", "badanie",
    "diagnoza", "operacja", "chirurg", "epidemia", "zakażenie", "kwarantanna"
  ],
  "Nauka": [
    "badanie", "naukowiec", "uniwersytet", "odkrycie", "eksperyment", "badacz",
    "nauka", "naukowy", "research", "profesor", "doktor", "studia", "edukacja",
    "fizyka", "chemia", "biologia", "matematyka", "astronomia", "kosmiczny", "nasa",
    "spacex", "mars", "księżyc", "satelita", "teleskop"
  ]
};

// Funkcja kategoryzacji artykułu na podstawie słów kluczowych
function categorizeArticle(article) {
  const title = article.title.toLowerCase();
  const categories = [];
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matches = keywords.filter(keyword => title.includes(keyword.toLowerCase()));
    if (matches.length > 0) {
      categories.push({ category, score: matches.length });
    }
  }
  
  // Sortuj według liczby dopasowań i zwróć najlepszą kategorię
  if (categories.length > 0) {
    categories.sort((a, b) => b.score - a.score);
    return categories[0].category;
  }
  
  return "Inne";
}

// ===== STATE =====
let allArticles = [];
let displayedArticles = [];
let selectedSources = new Set(); // Will be populated after loading articles
let selectedCategories = new Set(); // Will be populated with all categories initially
let searchTerm = '';
let savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];
let readArticles = JSON.parse(localStorage.getItem('readArticles')) || {};
let showingSaved = false;
let currentPage = 0;
const PAGE_SIZE = 30;

const ALL_CATEGORIES = ['Polityka', 'Finanse', 'Technologia', 'Sport', 'Kultura', 'Zdrowie', 'Nauka', 'Inne'];

// ===== THEME =====
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

function updateThemeIcon() {
  const icon = document.getElementById('themeIcon');
  const currentTheme = document.documentElement.getAttribute('data-theme');
  icon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
}

updateThemeIcon();

document.getElementById('themeToggle')?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon();
});

// ===== UTILITY FUNCTIONS =====
function decodeHtmlEntities(str) {
  if (!str) return '';
  // Security: Use textContent instead of innerHTML to prevent XSS
  const txt = document.createElement('textarea');
  txt.textContent = str;
  return txt.value;
}

function stripHtml(html) {
  if (!html) return '';
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}

// ===== SOURCE FILTERING =====
function populateSourceSelect() {
  const list = document.getElementById('sourcePanelList');
  if (!list) return;
  
  const searchInput = document.getElementById('sourceSearchInput');
  const searchValue = searchInput?.value.toLowerCase() || '';
  
  list.innerHTML = '';
  
  // Get actual sources from loaded articles (not from FEEDS config)
  const actualSources = [...new Set(allArticles.map(a => a.source))].sort();
  
  const filteredSources = searchValue 
    ? actualSources.filter(s => s && s.toLowerCase().includes(searchValue))
    : actualSources;
  
  // Create grid container
  const grid = document.createElement('div');
  grid.className = 'source-grid';
  
  filteredSources.forEach(source => {
    if (!source) return; // Skip empty sources
    
    const id = 'chk_' + source.replace(/[^a-z0-9]/gi, '_');
    
    // Create label element (entire row)
    const item = document.createElement('label');
    item.className = 'source-grid-item';
    item.htmlFor = id;
    
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = source;
    checkbox.id = id;
    checkbox.checked = selectedSources.has(source);
    
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        selectedSources.add(source);
      } else {
        selectedSources.delete(source);
      }
      updateSourceDropdownLabel();
      applyFilters();
    });
    
    // Label text
    const span = document.createElement('span');
    span.textContent = source;
    span.setAttribute('data-source', source);
    
    // Add checkbox first, then span
    item.appendChild(checkbox);
    item.appendChild(span);
    
    grid.appendChild(item);
  });
  
  list.appendChild(grid);
}

function updateSourceDropdownLabel() {
  const label = document.getElementById('sourceDropdownLabel');
  if (!label) return;
  
  // Count actual sources from articles
  const actualSources = [...new Set(allArticles.map(a => a.source))].filter(Boolean);
  const total = actualSources.length;
  const selected = selectedSources.size;
  
  if (selected === 0) {
    label.textContent = 'Brak źródeł';
  } else if (selected === total) {
    label.textContent = 'Wszystkie źródła';
  } else if (selected === 1) {
    label.textContent = Array.from(selectedSources)[0];
  } else {
    label.textContent = `Wybrano ${selected}`;
  }
}

// Source dropdown toggle
document.getElementById('sourceDropdown')?.addEventListener('click', (e) => {
  e.stopPropagation(); // Zatrzymaj propagację, żeby nie zamknąć panelu zaraz po otwarciu
  const panel = document.getElementById('sourcePanel');
  if (panel) {
    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';
  }
});

// Zatrzymaj propagację kliknięć w panelu (żeby nie zamykał się przy kliknięciu w środku)
document.getElementById('sourcePanel')?.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Zamknij panel przy kliknięciu gdziekolwiek poza nim
document.addEventListener('click', () => {
  const sourcePanel = document.getElementById('sourcePanel');
  const categoryPanel = document.getElementById('categoryPanel');
  if (sourcePanel) sourcePanel.style.display = 'none';
  if (categoryPanel) categoryPanel.style.display = 'none';
});

// Source search
document.getElementById('sourceSearchInput')?.addEventListener('input', populateSourceSelect);

// Select/Clear all
document.getElementById('selectAllBtn')?.addEventListener('click', () => {
  // Select all actual sources from loaded articles
  const actualSources = [...new Set(allArticles.map(a => a.source))].filter(Boolean);
  selectedSources = new Set(actualSources);
  populateSourceSelect();
  updateSourceDropdownLabel();
  applyFilters();
});

document.getElementById('clearAllBtn')?.addEventListener('click', () => {
  selectedSources.clear();
  populateSourceSelect();
  updateSourceDropdownLabel();
  applyFilters();
});

// ===== CATEGORY FILTER =====
// Category dropdown toggle
document.getElementById('categoryDropdown')?.addEventListener('click', (e) => {
  e.stopPropagation();
  const panel = document.getElementById('categoryPanel');
  if (panel) {
    const isVisible = panel.style.display === 'block';
    panel.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
      populateCategorySelect();
    }
  }
});

function populateCategorySelect() {
  const list = document.getElementById('categoryPanelList');
  if (!list) return;
  
  list.innerHTML = '';
  
  const grid = document.createElement('div');
  grid.className = 'source-grid';
  
  ALL_CATEGORIES.forEach(category => {
    const id = 'chk_cat_' + category.replace(/[^a-z0-9]/gi, '_');
    
    const item = document.createElement('label');
    item.className = 'source-grid-item';
    item.htmlFor = id;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = category;
    checkbox.id = id;
    checkbox.checked = selectedCategories.has(category);
    
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        selectedCategories.add(category);
      } else {
        selectedCategories.delete(category);
      }
      updateCategoryDropdownLabel();
      applyFilters();
    });
    
    const span = document.createElement('span');
    span.textContent = category;
    
    item.appendChild(checkbox);
    item.appendChild(span);
    
    grid.appendChild(item);
  });
  
  list.appendChild(grid);
}

function updateCategoryDropdownLabel() {
  const label = document.getElementById('categoryDropdownLabel');
  if (!label) return;
  
  if (selectedCategories.size === 0) {
    label.textContent = 'Kategorie (0)';
  } else if (selectedCategories.size === ALL_CATEGORIES.length) {
    label.textContent = 'Kategorie';
  } else {
    label.textContent = `Kategorie (${selectedCategories.size})`;
  }
}

// Select/Clear all categories
document.getElementById('selectAllCategoriesBtn')?.addEventListener('click', () => {
  selectedCategories = new Set(ALL_CATEGORIES);
  populateCategorySelect();
  updateCategoryDropdownLabel();
  applyFilters();
});

document.getElementById('clearAllCategoriesBtn')?.addEventListener('click', () => {
  selectedCategories.clear();
  populateCategorySelect();
  updateCategoryDropdownLabel();
  applyFilters();
});

// ===== SEARCH =====
document.getElementById('searchInput')?.addEventListener('input', (e) => {
  searchTerm = e.target.value.toLowerCase();
  applyFilters();
});

// ===== FILTERING =====
function applyFilters() {
  currentPage = 0;
  
  let filtered = showingSaved ? savedArticles : allArticles;
  
  // Filter by category (based on keywords in title)
  if (selectedCategories.size > 0 && selectedCategories.size < ALL_CATEGORIES.length) {
    filtered = filtered.filter(a => selectedCategories.has(categorizeArticle(a)));
  }
  
  // Filter by source
  if (selectedSources.size > 0 && selectedSources.size < new Set(allArticles.map(a => a.source)).size) {
    filtered = filtered.filter(a => selectedSources.has(a.source));
  }
  
  // Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(a => 
      (a.title && a.title.toLowerCase().includes(searchTerm)) ||
      (a.source && a.source.toLowerCase().includes(searchTerm))
    );
  }
  
  displayedArticles = filtered;
  renderArticles(true);
}

// ===== RENDERING =====
function createCard(article) {
  const card = document.createElement('article');
  card.className = 'card' + (readArticles[article.link] ? ' read' : '');
  
  // Three-dot menu button
  const menuBtn = document.createElement('button');
  menuBtn.className = 'article-menu-btn';
  menuBtn.innerHTML = '⋮';
  menuBtn.title = 'Opcje';
  menuBtn.onclick = (e) => {
    e.stopPropagation();
    toggleArticleMenu(article, menuBtn, card);
  };
  
  // Favicon from source URL
  const favicon = document.createElement('img');
  favicon.className = 'source-favicon';
  
  // Extract domain from article link for favicon (with error handling)
  try {
    const domain = new URL(article.link).hostname;
    favicon.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    favicon.alt = article.source;
    favicon.onerror = () => {
      // Fallback to generic icon if favicon fails to load
      favicon.style.display = 'none';
    };
  } catch (error) {
    // If URL is invalid, hide favicon
    console.warn('Invalid URL for favicon:', article.link);
    favicon.style.display = 'none';
  }
  
  // Content wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'card-inner';
  
  // Content
  const content = document.createElement('div');
  content.className = 'card-content';
  
  const title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = decodeHtmlEntities(article.title);
  
  const meta = document.createElement('div');
  meta.className = 'card-meta';
  const dateStr = article.pubDate ? new Date(article.pubDate).toLocaleString('pl-PL') : '';
  meta.textContent = `${article.source}${dateStr ? ' • ' + dateStr : ''}`;
  
  const readMore = document.createElement('a');
  readMore.href = article.link;
  readMore.className = 'read-more-btn';
  readMore.textContent = 'Czytaj artykuł →';
  readMore.target = '_blank';
  readMore.rel = 'noopener noreferrer';
  readMore.onclick = () => markAsRead(article.link, card);
  
  content.appendChild(title);
  content.appendChild(meta);
  content.appendChild(readMore);
  
  wrapper.appendChild(favicon);
  wrapper.appendChild(content);
  
  card.appendChild(wrapper);
  card.appendChild(menuBtn);
  
  // Handle middle click (open in background tab)
  card.addEventListener('mouseup', (e) => {
    if (e.target.closest('.article-menu-btn')) return;
    
    if (e.button === 1) { // Middle mouse button
      e.preventDefault();
      e.stopPropagation();
      markAsRead(article.link, card);
      
      // Create invisible link and simulate Ctrl+Click for background tab
      const tempLink = document.createElement('a');
      tempLink.href = article.link;
      tempLink.target = '_blank';
      tempLink.rel = 'noopener noreferrer';
      tempLink.style.position = 'absolute';
      tempLink.style.left = '-9999px';
      document.body.appendChild(tempLink);
      
      // Simulate Ctrl+Click which opens in background tab
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        ctrlKey: true,
        metaKey: true // For Mac
      });
      tempLink.dispatchEvent(clickEvent);
      
      setTimeout(() => document.body.removeChild(tempLink), 100);
      return false;
    }
  });
  
  // Make entire card clickable (except save button and links)
  card.addEventListener('click', (e) => {
    if (e.target.closest('a') || e.target.closest('.article-menu-btn')) return;
    if (e.button !== 0) return; // Only left click
    markAsRead(article.link, card);
    window.open(article.link, '_blank');
  });
  
  // Middle mouse button support (prevent text selection)
  card.addEventListener('mousedown', (e) => {
    if (e.button === 1 && !e.target.closest('.save-article-btn')) {
      e.preventDefault();
    }
  });
  
  card.addEventListener('mouseup', (e) => {
    if (e.target.closest('.save-article-btn') || e.target.closest('.read-more-btn')) return;
    
    if (e.button === 1) {
      e.preventDefault();
      e.stopPropagation();
      markAsRead(article.link, card);
      
      const tempLink = document.createElement('a');
      tempLink.href = article.link;
      tempLink.target = '_blank';
      tempLink.rel = 'noopener noreferrer';
      document.body.appendChild(tempLink);
      
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        ctrlKey: true
      });
      tempLink.dispatchEvent(clickEvent);
      document.body.removeChild(tempLink);
    }
  });
  
  return card;
}

// Toggle article menu (three dots)
function toggleArticleMenu(article, button, card) {
  // Close any existing menus
  document.querySelectorAll('.article-menu').forEach(m => m.remove());
  
  const menu = document.createElement('div');
  menu.className = 'article-menu';
  
  const isSaved = savedArticles.some(s => s.link === article.link);
  
  const saveOption = document.createElement('button');
  saveOption.className = 'article-menu-option';
  saveOption.innerHTML = isSaved ? '📌 Usuń z ulubionych' : '🔖 Dodaj do ulubionych';
  saveOption.onclick = (e) => {
    e.stopPropagation();
    toggleSaveArticle(article, button);
    menu.remove();
  };
  
  menu.appendChild(saveOption);
  
  // Position menu
  card.appendChild(menu);
  
  // Close menu when clicking outside
  setTimeout(() => {
    const closeMenu = (e) => {
      if (!menu.contains(e.target) && e.target !== button) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    };
    document.addEventListener('click', closeMenu);
  }, 0);
}

function renderArticles(reset = false) {
  const container = document.getElementById('articlesContainer');
  if (!container) return;
  
  if (reset) {
    container.innerHTML = '';
    currentPage = 0;
  }
  
  const start = currentPage * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const articlesToRender = displayedArticles.slice(start, end);
  
  articlesToRender.forEach(article => {
    container.appendChild(createCard(article));
  });
  
  currentPage++;
  
  // Show/hide spinner
  const spinner = document.getElementById('spinner');
  if (spinner) {
    spinner.style.display = end >= displayedArticles.length ? 'none' : 'block';
  }
}

// ===== SAVE FUNCTIONALITY =====
function toggleSaveArticle(article, button) {
  const index = savedArticles.findIndex(s => s.link === article.link);
  
  if (index > -1) {
    savedArticles.splice(index, 1);
    button.textContent = '🔖';
    button.classList.remove('saved');
    button.title = 'Zapisz na później';
  } else {
    savedArticles.push({
      ...article,
      savedAt: new Date().toISOString()
    });
    button.textContent = '📌';
    button.classList.add('saved');
    button.title = 'Usuń z zapisanych';
  }
  
  localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
  updateSavedCount();
  
  if (showingSaved) {
    applyFilters();
  }
}

function updateSavedCount() {
  const countEl = document.getElementById('savedCount');
  if (countEl) {
    countEl.textContent = savedArticles.length;
  }
}

function showSavedArticles() {
  showingSaved = true;
  document.getElementById('showSavedBtn')?.classList.add('active');
  applyFilters();
}

function showAllArticles() {
  showingSaved = false;
  document.getElementById('showSavedBtn')?.classList.remove('active');
  applyFilters();
}

document.getElementById('showSavedBtn')?.addEventListener('click', () => {
  if (showingSaved) {
    showAllArticles();
  } else {
    showSavedArticles();
  }
});

// ===== READ STATUS =====
function markAsRead(link, cardElement) {
  readArticles[link] = true;
  localStorage.setItem('readArticles', JSON.stringify(readArticles));
  if (cardElement) {
    cardElement.classList.add('read');
  }
}

// ===== DATA LOADING =====
async function loadArticles() {
  try {
    const response = await fetch(`articles.json?t=${Date.now()}`);
    const data = await response.json();
    
    allArticles = data.items || [];
    
    // Initialize selectedSources with actual sources from articles
    const actualSources = [...new Set(allArticles.map(a => a.source))].filter(Boolean);
    selectedSources = new Set(actualSources);
    
    // Initialize selectedCategories with all categories
    selectedCategories = new Set(ALL_CATEGORIES);
    
    // Update dropdowns
    populateSourceSelect();
    updateSourceDropdownLabel();
    updateCategoryDropdownLabel();
    
    // Update refresh time
    const refreshTime = document.getElementById('lastRefreshTime');
    const refreshStatus = document.getElementById('refreshStatus');
    if (refreshTime && data.generatedAt) {
      const date = new Date(data.generatedAt);
      refreshTime.textContent = date.toLocaleString('pl-PL');
      if (refreshStatus) refreshStatus.style.display = 'block';
    }
    
    applyFilters();
  } catch (error) {
    console.error('Error loading articles:', error);
    document.getElementById('articlesContainer').innerHTML = 
      '<p style="text-align:center;color:var(--text-secondary);padding:40px">Błąd ładowania artykułów</p>';
  }
}

// ===== INFINITE SCROLL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const currentDisplayed = currentPage * PAGE_SIZE;
      if (currentDisplayed < displayedArticles.length) {
        renderArticles(false);
      }
    }
  });
}, { threshold: 0.1 });

const sentinel = document.getElementById('infiniteSentinel');
if (sentinel) {
  observer.observe(sentinel);
}

// ===== INITIALIZATION =====
updateSavedCount();
loadArticles(); // This will populate sources after loading articles
