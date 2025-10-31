#!/usr/bin/env node

const ArticleArchiveManager = require('./archive-manager');
const fs = require('fs').promises;

async function showHelp() {
  console.log(`
📰 Article Archive Manager

Usage:
  node archive-cli.js [command] [options]

Commands:
  stats                    - Show archive statistics
  list [month]            - List articles from specific month (YYYY-MM)
  search <query> [month]  - Search articles by title
  export <month>          - Export month archive to JSON
  clean [months]          - Clean archives older than N months (default: 6)
  migrate                 - Migrate current articles.json to archive

Examples:
  node archive-cli.js stats
  node archive-cli.js list 2025-10
  node archive-cli.js search "JavaScript" 2025-10
  node archive-cli.js export 2025-09
  node archive-cli.js clean 3
`);
}

async function showStats() {
  const manager = new ArticleArchiveManager();
  const stats = await manager.getArchiveStats();
  
  console.log('📊 Archive Statistics\n');
  console.log(`Total archives: ${stats.totalArchives}`);
  console.log(`Total articles: ${stats.totalArticles}`);
  console.log();
  
  if (stats.archives.length > 0) {
    console.log('Monthly breakdown:');
    stats.archives.forEach(archive => {
      const date = new Date(archive.lastUpdated);
      console.log(`  ${archive.month}: ${archive.articleCount} articles (updated: ${date.toLocaleString('pl-PL')})`);
    });
  }
}

async function listArticles(monthKey) {
  if (!monthKey) {
    console.error('❌ Please provide month in format YYYY-MM');
    return;
  }
  
  const manager = new ArticleArchiveManager();
  const archive = await manager.loadMonthlyArchive(monthKey);
  
  console.log(`📖 Articles from ${monthKey}\n`);
  
  if (archive.items.length === 0) {
    console.log('No articles found for this month.');
    return;
  }
  
  archive.items.forEach((article, index) => {
    const date = article.pubDate ? new Date(article.pubDate).toLocaleDateString('pl-PL') : 'No date';
    console.log(`${index + 1}. [${article.source}] ${article.title}`);
    console.log(`   ${date} - ${article.link}`);
    console.log();
  });
  
  console.log(`Total: ${archive.items.length} articles`);
}

async function searchArticles(query, monthKey) {
  if (!query) {
    console.error('❌ Please provide search query');
    return;
  }
  
  const manager = new ArticleArchiveManager();
  const searchLower = query.toLowerCase();
  
  if (monthKey) {
    // Search in specific month
    const archive = await manager.loadMonthlyArchive(monthKey);
    const matches = archive.items.filter(article => 
      article.title.toLowerCase().includes(searchLower) ||
      article.source.toLowerCase().includes(searchLower)
    );
    
    console.log(`🔍 Search results for "${query}" in ${monthKey}\n`);
    
    matches.forEach((article, index) => {
      const date = article.pubDate ? new Date(article.pubDate).toLocaleDateString('pl-PL') : 'No date';
      console.log(`${index + 1}. [${article.source}] ${article.title}`);
      console.log(`   ${date} - ${article.link}`);
      console.log();
    });
    
    console.log(`Found ${matches.length} matches in ${archive.items.length} articles`);
  } else {
    // Search in all archives
    const stats = await manager.getArchiveStats();
    let totalMatches = 0;
    
    console.log(`🔍 Search results for "${query}" in all archives\n`);
    
    for (const archiveInfo of stats.archives) {
      const archive = await manager.loadMonthlyArchive(archiveInfo.month);
      const matches = archive.items.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.source.toLowerCase().includes(searchLower)
      );
      
      if (matches.length > 0) {
        console.log(`📅 ${archiveInfo.month} (${matches.length} matches):`);
        matches.slice(0, 5).forEach((article, index) => { // Show only first 5
          const date = article.pubDate ? new Date(article.pubDate).toLocaleDateString('pl-PL') : 'No date';
          console.log(`  ${index + 1}. [${article.source}] ${article.title}`);
        });
        if (matches.length > 5) {
          console.log(`  ... and ${matches.length - 5} more`);
        }
        console.log();
        totalMatches += matches.length;
      }
    }
    
    console.log(`Total matches: ${totalMatches}`);
  }
}

async function exportMonth(monthKey) {
  if (!monthKey) {
    console.error('❌ Please provide month in format YYYY-MM');
    return;
  }
  
  const manager = new ArticleArchiveManager();
  const archive = await manager.loadMonthlyArchive(monthKey);
  
  const filename = `export-${monthKey}.json`;
  await fs.writeFile(filename, JSON.stringify(archive, null, 2), 'utf-8');
  
  console.log(`✓ Exported ${archive.items.length} articles from ${monthKey} to ${filename}`);
}

async function cleanArchives(monthsToKeep) {
  const keepMonths = monthsToKeep ? parseInt(monthsToKeep) : 6;
  
  if (isNaN(keepMonths) || keepMonths < 1) {
    console.error('❌ Invalid number of months to keep');
    return;
  }
  
  console.log(`🧹 Cleaning archives older than ${keepMonths} months...`);
  
  const manager = new ArticleArchiveManager();
  await manager.cleanOldArchives(keepMonths);
  
  console.log('✓ Archive cleanup completed');
}

async function migrateCurrentArchive() {
  console.log('📦 Migrating current articles.json to archive...');
  
  try {
    // Załaduj obecny plik articles.json
    const data = await fs.readFile('articles.json', 'utf-8');
    const articles = JSON.parse(data);
    
    if (!articles.items || articles.items.length === 0) {
      console.log('❌ No articles found in articles.json');
      return;
    }
    
    // Archiwizuj artykuły
    const manager = new ArticleArchiveManager();
    await manager.archiveArticles(articles.items);
    
    // Wygeneruj nowy plik articles.json z aktywnymi artykułami
    const activeData = await manager.loadActiveArticles();
    await fs.writeFile('articles.json', JSON.stringify(activeData, null, 2), 'utf-8');
    
    console.log(`✓ Migration completed. Archived ${articles.items.length} articles`);
    console.log(`✓ New articles.json contains ${activeData.items.length} active articles`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  }
}

// Main execution
async function main() {
  const command = process.argv[2];
  const arg1 = process.argv[3];
  const arg2 = process.argv[4];
  
  try {
    switch (command) {
      case 'stats':
        await showStats();
        break;
      case 'list':
        await listArticles(arg1);
        break;
      case 'search':
        await searchArticles(arg1, arg2);
        break;
      case 'export':
        await exportMonth(arg1);
        break;
      case 'clean':
        await cleanArchives(arg1);
        break;
      case 'migrate':
        await migrateCurrentArchive();
        break;
      case 'help':
      case '--help':
      case '-h':
        await showHelp();
        break;
      default:
        console.log('❌ Unknown command. Use "help" for available commands.');
        await showHelp();
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  showStats,
  listArticles,
  searchArticles,
  exportMonth,
  cleanArchives,
  migrateCurrentArchive
};