/*
  Warnings:

  - A unique constraint covering the columns `[ID_Wearable]` on the table `Ubicacion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ubicacion_ID_Wearable_key" ON "Ubicacion"("ID_Wearable");
