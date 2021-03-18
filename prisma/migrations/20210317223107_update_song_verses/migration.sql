/*
  Warnings:

  - You are about to drop the `VerseTitle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VerseTitle";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Wording" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "verseId" INTEGER NOT NULL,
    FOREIGN KEY ("verseId") REFERENCES "Verse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
