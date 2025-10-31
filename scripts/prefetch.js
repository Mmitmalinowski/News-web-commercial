const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');
const fs = require('fs').promises;
const he = require('he');
const iconv = require('iconv-lite');
const ArticleArchiveManager = require('./archive-manager');

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

// ===== FETCH WITH ENCODING SUPPORT =====
async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  const buffer = await response.buffer();
  const contentType = response.headers.get('content-type') || '';
  
  // Try windows-1250 for Polish sites
  if (contentType.includes('windows-1250')) {
    return iconv.decode(buffer, 'windows-1250');
  }
  
  // Default UTF-8
  return buffer.toString('utf-8');
}

// ===== PARSE RSS/ATOM FEED =====
function parseFeedXml(xmlText) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text'
  });
  
  return parser.parse(xmlText);
}

// ===== EXTRACT ARTICLES FROM FEED =====
function extractArticles(feedData, sourceName) {
  const articles = [];
  
  // RSS 2.0
  if (feedData.rss && feedData.rss.channel) {
    const items = feedData.rss.channel.item || [];
    const itemsArray = Array.isArray(items) ? items : [items];
    
    itemsArray.forEach(item => {
      articles.push({
        title: he.decode(item.title || ''),
        link: item.link || item.guid?.['#text'] || item.guid || '',
        pubDate: item.pubDate || item['dc:date'] || '',
        source: sourceName
      });
    });
  }
  
  // Atom
  if (feedData.feed && feedData.feed.entry) {
    const entries = Array.isArray(feedData.feed.entry) 
      ? feedData.feed.entry 
      : [feedData.feed.entry];
    
    entries.forEach(entry => {
      const link = entry.link?.['@_href'] || entry.link || '';
      articles.push({
        title: he.decode(entry.title?.['#text'] || entry.title || ''),
        link: link,
        pubDate: entry.updated || entry.published || '',
        source: sourceName
      });
    });
  }
  
  return articles;
}

// ===== MAIN FUNCTION =====
async function prefetchArticles() {
  console.log(`[${new Date().toISOString()}] Starting prefetch...`);
  const archiveManager = new ArticleArchiveManager();
  const freshArticles = [];
  
  // Pobierz świeże artykuły z RSS
  for (const [sourceName, feedUrl] of Object.entries(FEEDS)) {
    try {
      console.log(`Fetching: ${sourceName}`);
      const xmlText = await fetchText(feedUrl);
      const feedData = parseFeedXml(xmlText);
      const articles = extractArticles(feedData, sourceName);
      
      freshArticles.push(...articles);
      console.log(`  ✓ ${sourceName}: ${articles.length} articles`);
    } catch (error) {
      console.error(`  ✗ ${sourceName}: ${error.message}`);
    }
  }
  
  // Archiwizuj nowe artykuły
  if (freshArticles.length > 0) {
    await archiveManager.archiveArticles(freshArticles);
  }
  
  // Załaduj aktywne artykuły (z obecnego i poprzednich miesięcy)
  const activeArticlesData = await archiveManager.loadActiveArticles();
  
  // Zapisz główny plik articles.json z aktywnymi artykułami
  await fs.writeFile('articles.json', JSON.stringify(activeArticlesData, null, 2), 'utf-8');
  
  // Wyświetl statystyki
  const stats = await archiveManager.getArchiveStats();
  console.log(`\n📊 Archive Statistics:`);
  console.log(`  → Total archives: ${stats.totalArchives}`);
  console.log(`  → Total articles in all archives: ${stats.totalArticles}`);
  console.log(`  → Active articles in main feed: ${activeArticlesData.items.length}`);
  
  // Oczyść stare archiwa (zostaw ostatnie 6 miesięcy + aktywne)
  await archiveManager.cleanOldArchives(6);
  
  console.log(`\n✓ Prefetch complete! Active articles: ${activeArticlesData.items.length}`);
  console.log(`[${new Date().toISOString()}] Process finished.`);
}

// Run
prefetchArticles().catch(console.error);
