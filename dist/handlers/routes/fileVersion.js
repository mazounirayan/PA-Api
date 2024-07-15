"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileVersion = void 0;
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
const FileVersion = (app) => {
    app.get("/fileVersion", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const githubToken = process.env.GITHUB_TOKEN;
            const repo = process.env.GITHUB_REPO;
            const apiUrl = process.env.GITHUB_API_URL;
            if (!githubToken || !repo || !apiUrl) {
                return res.status(500).send({ error: 'Environment variables are not set' });
            }
            const headers = {
                'Authorization': `token ${githubToken}`
            };
            const response = yield axios_1.default.get(`${apiUrl}/repos/${repo}/contents`, { headers });
            const files = response.data;
            const versionFile = files.find((file) => file.name.startsWith('version_'));
            if (versionFile) {
                res.status(200).send({ fileVersion: versionFile.name });
            }
            else {
                res.status(404).send({ error: 'Version file not found' });
            }
        }
        catch (error) {
            console.error('Error fetching the files', error);
            res.status(500).send({ error: 'Internal server error' });
        }
    }));
};
exports.FileVersion = FileVersion;
