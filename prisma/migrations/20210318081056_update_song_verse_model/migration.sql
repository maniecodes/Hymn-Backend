/*
  Warnings:

  - You are about to drop the `Wording` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `verseId` on the `Song` table. All the data in the column will be lost.
  - Added the required column `wording` to the `Verse` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Wording";
PRAGMA foreign_keys=on;

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
    "referain" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("hymnId") REFERENCES "Hymn" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Song" ("id", "number", "title", "description", "pdfUrl", "mp3Url", "hymnId", "referain", "createdAt") SELECT "id", "number", "title", "description", "pdfUrl", "mp3Url", "hymnId", "referain", "createdAt" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
CREATE TABLE "new_Verse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wording" TEXT NOT NULL,
    "songId" INTEGER NOT NULL,
    FOREIGN KEY ("songId") REFERENCES "Song" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Verse" ("id", "songId") SELECT "id", "songId" FROM "Verse";
DROP TABLE "Verse";
ALTER TABLE "new_Verse" RENAME TO "Verse";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
