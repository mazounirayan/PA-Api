// src/routes/chat.ts
import express, { Request, Response } from 'express';
const dialogflow = require('@google-cloud/dialogflow');


const projectId = 'votre-id-projet-dialogflow'; // Remplacez par votre ID de projet
const sessionId = '123456';
const languageCode = 'fr';

const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);


export const Chat = (app: express.Express) => {
    app.post('/chat', async (req: Request, res: Response) => {
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
          const responses = await sessionClient.detectIntent(request);
          const result = responses[0].queryResult;
          const reply = result.fulfillmentText;
      
          res.json({ reply });
        } catch (error) {
          console.error('ERROR:', error);
          res.status(500).send('Erreur lors de la communication avec Dialogflow');
        }
      });
}

export default Chat;