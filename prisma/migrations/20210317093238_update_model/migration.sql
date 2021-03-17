/*
  Warnings:

  - Made the column `hymnId` on table `Song` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `songId` on table `Verse` required. The migration will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "mp3Url" TEXT,
    "hymnId" INTEGER NOT NULL,
    "referain" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("hymnId") REFERENCES "Hymn" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Song" ("id", "title", "description", "pdfUrl", "mp3Url", "hymnId", "referain", "createdAt") SELECT "id", "title", "description", "pdfUrl", "mp3Url", "hymnId", "referain", "createdAt" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
CREATE UNIQUE INDEX "Song.hymnId_unique" ON "Song"("hymnId");
CREATE TABLE "new_Verse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wording" TEXT NOT NULL,
    "songId" INTEGER NOT NULL,
    FOREIGN KEY ("songId") REFERENCES "Song" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Verse" ("id", "wording", "songId") SELECT "id", "wording", "songId" FROM "Verse";
DROP TABLE "Verse";
ALTER TABLE "new_Verse" RENAME TO "Verse";
CREATE UNIQUE INDEX "Verse.songId_unique" ON "Verse"("songId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
