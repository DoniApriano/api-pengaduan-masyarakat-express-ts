import multer from 'multer';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const date = new Date().getDate();
        const hours = new Date().getHours();
        const minute = new Date().getMinutes();
        const second = new Date().getSeconds();

        const timestamp: string = `${year}-${month}-${date}-${hours}-${minute}-${second}`
        cb(null, timestamp + '-' + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});

export { upload };
