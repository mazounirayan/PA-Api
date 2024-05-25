import express, { Request, Response } from 'express';
import { Token } from '../../database/entities/token';
import { generateSasToken, uploadBlob } from '../../domain/azureBlobService-usecase';
import { AppDataSource } from '../../database/database';
import { authMiddlewareAdminstrateur } from '../middleware/auth-middleware';
import { User } from '../../database/entities/user';
import upload from '../middleware/upload';


export const AzureBlobService = (app: express.Express) => {

    app.get("/generate-sas-url/:blobName/:userid", authMiddlewareAdminstrateur ,async (req: Request, res: Response) => {
        const userId = req.params.userid;
        const blobName = req.params.blobName;
        const tokenRepo = AppDataSource.getRepository(Token);

        try {
            const token = await tokenRepo.findOne({ where: { user: { id: +userId }, blobName } });
            if (!token) {
            return res.status(404).send('No token found for the specified blob and user');
            }

            const validityInMinutes = 10; // 10 minutes
            const sasUrl = await generateSasToken(blobName, validityInMinutes);

            res.json({ sasUrl });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    });
    
    app.post("/upload-document/:userId", authMiddlewareAdminstrateur, upload.single('file'), async (req: Request, res: Response) => {
        const userId = req.params.userId;
        
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded');
        }

        console.log("User ID:", userId);
        const tokenRepo = AppDataSource.getRepository(Token);
        const userRepo = AppDataSource.getRepository(User);

        try {
            const user = await userRepo.findOne({ where: { id: +userId } });
            if (!user) {
                return res.status(404).send('User not found');
            }

            const blobName = `${file.originalname}`;
            const mimeType = file.mimetype;

            await uploadBlob(blobName, file.buffer, mimeType);

            const newToken = tokenRepo.create({
                token: 'some-generated-token', 
                blobName: blobName,
                user: user
            });

            await tokenRepo.save(newToken);

            res.status(200).send('File uploaded and token saved');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    });
}


