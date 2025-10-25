# NewsHub Pro - Legal News Aggregator

## 🔒 100% Legal & Commercial-Ready

This news aggregator is **fully compliant with copyright law** and designed for commercial use.

### What makes it legal?

✅ **Links only** - No copyrighted content or images displayed  
✅ **Freedom to link** - Linking to public content is legally protected  
✅ **No scraping** - Uses official RSS feeds provided by publishers  
✅ **No reproduction** - Displays only titles and metadata from RSS  
✅ **Attribution** - Always shows source name and links back to original  

### What we DON'T do

❌ Copy article text or images  
❌ Reproduce copyrighted content  
❌ Display content without permission  
❌ Monetize others' copyrighted work  

---

## Features

- 🔍 **Search** - Filter articles by keyword
- 📂 **Source filtering** - Select specific news sources
- 🌙 **Dark mode** - Eye-friendly theme toggle
- 📌 **Save for later** - Bookmark articles locally
- 📱 **Fully responsive** - Works on all devices
- ⚡ **Auto-refresh** - GitHub Actions updates every 5 minutes
- 🖱️ **Middle-click support** - Open articles in background tabs

---

## How it works

1. **RSS feeds** - Fetches official RSS feeds from 36 Polish and international news sources
2. **Server-side processing** - Node.js script runs every 5 minutes via GitHub Actions
3. **Pre-generated JSON** - Articles saved to `articles.json` for instant loading
4. **Client-side filtering** - Fast search and filtering without backend
5. **Legal compliance** - Only displays titles and links (no content reproduction)

---

## Installation

### 1. Clone repository
```bash
git clone https://github.com/yourusername/News-web-commercial.git
cd News-web-commercial
```

### 2. Install dependencies
```bash
npm install
```

### 3. Generate articles
```bash
npm run prefetch
```

### 4. Open in browser
```bash
# Use Live Server extension in VS Code
# Or any static file server
```

---

## GitHub Actions Setup

The workflow automatically fetches new articles every 5 minutes:

1. Create GitHub repository
2. Push code to `main` branch
3. GitHub Actions will auto-run (see `.github/workflows/prefetch.yml`)
4. Articles update automatically every 5 minutes

---

## RSS Sources (36 total)

### Polish News (10)
- TVN24, Onet, Interia, Gazeta.pl, Wyborcza, Polsat News, Wp.pl, RMF24, Press.pl, Rzeczpospolita

### Technology (9)
- Spider's Web, Benchmark.pl, Antyweb, Komputerswiat.pl, Tabletowo, Android.com.pl, GeekWeek, Niebezpiecznik, Zaufana Trzecia Strona

### Business & Finance (4)
- Business Insider, Money.pl, Biznes.interia.pl, Stooq

### Media (2)
- Wirtualnemedia.pl, Media2.pl

### Politics (2)
- OKO.press, Krytyka Polityczna

### Culture (1)
- Interia Kultura

### Sports (1)
- Eurosport

### International (5)
- BBC News, The Guardian, Reuters, DW, Euronews

---

## Monetization Options

Since this aggregator is **100% legal**, you can:

✅ Display ads (Google AdSense, etc.)  
✅ Offer premium features (subscriptions)  
✅ Affiliate links  
✅ Sponsored content  
✅ Analytics tracking  

**No legal risk** - You're only linking to public content.

---

## License

MIT License - Free for commercial use

---

## Legal Disclaimer

This aggregator complies with:
- **EU Copyright Directive** (Article 15 - freedom to link)
- **Polish Copyright Law** (hyperlinks are not subject to copyright)
- **Freedom to link** principle (universal legal protection)

We do NOT:
- Copy or reproduce copyrighted text
- Display copyrighted images
- Claim ownership of linked content
- Bypass paywalls or access restrictions

All content belongs to original publishers. We only provide **links** to publicly available content.

---

## Technical Stack

- **Frontend**: Vanilla JavaScript, CSS Variables (dark mode)
- **Backend**: Node.js (prefetch script)
- **RSS Parsing**: fast-xml-parser
- **Automation**: GitHub Actions (cron schedule)
- **Hosting**: GitHub Pages compatible (static files only)

---

## Contributing

Feel free to:
- Add more RSS sources
- Improve UI/UX
- Report bugs
- Suggest features

---

## Contact

For business inquiries or legal questions, please open an issue.

---

**Built with respect for copyright law** ⚖️
