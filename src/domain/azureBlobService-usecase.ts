// azureBlobService.ts
import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } from '@azure/storage-blob';
import { addMinutes } from 'date-fns';

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME!;

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

export async function generateSasToken(blobName: string, validityInMinutes: number = 60): Promise<string> {
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blobClient = containerClient.getBlobClient(blobName);
  const exists = await blobClient.exists();
  if (!exists) {
    throw new Error('Blob not found');
  }

  const sasToken = generateBlobSASQueryParameters({
    containerName,
    blobName,
    permissions: BlobSASPermissions.parse('r'), 
    startsOn: new Date(), 
    expiresOn: addMinutes(new Date(), validityInMinutes) 
  }, sharedKeyCredential).toString();

  return `${blobClient.url}?${sasToken}`;
}

export async function uploadBlob(blobName: string, buffer: Buffer, mimeType: string): Promise<void> {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: mimeType }
  });
}