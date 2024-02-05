import { Request, Response } from "express";
import KategoriServie from "../../services/admin/kategori.service";

export default class KategoriController {
    private kategoriService: KategoriServie;

    constructor() {
        this.kategoriService = new KategoriServie();

        this.findAllKategori = this.findAllKategori.bind(this);
        this.createKategori = this.createKategori.bind(this);
        this.updateKategori = this.updateKategori.bind(this);
        this.deleteKategori = this.deleteKategori.bind(this);
        this.findOneKategori = this.findOneKategori.bind(this);
    }

    async findAllKategori(req: Request, res: Response) {
        const kategori = await this.kategoriService.read();

        return res.status(200).json({
            success: true,
            message: "Berhasil menampilkan semua kategori",
            data: kategori,
        });
    }

    async findOneKategori(req: Request, res: Response) {
        const id = req.params.id;
        const kategori = await this.kategoriService.findOne(id);
        if (!kategori) return res.status(404).json({
            success: true,
            message: "Kategori tidak ditemukan",
        });

        return res.status(200).json({
            success: true,
            message: "Berhasil menampilkan kategori",
            data: kategori,
        });
    }

    async createKategori(req: Request, res: Response) {
        const { nama } = req.body;
        const kategori = await this.kategoriService.create({ nama });
        if (!kategori) return res.status(400).json({
            success: false,
            message: "Gagal tambah kategori",
        });

        return res.status(201).json({
            success: true,
            message: "Berhasil menambah kategori",
            data: kategori,
        });
    }

    async updateKategori(req: Request, res: Response) {
        const { nama } = req.body;
        const id = req.params.id;
        const findKategori = await this.kategoriService.findOne(id);
        if (!findKategori) return res.status(404).json({
            success: true,
            message: "Kategori tidak ditemukan",
        });

        const kategori = await this.kategoriService.update(id, { nama });
        if (!kategori) return res.status(400).json({
            success: false,
            message: "Gagal update kategori",
        });

        return res.status(200).json({
            success: true,
            message: "Berhasil update kategori",
            data: kategori,
        });
    }

    async deleteKategori(req: Request, res: Response) {
        const id = req.params.id;
        const findKategori = await this.kategoriService.findOne(id);
        if (!findKategori) return res.status(404).json({
            success: true,
            message: "Kategori tidak ditemukan",
        });

        const kategori = await this.kategoriService.delete(id);
        if (!kategori) return res.status(400).json({
            success: false,
            message: "Gagal delete kategori",
        });

        return res.status(200).json({
            success: true,
            message: "Berhasil delete kategori",
        });
    }


}