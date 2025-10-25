// ===== FEEDS CONFIGURATION =====
const FEEDS = {
  "TVN24": "https://tvn24.pl/najnowsze.xml",
  "Onet": "https://wiadomosci.onet.pl/rss/wiadomosci",
  "Interia": "https://fakty.interia.pl/feed",
  "Gazeta.pl": "https://rss.gazeta.pl/pub/rss/gazetapl_top.xml",
  "Wyborcza": "https://wyborcza.pl/0,0.xml?as=2&startsz=0",
  "Polsat News": "https://www.polsatnews.pl/rss/swiat.xml",
  "Wp.pl": "https://wiadomosci.wp.pl/ver,rss,rss.xml",
  "RMF24": "https://www.rmf24.pl/fakty/feed",
  "Press.pl": "https://www.press.pl/rss/press.xml",
  "Rzeczpospolita": "https://www.rp.pl/rss/1019-kraj",
  
  "Spider's Web": "https://www.spidersweb.pl/feed",
  "Benchmark.pl": "https://www.benchmark.pl/rss/ciezki_sprzet.xml",
  "Antyweb": "https://antyweb.pl/feed",
  "Komputerswiat.pl": "https://www.komputerswiat.pl/feed/artykuly",
  "Tabletowo": "https://www.tabletowo.pl/feed/",
  "Android.com.pl": "https://android.com.pl/feed",
  "GeekWeek": "https://geekweek.pl/feed/",
  "Niebezpiecznik": "https://niebezpiecznik.pl/feed/",
  "Zaufana Trzecia Strona": "https://zaufanatrzeciastrona.pl/feed/",
  
  "Business Insider": "https://businessinsider.com.pl/.feed",
  "Money.pl": "https://rss.money.pl/pl/wiadomosci/finanse/",
  "Biznes.interia.pl": "https://biznes.interia.pl/feed",
  "Stooq": "https://stooq.pl/feed/news/pl/",
  
  "Wirtualnemedia.pl": "https://www.wirtualnemedia.pl/rss/wirtualnemedia_rss.xml",
  "Media2.pl": "https://www.media2.pl/feed.xml",
  
  "OKO.press": "https://oko.press/feed/",
  "Krytyka Polityczna": "https://krytykapolityczna.pl/feed/",
  
  "Interia Kultura": "https://kultura.interia.pl/feed",
  
  "Eurosport": "https://www.eurosport.pl/rss.xml",
  
  "BBC News": "http://feeds.bbci.co.uk/news/world/rss.xml",
  "The Guardian": "https://www.theguardian.com/world/rss",
  "Reuters": "https://www.reutersagency.com/feed/",
  "DW": "https://rss.dw.com/xml/rss-en-all",
  "Euronews": "https://www.euronews.com/rss"
};

// ===== STATE =====
let allArticles = [];
let displayedArticles = [];
let selectedSources = new Set(Object.keys(FEEDS));
let searchTerm = '';
let savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];
let readArticles = JSON.parse(localStorage.getItem('readArticles')) || {};
let showingSaved = false;
let currentPage = 0;
const PAGE_SIZE = 30;

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
  
  const sortedSources = Object.keys(FEEDS).sort();
  const filteredSources = searchValue 
    ? sortedSources.filter(s => s.toLowerCase().includes(searchValue))
    : sortedSources;
  
  filteredSources.forEach(source => {
    const label = document.createElement('label');
    label.style.cssText = 'display:flex;align-items:center;padding:8px;cursor:pointer;user-select:none';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = source;
    checkbox.checked = selectedSources.has(source);
    checkbox.style.marginRight = '8px';
    
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        selectedSources.add(source);
      } else {
        selectedSources.delete(source);
      }
      updateSourceDropdownLabel();
      applyFilters();
    });
    
    const text = document.createTextNode(source);
    label.appendChild(checkbox);
    label.appendChild(text);
    list.appendChild(label);
  });
}

function updateSourceDropdownLabel() {
  const label = document.getElementById('sourceDropdownLabel');
  if (!label) return;
  
  const total = Object.keys(FEEDS).length;
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
document.getElementById('sourceDropdown')?.addEventListener('click', () => {
  const panel = document.getElementById('sourcePanel');
  if (panel) {
    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';
  }
});

// Source search
document.getElementById('sourceSearchInput')?.addEventListener('input', populateSourceSelect);

// Select/Clear all
document.getElementById('selectAllBtn')?.addEventListener('click', () => {
  selectedSources = new Set(Object.keys(FEEDS));
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

// ===== SEARCH =====
document.getElementById('searchInput')?.addEventListener('input', (e) => {
  searchTerm = e.target.value.toLowerCase();
  applyFilters();
});

// ===== FILTERING =====
function applyFilters() {
  currentPage = 0;
  
  let filtered = showingSaved ? savedArticles : allArticles;
  
  // Filter by source
  if (selectedSources.size < Object.keys(FEEDS).length) {
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
  
  // Save button
  const saveBtn = document.createElement('button');
  saveBtn.className = 'save-article-btn';
  const isSaved = savedArticles.some(s => s.link === article.link);
  saveBtn.textContent = isSaved ? '📌' : '🔖';
  if (isSaved) saveBtn.classList.add('saved');
  saveBtn.title = isSaved ? 'Usuń z zapisanych' : 'Zapisz na później';
  saveBtn.onclick = (e) => {
    e.stopPropagation();
    toggleSaveArticle(article, saveBtn);
  };
  
  // Favicon from source URL
  const favicon = document.createElement('img');
  favicon.className = 'source-favicon';
  // Extract domain from article link for favicon
  const domain = new URL(article.link).hostname;
  favicon.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  favicon.alt = article.source;
  favicon.onerror = () => {
    // Fallback to generic icon if favicon fails to load
    favicon.style.display = 'none';
  };
  
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
  card.appendChild(saveBtn);
  
  // Middle mouse button support
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
populateSourceSelect();
updateSourceDropdownLabel();
updateSavedCount();
loadArticles();
