import { Request, Response } from "express";
import TanggapanService from "../../services/admin/tanggapan.service";
import PengaduanService from "../../services/masyarakat/pengaduan.service";
import AuthService from "../../services/auth.service";

export default class TanggapanController {
    private tanggapanService: TanggapanService;
    private pengaduanService: PengaduanService;
    private authService: AuthService;

    constructor() {
        this.tanggapanService = new TanggapanService();
        this.pengaduanService = new PengaduanService();
        this.authService = new AuthService();

        this.createTanggapan = this.createTanggapan.bind(this);
        this.findAllTanggapan = this.findAllTanggapan.bind(this);
        this.findTanggapanById = this.findTanggapanById.bind(this);
        this.updateTanggapan = this.updateTanggapan.bind(this);
        this.cancelTanggapan = this.cancelTanggapan.bind(this);
    }

    async createTanggapan(req: Request, res: Response) {
        try {
            const pengaduanId: string = req.params.id;
            const email: string = res.locals.email;
            const admin = await this.authService.findUser(email);
            if (!admin) return res.status(404).json({
                success: false,
                message: 'Admin tidak ditemukan'
            });

            const adminId = admin.id;

            const findPengaduan = await this.pengaduanService.findPengaduan(pengaduanId);
            if (!findPengaduan) return res.status(404).json({
                success: false,
                message: 'Pengaduan tidak ditemukan'
            });

            if (findPengaduan.status == true) return res.status(404).json({
                success: false,
                message: 'Pengaduan sudah di tanggapi'
            });

            const { tanggapan } = req.body;
            const tambahTanggapan = await this.tanggapanService.create({ pengaduanId, adminId, tanggapan });
            if (!tambahTanggapan) return res.status(400).json({
                success: false,
                message: 'Gagal Tambah Tanggapan'
            });

            return res.status(201).json({
                success: true,
                message: "Berhasil menambah tanggapan",
                data: tambahTanggapan,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: true,
                message: "Terjadi kesalahan",
            });
        }
    }

    async updateTanggapan(req: Request, res: Response) {
        try {
            const { tanggapan } = req.body;
            const tanggapanId: string = req.params.id;
            const findTanggapan = await this.tanggapanService.findOne(tanggapanId);
            if (!findTanggapan) return res.status(404).json({
                success: false,
                message: "Tanggapan tidak ditemukan",
            });

            const updateTanggapan = await this.tanggapanService.update(tanggapanId, { tanggapan });
            if (!updateTanggapan) return res.status(400).json({
                success: false,
                message: "Gagal update tanggapan",
            });

            return res.status(200).json({
                success: false,
                message: "Berhasil update tanggapan",
                data: updateTanggapan,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: true,
                message: "Terjadi kesalahan",
            });
        }
    }

    async cancelTanggapan(req: Request, res: Response) {
        try {
            const tanggapanId: string = req.params.id;
            const findTanggapan = await this.tanggapanService.findOne(tanggapanId);
            if (!findTanggapan) return res.status(404).json({
                success: false,
                message: "Tanggapan tidak ditemukan",
            });

            const deleteTanggapan = await this.tanggapanService.delete(tanggapanId);
            if (!deleteTanggapan) return res.status(400).json({
                success: false,
                message: "Gagal delete tanggapan",
            });

            return res.status(200).json({
                success: false,
                message: "Berhasil delete tanggapan",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: true,
                message: "Terjadi kesalahan",
            });
        }
    }

    async findAllTanggapan(req: Request, res: Response) {
        try {
            const tanggapan = await this.tanggapanService.findAll();

            return res.status(200).json({
                success: true,
                message: "Berhasil menampilkan semua tanggapan",
                data: tanggapan,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: true,
                message: "Terjadi kesalahan",
            });
        }
    }

    async findTanggapanById(req: Request, res: Response) {
        try {
            const id: string = req.params.id;
            const tanggapan = await this.tanggapanService.findOne(id);
            if (!tanggapan) return res.status(404).json({
                success: false,
                message: 'Pengaduan tidak ditemukan'
            });

            return res.status(200).json({
                success: true,
                message: "Berhasil menampilkan semua tanggapan",
                data: tanggapan,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: true,
                message: "Terjadi kesalahan",
            });
        }
    }

}