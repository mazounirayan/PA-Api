source creation.sql

INSERT INTO user (nom, prenom, email, motDePasse, role, dateInscription, estBenevole, parrainId) VALUES
('Dupont', 'Jean', 'jean.dupont@email.com', '$2b$10$JuqVnm5ov5EBsi158eE4FOJFVXjnkOCqrc5k2s87M.ya2dwOTS.wG', 'Adherent', NOW(), TRUE, NULL),
('Martin', 'Alice', 'alice.martin@email.com', '$2b$10$F4zka3au8kLQG1rAD2Oq5eEd9P1Ru0xzcW1zWT51odT7VFOSKJs/6', 'Administrateur', NOW(), FALSE, 1);

INSERT INTO fonctionnalite (nom, description) VALUES 
('Gestion des dons, cotisations et rappels', "Permet la gestion des dons, des cotisations des membres et l\'envoi de rappels pour les renouvellements."),
('Gestion documentaire (GED)', "Gère tous les documents de l\'organisation, incluant un coffre-fort numérique pour les documents sensibles."),
('Gestion des événements', "Permet la création, la gestion et la promotion des événements organisés par l\'association."),
('Gestion des votes', 'Fournit un système pour créer des votes et des élections, permettant aux membres de voter en ligne.'),
('Gestion des membres', "Permet l\'administration des membres de l\'association, incluant l\'inscription, le suivi et la gestion des adhésions."),
("Gestion des AG ou AG extraordinaire", "Facilite la planification, l\'organisation et le suivi des assemblées générales ordinaires ou extraordinaires."),
('Planification et Gestion des tâches', "Outil pour la création, l\'attribution et le suivi des tâches au sein de l\'organisation."),
('Gestion des ressources', 'Permet la gestion des ressources matérielles et immatérielles, incluant leur réservation et leur maintenance.');




INSERT INTO droit (userId, fonctionnaliteId)
SELECT user.id, fonctionnalite.id
FROM user, fonctionnalite
WHERE user.role = 'Administrateur';

-- Insertion des droits pour les adhérents, avec exclusion des fonctionnalités 7 et 8
INSERT INTO droit (userId, fonctionnaliteId)
SELECT user.id, fonctionnalite.id
FROM user, fonctionnalite
WHERE user.role = 'Adherent'
AND fonctionnalite.id NOT IN (7, 8);


INSERT INTO tache (Description, dateDebut, dateFin, statut, responsableId) VALUES
("Préparer le matériel pour l\'événement", NOW(), NOW(), 'En cours', 1),
('Contacter les fournisseurs', NOW(), NOW(), 'En cours', 2);

INSERT INTO evenement (nom, date, description, lieu) VALUES
('Gala Annuel', NOW() + INTERVAL 1 MONTH, "Le gala annuel de l\'association", 'Salle des fêtes'),
("Conférence sur l\'éducation", NOW() + INTERVAL 2 MONTH, 'Conférence sur les échanges éducatifs', 'Amphithéâtre Central');

INSERT INTO inscription (userId, eventId, statut) VALUES
(1, 1, 'Confirmé'),
(2, 1, 'Confirmé'),
(1, 2, 'En attente');

INSERT INTO ag (nom, date, description, type, quorum) VALUES
('AG Annuelle 2024', NOW() + INTERVAL 3 MONTH, 'Discussion sur les bilans et projets futurs', 'Ordinaire', 15),
('AG Extraordinaire pour Statuts', NOW() + INTERVAL 4 MONTH, "Modification des statuts de l\'association", 'Extraordinaire', 20);


INSERT INTO participationAG (userId, agId) VALUES
(1, 1),
(2, 1);

INSERT INTO proposition (description, type, agId) VALUES
('Proposition de modification du quorum', 'Statuts', 2);

INSERT INTO vote (propositionId, userId, choix) VALUES
(1, 1, 'Pour'),
(1, 2, 'Pour');

INSERT INTO transaction (montant, type, dateTransaction, userId) VALUES
(50.00, 'Cotisation', NOW(), 1),
(100.00, 'Don', NOW(), 2);

INSERT INTO transaction (montant, type, dateTransaction, userId, evenementId) VALUES
(10.00, 'Inscription', NOW(),2,1);

INSERT INTO document (titre, type, cheminAcces, userId) VALUES
('Procès-verbal AG 2023', 'PV', '/docs/pv_ag_2023.pdf', 1);

INSERT INTO ressource (nom, type, statut, emplacement) VALUES
('Salle A', 'Salle', 'Disponible', 'Bâtiment B'),
('VIdéoprojecteur', 'Matériel', 'Disponible', 'Salle de Conférence');

INSERT INTO reservation (dateDebut, dateFin, description, ressourceId, UserId) VALUES
(NOW(), NOW() + INTERVAL 2 HOUR, 'Réunion du bureau', 1, 1);

INSERT INTO demande (type, dateDemande, statut, userId)
VALUES 
('Evénement', '2024-05-19 14:30:00', 'En attente',1),
('Projet', '2024-05-20 10:00:00', 'Acceptée',1),
('Parrainage', '2024-05-21 08:45:00', 'Refusée',1);

INSERT INTO evenement_demande (id, nom, date, description, lieu, demandeId)
VALUES 
(1, 'Festival de Musique', '2024-07-15 18:00:00', 'Un grand festival de musique avec des artistes internationaux.', 'Parc Central',1);

INSERT INTO aide_projet (nom, descriptionProjet, budget, deadline)
VALUES 
('Projet de Reforestation', 'Un projet visant à planter des arbres dans les zones déforestées.', 5000.00, '2024-12-31 00:00:00');

INSERT INTO aide_projet_demande (id, nom, descriptionProjet, budget, deadline, demandeId)
VALUES 
(2, 'Projet de Reforestation', 'Un projet visant à planter des arbres dans les zones déforestées.', 5000.00, '2024-12-31 00:00:00', 2);

INSERT INTO parrainage_demande (id, parrainId, detailsParrainage, demandeId)
VALUES 
(3, 2, 'Parrainage pour les enfants défavorisés.', 3);
