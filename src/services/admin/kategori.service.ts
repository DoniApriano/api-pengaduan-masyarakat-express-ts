import { PrismaClient } from "@prisma/client";

export default class KategoriServie {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async read() {
        const kategori = await this.prismaClient.kategori.findMany();

        return kategori;
    }

    async create(body: { nama: string }) {
        const kategori = await this.prismaClient.kategori.create({
            data: body
        });
        if (!kategori) return null;

        return kategori;
    }

    async update(id: string, body: { nama: string }) {
        const findKategori = await this.findOne(id);
        if (!findKategori) return null;
        
        const kategori = await this.prismaClient.kategori.update({
            data: body,
            where: {
                id: id
            }
        });
        if (!kategori) return null;

        return kategori;
    }

    async delete(id: string) {
        const findKategori = await this.findOne(id);
        if (!findKategori) return null;

        const kategori = await this.prismaClient.kategori.delete({
            where: {
                id: id
            }
        });
        if (!kategori) return null;

        return kategori;
    }

    async findOne(id: string) {
        const kategori = await this.prismaClient.kategori.findUnique({
            where: {
                id: id,
            },
        });
        if (!kategori) return null;

        return kategori;
    }
} 