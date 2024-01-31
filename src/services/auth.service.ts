import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
interface UserData {
    nama: string | null;
    email: string | null;
}
export default class AuthService {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async create(email: string, nama: string, inputPassword: string) {
        const masyarakat = await this.prismaClient.role.findFirst({
            where: {
                id: process.env.ROLE_ID_MASYARAKAT
            }
        });
        if (!masyarakat) return "notfound";

        var hashPassword = "";
        if (inputPassword) {
            hashPassword = await bcrypt.hash(inputPassword, 12);
        }

        const pengguna = await this.prismaClient.pengguna.create({
            data: {
                email: email,
                nama: nama,
                password: hashPassword,
                roleId: masyarakat.id,
            }
        });

        const { password, ...data } = pengguna;
        return data;
    }

    async generateAccessToken(email: string, password: string) {
        const pengguna = await this.findUserDataForAuth(email, password);
        const token: string = jwt.sign(
            { pengguna }, process.env.JWT_ACCESS as string, { expiresIn: "1h" }
        );

        return token;
    }

    extractAccessToken(token: string) {
        const secretKey: string = process.env.JWT_ACCESS as string;
        let resData: any;

        try {
            const decoded = jwt.verify(token, secretKey);
            resData = decoded;
        } catch (err) {
            console.error(`Error extracting token: ${err}`);
            resData = null;
        }

        if (!resData) {
            return null;
        }

        return resData.pengguna;
    }

    async findUser(email: string) {
        const pengguna = await this.prismaClient.pengguna.findUnique({
            where: {
                email: email
            },
            include: {
                role: {
                    select: {
                        id: true,
                        nama: true,
                    }
                }
            }
        });

        if (!pengguna) return null;

        return pengguna;
    }

    async findUserDataForAuth(email: string, inputPassword: string) {
        const pengguna = await this.prismaClient.pengguna.findUnique({
            where: {
                email: email,
            }
        });
        if (!pengguna) return null;

        const isMatch = await bcrypt.compare(inputPassword, pengguna.password);
        if (!isMatch) return null;

        const { password, ...data } = pengguna;
        return data;
    }


}