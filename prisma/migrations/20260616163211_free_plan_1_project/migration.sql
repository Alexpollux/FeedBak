-- AlterTable
ALTER TABLE "User" ALTER COLUMN "projectLimit" SET DEFAULT 1;

-- Mettre à jour les utilisateurs FREE existants qui ont encore 0 projet autorisé
UPDATE "User" SET "projectLimit" = 1 WHERE "plan" = 'FREE' AND "projectLimit" = 0;
