import { Request, Response } from "express";
import PengaduanService from "../../services/masyarakat/pengaduan.service";
import AuthService from "../../services/auth.service";
import { upload } from "../../config/multer";
import path from "path";
import fs from 'fs';
import KategoriServie from "../../services/admin/kategori.service";

export default class PengaduanController {
    private pengaduanService: PengaduanService;
    private authService: AuthService;
    private kategoriService: KategoriServie;

    constructor() {
        this.pengaduanService = new PengaduanService();
        this.kategoriService = new KategoriServie();
        this.authService = new AuthService();

        this.createPengaduan = this.createPengaduan.bind(this);
        this.updatePengaduan = this.updatePengaduan.bind(this);
        this.deletePengaduan = this.deletePengaduan.bind(this);
        this.findAllPengaduan = this.findAllPengaduan.bind(this);
        this.findOnePengaduan = this.findOnePengaduan.bind(this);
    }

    async createPengaduan(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
        const { judul, deskripsi, kategoriId } = req.body;

        const findKategori = await this.kategoriService.findOne(kategoriId);
        if (!findKategori) return res.status(404).json({
            success: false,
            message: "Kategori tidak ditemukan",
        });

        const email = res.locals.email;
        const findPengguna = await this.authService.findUser(email);
        if (!findPengguna) return res.status(404).json({
            success: false,
            message: "Email tidak ditemukan",
        });
        const penggunaId: string = findPengguna.id;

        const foto = req.file;
        if (!foto) return res.status(400).json({
            success: false,
            message: {
                errors: {
                    foto: [
                        "The foto field is required."
                    ]
                }
            },
        });


        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const date = new Date().getDate();
        const hours = new Date().getHours();
        const minute = new Date().getMinutes();
        const second = new Date().getSeconds();

        const timestamp: string = `${year}-${month}-${date}-${hours}-${minute}-${second}`

        const originalFileName: string = timestamp + '-' + foto?.originalname;
        upload.single('foto')(req, res, async (err: any) => {
            try {
                const createPengaduan = await this.pengaduanService.create({ judul, deskripsi, foto: originalFileName, kategoriId, penggunaId });
                if (!createPengaduan) return res.status(400).json({
                    success: false,
                    message: "Terjadi Kesalahan",
                });

                return res.status(201).json({
                    success: true,
                    message: "Berhasil Membuat Pengaduan",
                    data: createPengaduan,
                });
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: "Terjadi Kesalahan",
                });
            }
        });
    }

    async updatePengaduan(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
        let updatePengaduan: any;
        const { judul, deskripsi, kategoriId }: { judul?: string, deskripsi?: string, kategoriId?: string } = req.body;
        const pengaduanId: string = req.params.id;
        const pengaduan = await this.pengaduanService.findPengaduan(pengaduanId);
        if (!pengaduan) return res.status(404).json({
            success: false,
            message: "Pengaduan tidak ditemukan",
        });

        if (kategoriId) {
            const findKategori = await this.kategoriService.findOne(kategoriId);
            if (!findKategori) return res.status(404).json({
                success: false,
                message: "Kategori tidak ditemukan",
            });
        }

        const email = res.locals.email;
        const pengguna = await this.authService.findUser(email);
        if (!pengguna) return res.status(404).json({
            success: false,
            message: "Email tidak ditemukan",
        });

        // cek pemilik pengaduan
        if (pengaduan.penggunaId !== pengguna.id) return res.status(401).json({
            success: false,
            message: "Forbidden",
        });

        const fotoInput = req.file;
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const date = new Date().getDate();
        const hours = new Date().getHours();
        const minute = new Date().getMinutes();
        const second = new Date().getSeconds();

        const timestamp: string = `${year}-${month}-${date}-${hours}-${minute}-${second}`

        const originalFileName: string = timestamp + '-' + fotoInput?.originalname;

        upload.single('foto')(req, res, async (err: any) => {
            try {
                if (fotoInput) {
                    const foto: string = pengaduan.foto;
                    const pathFoto: string = path.join(__dirname, '../../../uploads/', foto);
                    console.log(foto);
                    console.log(pathFoto);
                    console.log(fs.existsSync(pathFoto));
                    console.log(err);

                    if (!fs.existsSync(pathFoto)) return res.status(404).json({
                        status: false,
                        message: "Foto tidak ditemukan",
                    });

                    // Hapus foto
                    fs.unlink(pathFoto, (err) => {
                        if (err)
                            throw err;
                    });
                    updatePengaduan = await this.pengaduanService.update(pengaduanId, { judul, deskripsi, kategoriId, foto: originalFileName });
                } else {
                    updatePengaduan = await this.pengaduanService.update(pengaduanId, { judul, deskripsi, kategoriId, });
                }

                if (!updatePengaduan) return res.status(400).json({
                    success: false,
                    message: "Terjadi Kesalahan",
                });

                return res.status(200).json({
                    success: true,
                    message: "Berhasil Mengubah Pengaduan",
                    data: updatePengaduan,
                });
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: "Terjadi Kesalahan",
                });
            }
        });
    }

    async deletePengaduan(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const pengaduanId: string = req.params.id;
            const pengaduan = await this.pengaduanService.findPengaduan(pengaduanId);
            if (!pengaduan) return res.status(404).json({
                success: false,
                message: "Pengaduan tidak ditemukan",
            });

            const email = res.locals.email;
            const pengguna = await this.authService.findUser(email);
            if (!pengguna) return res.status(404).json({
                success: false,
                message: "Email tidak ditemukan",
            });

            // cek pemilik pengaduan
            if (pengaduan.penggunaId !== pengguna.id) return res.status(401).json({
                success: false,
                message: "Forbidden",
            });

            const foto: string = pengaduan.foto;
            const pathFoto: string = path.join(__dirname, '../../../uploads/', foto);
            if (!fs.existsSync(pathFoto)) return res.status(404).json({
                success: false,
                message: "Foto Pengaduan tidak ditemukan",
            });

            // Hapus foto
            fs.unlink(pathFoto, (err) => {
                if (err)
                    throw err;
            });

            const deletePengaduan = await this.pengaduanService.delete(pengaduanId);

            return res.status(200).json({
                success: true,
                message: "Berhasil Hapus Pengaduan",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Terjadi Kesalahan",
            });
        }
    }

    async findOnePengaduan(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const pengaduanId: string = req.params.id;
            const pengaduan = await this.pengaduanService.findPengaduan(pengaduanId);
            if (!pengaduan) return res.status(404).json({
                success: false,
                message: "Pengaduan tidak ditemukan",
            });

            const email = res.locals.email;
            const pengguna = await this.authService.findUser(email);
            if (!pengguna) return res.status(404).json({
                success: false,
                message: "Email tidak ditemukan",
            });

            // cek pemilik pengaduan
            if (pengaduan.penggunaId !== pengguna.id) return res.status(401).json({
                success: false,
                message: "Forbidden",
            });

            return res.status(200).json({
                success: true,
                message: "Berhasil Menemukan Pengaduan",
                data: pengaduan
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Terjadi kesalahan"
            });
        }
    }

    async findAllPengaduan(req: Request, res: Response) {
        try {
            const email = res.locals.email;
            const pengguna = await this.authService.findUser(email);
            if (!pengguna) return res.status(404).json({
                success: false,
                message: "Email tidak ditemukan",
            });

            const pengaduan = await this.pengaduanService.findPengaduanByPenggunaId(pengguna.id);
            if (!pengaduan) return res.status(404).json({
                success: false,
                message: "Pengaduan tidak ditemukan",
            });

            return res.status(200).json({
                success: true,
                message: "Berhasil Menampilkan Pengaduan",
                data: pengaduan
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: "Terjadi kesalahan",
            });
        }
    }
} 