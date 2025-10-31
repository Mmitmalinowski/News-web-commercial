// Archive Configuration Example
// Kopiuj ten plik do `archive-config.js` i dostosuj ustawienia

module.exports = {
  // Ile miesięcy przechowywać aktywnie na stronie (oprócz bieżącego)
  ACTIVE_MONTHS: 1,
  
  // Maksymalna liczba artykułów w pojedynczym pliku miesięcznym
  MAX_ARTICLES_PER_MONTH: 10000,
  
  // Katalog dla archiwów (relatywny do głównego katalogu)
  ARCHIVE_DIR: './archives',
  
  // Ile miesięcy przechowywać przed automatycznym usunięciem
  KEEP_MONTHS: 6,
  
  // Czy włączyć automatyczne czyszczenie podczas prefetch
  AUTO_CLEANUP: true,
  
  // Czy dodawać datę utworzenia archiwum do metadanych
  ADD_CREATION_DATE: true,
  
  // Maksymalny rozmiar pojedynczego pliku archiwum (MB)
  MAX_FILE_SIZE_MB: 50,
  
  // Format nazw plików archiwów
  FILENAME_FORMAT: 'articles-{YYYY}-{MM}.json',
  
  // Czy kompresować archiwa starsze niż X miesięcy
  COMPRESS_AFTER_MONTHS: 3,
  
  // Poziom kompresji (0-9, gdzie 9 to najwyższa kompresja)
  COMPRESSION_LEVEL: 6
};