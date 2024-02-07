import { PrismaClient } from "@prisma/client";
import PengaduanService from "../masyarakat/pengaduan.service";

export default class TanggapanService {
    private prismaClient: PrismaClient;
    private pengaduanService: PengaduanService;

    constructor() {
        this.prismaClient = new PrismaClient();
        this.pengaduanService = new PengaduanService();
    }

    async create(body: { pengaduanId: string, adminId: string, tanggapan: string, }) {
        const findPengaduan = await this.pengaduanService.findPengaduan(body.pengaduanId);
        if (!findPengaduan) return null;
        if (findPengaduan.status == true) {
            return null;
        }

        const updatePengaduan = await this.prismaClient.pengaduan.update({
            where: {
                id: body.pengaduanId,
            },
            data: {
                status: true,
            }
        });

        const tanggapan = await this.prismaClient.tanggapan.create({
            data: body,
            include: {
                Admin: {
                    select: {
                        id: true,
                        nama: true,
                    }
                },
                Pengaduan: {
                    select: {
                        id: true,
                        judul: true,
                        deskripsi: true,
                        foto: true,
                        status: true,
                        Kategori: {
                            select: {
                                id: true,
                                nama: true,
                            }
                        },
                        Pengguna: {
                            select: {
                                id: true,
                                nama: true,
                            }
                        }
                    }
                }
            }
        });

        return tanggapan;
    }

    async findAll() {
        const tanggapan = await this.prismaClient.tanggapan.findMany({
            include: {
                Admin: {
                    select: {
                        id: true,
                        nama: true,
                    }
                },
                Pengaduan: {
                    select: {
                        id: true,
                        judul: true,
                        deskripsi: true,
                        foto: true,
                        status: true,
                        Kategori: {
                            select: {
                                id: true,
                                nama: true,
                            }
                        }
                    }
                }
            }
        });

        return tanggapan;
    }

    async update(id: string, body: { tanggapan: string }) {
        const findTanggapan = await this.findOne(id);
        if (!findTanggapan) return null;

        const updateTanggapan = await this.prismaClient.tanggapan.update({
            where: {
                id: id,
            },
            data: {
                tanggapan: body.tanggapan,
            },
        });
        if (!updateTanggapan) return null;

        return updateTanggapan;
    }

    async delete(id: string) {
        const findTanggapan = await this.findOne(id);
        if (!findTanggapan) return null;

        const updatePengaduan = await this.prismaClient.pengaduan.update({
            where: {
                id: findTanggapan.pengaduanId,
            }, 
            data: {
                status: false,
            },
        });
        if (!updatePengaduan) return null;

        const deleteTanggapan = await this.prismaClient.tanggapan.delete({
            where: {
                id: id,
            },
        });
        if (!deleteTanggapan) return null;

        return true;
    }

    async findOne(id: string) {
        const tanggapan = await this.prismaClient.tanggapan.findUnique({
            where: {
                id: id
            },
            include: {
                Admin: {
                    select: {
                        id: true,
                        nama: true,
                    }
                },
                Pengaduan: {
                    select: {
                        id: true,
                        judul: true,
                        deskripsi: true,
                        foto: true,
                        status: true,
                        Kategori: {
                            select: {
                                id: true,
                                nama: true,
                            }
                        }
                    }
                }
            }
        });

        return tanggapan;
    }
}