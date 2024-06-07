import axios from 'axios';
import 'dotenv/config';
import express, { Request, Response } from "express";


export const FileVersion = (app: express.Express) => {
    app.get("/fileVersion", async (req: Request, res: Response) => {    
        try {
            const githubToken = process.env.GITHUB_TOKEN;
            const repo = process.env.GITHUB_REPO;
            const apiUrl = process.env.GITHUB_API_URL;

            const response = await axios.get(`${apiUrl}/repos/${repo}/contents`);

            const files = response.data;
            const versionFile = files.find((file: any) => file.name.startsWith('version_'));

            if (versionFile) {
                res.status(200).send({ fileVersion: versionFile.name });
            } else {
                res.status(404).send({ error: 'Version file not found' });
            }
        } catch (error) {
            console.error('Error fetching the files', error);
            res.status(500).send({ error: 'Internal server error' });
        }
    });
}
