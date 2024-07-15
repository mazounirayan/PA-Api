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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureBlobServiceUsecase = void 0;
// azureBlobService.ts
const storage_blob_1 = require("@azure/storage-blob");
const date_fns_1 = require("date-fns");
const token_1 = require("../database/entities/token");
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new storage_blob_1.BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
class AzureBlobServiceUsecase {
    constructor(db) {
        this.db = db;
    }
    getBlobName(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(token_1.Token);
            const sqlQuery = `select id, blobName as fileName from token where userId = ? and blobName is not null;`;
            const blobName = yield entityManager.query(sqlQuery, [id]);
            if (!blobName.length) {
                return null;
            }
            return blobName;
        });
    }
    generateSasToken(blobName_1) {
        return __awaiter(this, arguments, void 0, function* (blobName, validityInMinutes = 60) {
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blobClient = containerClient.getBlobClient(blobName);
            const exists = yield blobClient.exists();
            if (!exists) {
                throw new Error('Blob not found');
            }
            const sasToken = (0, storage_blob_1.generateBlobSASQueryParameters)({
                containerName,
                blobName,
                permissions: storage_blob_1.BlobSASPermissions.parse('r'),
                startsOn: new Date(),
                expiresOn: (0, date_fns_1.addMinutes)(new Date(), validityInMinutes)
            }, sharedKeyCredential).toString();
            return `${blobClient.url}?${sasToken}`;
        });
    }
    uploadBlob(blobName, buffer, mimeType) {
        return __awaiter(this, void 0, void 0, function* () {
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            yield blockBlobClient.uploadData(buffer, {
                blobHTTPHeaders: { blobContentType: mimeType }
            });
        });
    }
    deleteBlob(blobName) {
        return __awaiter(this, void 0, void 0, function* () {
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            yield blockBlobClient.delete();
        });
    }
}
exports.AzureBlobServiceUsecase = AzureBlobServiceUsecase;
