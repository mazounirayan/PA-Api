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
exports.Chat = void 0;
const dialogflow = require('@google-cloud/dialogflow');
const projectId = 'votre-id-projet-dialogflow'; // Remplacez par votre ID de projet
const sessionId = '123456';
const languageCode = 'fr';
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
const Chat = (app) => {
    app.post('/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { message } = req.body;
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: message,
                    languageCode: languageCode,
                },
            },
        };
        try {
            const responses = yield sessionClient.detectIntent(request);
            const result = responses[0].queryResult;
            const reply = result.fulfillmentText;
            res.json({ reply });
        }
        catch (error) {
            console.error('ERROR:', error);
            res.status(500).send('Erreur lors de la communication avec Dialogflow');
        }
    }));
};
exports.Chat = Chat;
exports.default = exports.Chat;
