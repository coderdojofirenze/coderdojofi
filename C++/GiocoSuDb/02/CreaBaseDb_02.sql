SELECT * FROM sqlite_master
CREATE TABLE IF NOT EXISTS "main"."luogo" ("IDluogo" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL  UNIQUE, "Nome" TEXT, "Descrizione" TEXT)
CREATE TABLE IF NOT EXISTS "main"."entra_esci" ("Provenienza" INTEGER, "Destinazione" INTEGER, "Descrizione" TEXT)
