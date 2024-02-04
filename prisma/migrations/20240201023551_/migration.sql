-- AlterTable
ALTER TABLE "Pengaduan" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Tanggapan" (
    "id" TEXT NOT NULL,
    "penggunaId" TEXT NOT NULL,
    "pengaduanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tanggapan_id_key" ON "Tanggapan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Tanggapan_pengaduanId_key" ON "Tanggapan"("pengaduanId");

-- AddForeignKey
ALTER TABLE "Tanggapan" ADD CONSTRAINT "Tanggapan_penggunaId_fkey" FOREIGN KEY ("penggunaId") REFERENCES "Pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tanggapan" ADD CONSTRAINT "Tanggapan_pengaduanId_fkey" FOREIGN KEY ("pengaduanId") REFERENCES "Pengaduan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
