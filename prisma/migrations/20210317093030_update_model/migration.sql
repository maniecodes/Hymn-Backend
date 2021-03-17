/*
  Warnings:

  - Made the column `title` on table `Hymn` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Hymn` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Song` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Song` required. The migration will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hymn" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Hymn" ("id", "title", "description", "imageUrl", "createdAt") SELECT "id", "title", "description", "imageUrl", "createdAt" FROM "Hymn";
DROP TABLE "Hymn";
ALTER TABLE "new_Hymn" RENAME TO "Hymn";
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "mp3Url" TEXT,
    "hymnId" INTEGER,
    "referain" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("hymnId") REFERENCES "Hymn" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Song" ("id", "title", "description", "pdfUrl", "mp3Url", "hymnId", "referain", "createdAt") SELECT "id", "title", "description", "pdfUrl", "mp3Url", "hymnId", "referain", "createdAt" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
CREATE UNIQUE INDEX "Song.hymnId_unique" ON "Song"("hymnId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
