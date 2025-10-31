/**
 * Archive Manager dla strony - ładowanie starszych artykułów
 */
class WebArchiveManager {
  constructor() {
    this.availableMonths = [];
    this.loadedMonths = new Set();
    this.nextMonthToLoad = 2; // Zaczynamy od 3. miesiąca wstecz (0=current, 1=previous, 2=3rd month back)
  }

  /**
   * Pobiera listę dostępnych archiwów
   */
  async getAvailableArchives() {
    try {
      // Pobierz listę dostępnych plików archiwów
      const response = await fetch('scripts/list-archives.php');
      if (!response.ok) {
        throw new Error('Could not fetch archive list');
      }
      
      const archives = await response.json();
      this.availableMonths = archives.map(a => a.month).sort().reverse();
      return this.availableMonths;
      
    } catch (error) {
      console.warn('Could not load archive list, using fallback method');
      return this.generateRecentMonths();
    }
  }

  /**
   * Generuje listę ostatnich miesięcy jako fallback
   */
  generateRecentMonths() {
    const months = [];
    const now = new Date();
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
      months.push(monthKey);
    }
    
    return months;
  }

  /**
   * Ładuje artykuły z konkretnego miesiąca
   */
  async loadMonthArchive(monthKey) {
    if (this.loadedMonths.has(monthKey)) {
      console.log(`Month ${monthKey} already loaded`);
      return [];
    }

    try {
      const response = await fetch(`archives/articles-${monthKey}.json?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`Archive for ${monthKey} not found`);
      }

      const data = await response.json();
      this.loadedMonths.add(monthKey);
      
      console.log(`✓ Loaded ${data.items.length} articles from ${monthKey}`);
      return data.items || [];
      
    } catch (error) {
      console.warn(`Could not load archive for ${monthKey}:`, error.message);
      return [];
    }
  }

  /**
   * Ładuje artykuły z wielu miesięcy
   */
  async loadMultipleMonths(monthKeys) {
    const allArticles = [];
    
    for (const monthKey of monthKeys) {
      const articles = await this.loadMonthArchive(monthKey);
      allArticles.push(...articles);
    }
    
    // Sortuj od najnowszych
    allArticles.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));
    
    return allArticles;
  }

  /**
   * Formatuje klucz miesiąca na czytelną datę
   */
  formatMonthKey(monthKey) {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('pl-PL', { year: 'numeric', month: 'long' });
  }

  /**
   * Sprawdza czy dany miesiąc jest już załadowany
   */
  isMonthLoaded(monthKey) {
    return this.loadedMonths.has(monthKey);
  }

  /**
   * Resetuje stan załadowanych miesięcy
   */
  reset() {
    this.loadedMonths.clear();
    this.nextMonthToLoad = 2; // Reset do 3. miesiąca wstecz
  }

  /**
   * Ładuje kolejny miesiąc w chronologii (automatycznie następny starszy)
   */
  async loadNextMonth() {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() - this.nextMonthToLoad, 1);
    const monthKey = this.formatMonthKeyFromDate(targetDate);
    
    console.log(`Loading next month: ${monthKey} (${this.nextMonthToLoad} months back)`);
    
    const articles = await this.loadMonthArchive(monthKey);
    
    if (articles.length > 0) {
      this.nextMonthToLoad++; // Przygotuj następny miesiąc do załadowania
      return { monthKey, articles, hasMore: this.nextMonthToLoad < 12 }; // Limit 12 miesięcy wstecz
    } else {
      // Spróbuj następny miesiąc jeśli obecny jest pusty
      this.nextMonthToLoad++;
      if (this.nextMonthToLoad < 12) {
        return this.loadNextMonth();
      } else {
        return { monthKey, articles: [], hasMore: false };
      }
    }
  }

  /**
   * Formatuje datę na klucz miesiąca
   */
  formatMonthKeyFromDate(date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
  }

  /**
   * Sprawdza czy są jeszcze miesiące do załadowania
   */
  hasMoreMonths() {
    return this.nextMonthToLoad < 12;
  }
}

// Globalna instancja managera archiwów
const webArchiveManager = new WebArchiveManager();

/**
 * Inicjalizuje interfejs archiwów na stronie
 */
async function initializeArchiveInterface() {
  // Dodaj przycisk "Załaduj starsze artykuły"
  const controlsContainer = document.querySelector('.controls-container') || 
                           document.querySelector('.filters-row') ||
                           document.querySelector('header');
  
  if (!controlsContainer) {
    console.warn('Could not find controls container for archive interface');
    return;
  }

  // Utwórz sekcję na dole strony dla przycisku
  const bottomSection = document.createElement('div');
  bottomSection.id = 'bottomControls';
  bottomSection.className = 'bottom-controls';
  bottomSection.innerHTML = `
    <div class="archive-controls">
      <button id="loadMoreBtn" class="archive-btn">
        📚 Załaduj starsze artykuły
      </button>
      <div id="archiveStatus" class="archive-status" style="display: none;">
        <span id="archiveStatusText">Załadowano: brak</span>
      </div>
    </div>
  `;

  // Znajdź kontener artykułów i dodaj przyciski po nim
  const articlesContainer = document.getElementById('articlesContainer');
  if (articlesContainer && articlesContainer.parentNode) {
    articlesContainer.parentNode.appendChild(bottomSection);
  }

  // Utwórz przycisk scroll to top
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.id = 'scrollTopBtn';
  scrollTopBtn.className = 'scroll-top-btn';
  scrollTopBtn.innerHTML = '↑';
  scrollTopBtn.title = 'Przewiń do góry';
  document.body.appendChild(scrollTopBtn);

  // Dodaj CSS dla nowego interfejsu
  const archiveStyles = document.createElement('style');
  archiveStyles.textContent = `
    /* Bottom controls - proste przeniesienie oryginalnego stylu */
    .bottom-controls {
      padding: 20px;
      text-align: center;
      margin-top: 20px;
    }

    .archive-controls {
      display: inline-block;
    }

    .archive-btn {
      background: var(--primary-color, #2196F3);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    .archive-btn:hover:not(:disabled) {
      background: var(--primary-dark, #1976D2);
    }

    .archive-btn:disabled {
      background: var(--bg-secondary, #ccc);
      cursor: not-allowed;
      opacity: 0.6;
    }

    .archive-status {
      margin-left: 10px;
      font-size: 12px;
      color: var(--text-secondary, #666);
      display: inline-flex;
      align-items: center;
    }

    /* Scroll to top button */
    .scroll-top-btn {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: var(--primary-color, #2196F3);
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      opacity: 0;
      visibility: hidden;
      z-index: 1000;
    }

    .scroll-top-btn.visible {
      opacity: 1;
      visibility: visible;
    }

    .scroll-top-btn:hover {
      background: var(--primary-dark, #1976D2);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      .scroll-top-btn {
        width: 45px;
        height: 45px;
        bottom: 20px;
        right: 20px;
        font-size: 18px;
      }
    }
  `;
  
  document.head.appendChild(archiveStyles);
  // Sekcja archiwów jest teraz dodawana bezpośrednio do DOM

  // Inicjalizuj event listenery
  setupArchiveEventListeners();
}

/**
 * Ustawia event listenery dla interfejsu archiwów
 */
function setupArchiveEventListeners() {
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const statusEl = document.getElementById('archiveStatus');
  const statusTextEl = document.getElementById('archiveStatusText');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  // Load more archives
  loadMoreBtn?.addEventListener('click', async () => {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = '⏳ Ładowanie...';
    
    try {
      const result = await webArchiveManager.loadNextMonth();
      
      if (result.articles.length > 0) {
        // Dodaj artykuły do głównej listy
        if (typeof allArticles !== 'undefined') {
          allArticles.push(...result.articles);
          
          // Sortuj wszystkie artykuły
          allArticles.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));
          
          // Odśwież wyświetlanie
          if (typeof applyFilters === 'function') {
            applyFilters();
          }
        }
        
        // Aktualizuj status
        const monthName = webArchiveManager.formatMonthKey(result.monthKey);
        statusTextEl.textContent = `Ostatnio załadowano: ${monthName} (+${result.articles.length} artykułów)`;
        statusEl.style.display = 'inline-block';
        
        loadMoreBtn.textContent = result.hasMore ? '📚 Załaduj jeszcze starsze' : '📚 Brak starszych archiwów';
        loadMoreBtn.disabled = !result.hasMore;
        
        console.log(`✓ Loaded ${result.articles.length} articles from ${result.monthKey}`);
        
      } else {
        statusTextEl.textContent = `${webArchiveManager.formatMonthKey(result.monthKey)}: brak artykułów`;
        statusEl.style.display = 'inline-block';
        loadMoreBtn.textContent = result.hasMore ? '📚 Załaduj jeszcze starsze' : '📚 Brak starszych archiwów';
        loadMoreBtn.disabled = !result.hasMore;
      }
      
    } catch (error) {
      console.error('Error loading more archives:', error);
      loadMoreBtn.textContent = '❌ Błąd ładowania';
      setTimeout(() => {
        loadMoreBtn.textContent = '📚 Załaduj starsze artykuły';
        loadMoreBtn.disabled = false;
      }, 2000);
    }
  });

  // Scroll to top button
  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Show/hide scroll to top button based on scroll position
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (window.scrollY > 300) {
        scrollTopBtn?.classList.add('visible');
      } else {
        scrollTopBtn?.classList.remove('visible');
      }
    }, 10);
  });
}

// Usunięte - przywrócono prostotę interfejsu

// Usunięte niepotrzebne funkcje - teraz używamy prostego przycisku "Załaduj więcej"

// Auto-inicjalizacja gdy DOM jest gotowy
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeArchiveInterface);
} else {
  initializeArchiveInterface();
}