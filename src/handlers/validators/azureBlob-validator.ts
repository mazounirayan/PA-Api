import Joi from "joi";

export const azureBlobService = Joi.object<AzureBlobService>({
    id: Joi.string().required(),
    token: Joi.string().required(),
    blobName: Joi.string().required(),

});

export interface AzureBlobService {
    id: number
    token: string
    blobName: string
}

