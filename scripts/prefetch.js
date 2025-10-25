const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');
const fs = require('fs').promises;
const he = require('he');
const iconv = require('iconv-lite');

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
  const allArticles = [];
  
  for (const [sourceName, feedUrl] of Object.entries(FEEDS)) {
    try {
      console.log(`Fetching: ${sourceName}`);
      const xmlText = await fetchText(feedUrl);
      const feedData = parseFeedXml(xmlText);
      const articles = extractArticles(feedData, sourceName);
      
      allArticles.push(...articles);
      console.log(`  ✓ ${sourceName}: ${articles.length} articles`);
    } catch (error) {
      console.error(`  ✗ ${sourceName}: ${error.message}`);
    }
  }
  
  // Sort by date (newest first)
  allArticles.sort((a, b) => {
    const dateA = new Date(a.pubDate || 0);
    const dateB = new Date(b.pubDate || 0);
    return dateB - dateA;
  });
  
  // Save to JSON
  const output = {
    generatedAt: new Date().toISOString(),
    items: allArticles
  };
  
  await fs.writeFile('articles.json', JSON.stringify(output, null, 2), 'utf-8');
  console.log(`\n✓ Saved ${allArticles.length} articles to articles.json`);
  console.log(`[${new Date().toISOString()}] Prefetch complete!`);
}

// Run
prefetchArticles().catch(console.error);
