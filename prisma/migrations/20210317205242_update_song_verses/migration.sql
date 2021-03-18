-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "mp3Url" TEXT,
    "hymnId" INTEGER NOT NULL,
    "verseId" INTEGER,
    "referain" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("hymnId") REFERENCES "Hymn" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Song" ("id", "number", "title", "description", "pdfUrl", "mp3Url", "hymnId", "verseId", "referain", "createdAt") SELECT "id", "number", "title", "description", "pdfUrl", "mp3Url", "hymnId", "verseId", "referain", "createdAt" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
