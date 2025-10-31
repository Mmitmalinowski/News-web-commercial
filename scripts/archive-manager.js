const fs = require('fs').promises;
const path = require('path');

// Konfiguracja archiwizacji
const ARCHIVE_CONFIG = {
  // Ile miesięcy przechowywać aktywnie na stronie (oprócz bieżącego)
  ACTIVE_MONTHS: 1, // Przywrócone na 1 - bieżący + poprzedni miesiąc
  // Maksymalna liczba artykułów w pojedynczym pliku miesięcznym
  MAX_ARTICLES_PER_MONTH: 10000,
  // Katalog dla archiwów
  ARCHIVE_DIR: './archives'
};

/**
 * Zarządza archiwizacją artykułów w plikach miesięcznych
 */
class ArticleArchiveManager {
  constructor() {
    this.ensureArchiveDir();
  }

  async ensureArchiveDir() {
    try {
      await fs.access(ARCHIVE_CONFIG.ARCHIVE_DIR);
    } catch {
      await fs.mkdir(ARCHIVE_CONFIG.ARCHIVE_DIR, { recursive: true });
    }
  }

  /**
   * Pobiera klucz miesiąca w formacie YYYY-MM
   */
  getMonthKey(date = new Date()) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
  }

  /**
   * Pobiera ścieżkę do pliku archiwum dla danego miesiąca
   */
  getArchiveFilePath(monthKey) {
    return path.join(ARCHIVE_CONFIG.ARCHIVE_DIR, `articles-${monthKey}.json`);
  }

  /**
   * Ładuje archiwum dla danego miesiąca
   */
  async loadMonthlyArchive(monthKey) {
    const filePath = this.getArchiveFilePath(monthKey);
    
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Jeśli plik nie istnieje, zwróć pustą strukturę
      return {
        month: monthKey,
        generatedAt: new Date().toISOString(),
        items: []
      };
    }
  }

  /**
   * Zapisuje artykuły do archiwum miesięcznego
   */
  async saveMonthlyArchive(monthKey, articles) {
    const filePath = this.getArchiveFilePath(monthKey);
    
    const archiveData = {
      month: monthKey,
      generatedAt: new Date().toISOString(),
      items: articles.slice(0, ARCHIVE_CONFIG.MAX_ARTICLES_PER_MONTH) // Limit artykułów
    };

    await fs.writeFile(filePath, JSON.stringify(archiveData, null, 2), 'utf-8');
    console.log(`✓ Archived ${articles.length} articles to ${filePath}`);
    
    return archiveData;
  }

  /**
   * Dzieli artykuły według miesięcy
   */
  groupArticlesByMonth(articles) {
    const grouped = {};
    
    articles.forEach(article => {
      const date = article.pubDate ? new Date(article.pubDate) : new Date();
      const monthKey = this.getMonthKey(date);
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      
      grouped[monthKey].push(article);
    });
    
    return grouped;
  }

  /**
   * Archiwizuje nowe artykuły
   */
  async archiveArticles(newArticles) {
    console.log('📦 Starting archivization process...');
    
    // Grupuj artykuły według miesięcy
    const articlesByMonth = this.groupArticlesByMonth(newArticles);
    
    // Zapisz każdy miesiąc do osobnego pliku
    for (const [monthKey, articles] of Object.entries(articlesByMonth)) {
      // Załaduj istniejące archiwum
      const existingArchive = await this.loadMonthlyArchive(monthKey);
      
      // Scal z nowymi artykułami (unikaj duplikatów po URL)
      const existingUrls = new Set(existingArchive.items.map(a => a.link));
      const newUniqueArticles = articles.filter(a => !existingUrls.has(a.link));
      
      if (newUniqueArticles.length > 0) {
        const allArticles = [...existingArchive.items, ...newUniqueArticles]
          .sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0)); // Sortuj od najnowszych
        
        await this.saveMonthlyArchive(monthKey, allArticles);
      } else {
        console.log(`  → No new articles for ${monthKey}`);
      }
    }
  }

  /**
   * Ładuje artykuły z aktywnych miesięcy (obecny + poprzednie według konfiguracji)
   */
  async loadActiveArticles() {
    console.log('📰 Loading active articles...');
    
    const now = new Date();
    const activeMonths = [];
    
    // Dodaj bieżący miesiąc i poprzednie
    for (let i = 0; i <= ARCHIVE_CONFIG.ACTIVE_MONTHS; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      activeMonths.push(this.getMonthKey(date));
    }
    
    console.log(`  → Loading months: ${activeMonths.join(', ')}`);
    
    const allArticles = [];
    
    // Załaduj artykuły z każdego aktywnego miesiąca
    for (const monthKey of activeMonths) {
      const archive = await this.loadMonthlyArchive(monthKey);
      allArticles.push(...archive.items);
      console.log(`  → ${monthKey}: ${archive.items.length} articles`);
    }
    
    // Sortuj wszystkie artykuły od najnowszych
    allArticles.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));
    
    return {
      generatedAt: new Date().toISOString(),
      items: allArticles,
      totalArticles: allArticles.length,
      activeMonths: activeMonths
    };
  }

  /**
   * Czyści stare archiwa (starsze niż określony czas)
   */
  async cleanOldArchives(keepMonths = 6) {
    console.log('🧹 Cleaning old archives...');
    
    try {
      const files = await fs.readdir(ARCHIVE_CONFIG.ARCHIVE_DIR);
      const now = new Date();
      const cutoffDate = new Date(now.getFullYear(), now.getMonth() - keepMonths, 1);
      
      for (const file of files) {
        if (!file.startsWith('articles-') || !file.endsWith('.json')) {
          continue;
        }
        
        // Wyciągnij datę z nazwy pliku (articles-YYYY-MM.json)
        const match = file.match(/articles-(\d{4})-(\d{2})\.json/);
        if (!match) continue;
        
        const year = parseInt(match[1]);
        const month = parseInt(match[2]) - 1; // JavaScript months are 0-indexed
        const fileDate = new Date(year, month, 1);
        
        if (fileDate < cutoffDate) {
          const filePath = path.join(ARCHIVE_CONFIG.ARCHIVE_DIR, file);
          await fs.unlink(filePath);
          console.log(`  ✗ Deleted old archive: ${file}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning archives:', error);
    }
  }

  /**
   * Zwraca statystyki archiwów
   */
  async getArchiveStats() {
    try {
      const files = await fs.readdir(ARCHIVE_CONFIG.ARCHIVE_DIR);
      const archives = [];
      let totalArticles = 0;
      
      for (const file of files) {
        if (file.startsWith('articles-') && file.endsWith('.json')) {
          const monthKey = file.replace('articles-', '').replace('.json', '');
          const archive = await this.loadMonthlyArchive(monthKey);
          
          archives.push({
            month: monthKey,
            articleCount: archive.items.length,
            lastUpdated: archive.generatedAt
          });
          
          totalArticles += archive.items.length;
        }
      }
      
      return {
        totalArchives: archives.length,
        totalArticles: totalArticles,
        archives: archives.sort((a, b) => b.month.localeCompare(a.month))
      };
    } catch (error) {
      return { totalArchives: 0, totalArticles: 0, archives: [] };
    }
  }
}

module.exports = ArticleArchiveManager;