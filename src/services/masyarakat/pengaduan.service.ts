import { PrismaClient } from "@prisma/client";

export default class PengaduanService {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async create(body: { judul: string, deskripsi: string, foto: string, kategoriId: string, penggunaId: string }) {
        const pengaduan = await this.prismaClient.pengaduan.create({
            data: {
                judul: body.judul,
                deskripsi: body.deskripsi,
                foto: body.foto,
                kategoriId: body.kategoriId,
                penggunaId: body.penggunaId,
            },
            include: {
                Pengguna: {
                    select: {
                        id: true,
                        nama: true,
                        email: true,
                    }
                },
                Kategori: {
                    select: {
                        id: true,
                        nama: true,
                    }
                }
            }
        });

        if (!pengaduan) return null;

        return pengaduan;
    }

    async update(id: string, body: { judul?: string, deskripsi?: string, foto?: string, kategoriId?: string }) {
        const findPengaduan = await this.findPengaduan(id);
        if (!findPengaduan) return null;

        const updatePengaduan = await this.prismaClient.pengaduan.update({
            data: body,
            where: {
                id: id,
            },
            include: {
                Pengguna: {
                    select: {
                        id: true,
                        nama: true,
                        email: true,
                    }
                },
                Kategori: {
                    select: {
                        id: true,
                        nama: true,
                    }
                }
            }
        });
        if (!updatePengaduan) return null;

        return updatePengaduan;
    }

    async delete(id: string) {
        const findPengaduan = await this.findPengaduan(id);
        if (!findPengaduan) return null;

        const deletePengaduan = await this.prismaClient.pengaduan.delete({
            where: {
                id: id,
            }
        });
        if (!deletePengaduan) return null;

        return true;
    }

    async findPengaduan(id: string) {
        const pengaduan = await this.prismaClient.pengaduan.findUnique({
            where: {
                id: id
            },
            include: {
                Pengguna: {
                    select: {
                        id: true,
                        nama: true,
                        email: true,
                    }
                },
                Kategori: {
                    select: {
                        id: true,
                        nama: true,
                    }
                }
            }
        });
        if (!pengaduan) return null;

        return pengaduan;
    }

    async findPengaduanByPenggunaId(id: string) {
        const pengaduan = await this.prismaClient.pengaduan.findMany({
            where: {
                penggunaId: id
            },
            include: {
                Pengguna: {
                    select: {
                        id: true,
                        nama: true,
                        email: true,
                    }
                },
                Kategori: {
                    select: {
                        id: true,
                        nama: true,
                    }
                }
            }
        });
        if (!pengaduan) return null;

        return pengaduan;
    }

}