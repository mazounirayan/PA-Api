source creation.sql

INSERT INTO user (nom, prenom, email, motDePasse, profession, numTel, role, dateInscription, estBenevole) VALUES
('Dupont', 'Jean', 'jean.dupont@email.com', '$2b$10$JuqVnm5ov5EBsi158eE4FOJFVXjnkOCqrc5k2s87M.ya2dwOTS.wG', 'Ingénieur informatique', '0612345678', 'Adherent', NOW(), TRUE),
('Martin', 'Alice', 'alice.martin@email.com', '$2b$10$F4zka3au8kLQG1rAD2Oq5eEd9P1Ru0xzcW1zWT51odT7VFOSKJs/6', 'Plombier', '0712345678', 'Administrateur', NOW(), FALSE);

INSERT INTO visiteur (nom, prenom, email, age, numTel, adresse, profession, estBenevole, dateInscription, parrainId)
VALUES
('Dupont', 'Jean', 'jean.dupont@example.com', 34, '0123456789', '123 Rue Principale, Paris', 'Ingénieur', TRUE, '2023-06-01', 1),
('Martin', 'Sophie', 'sophie.martin@example.com', 28, '0987654321', '456 Avenue des Champs, Lyon', 'Médecin', FALSE, '2023-06-02', 2),
('Bernard', 'Alice', 'alice.bernard@example.com', 40, '0213456789', '789 Boulevard de la République, Marseille', 'Professeur', TRUE, '2023-06-03', 2),
('Lefevre', 'Pierre', 'pierre.lefevre@example.com', 22, '0321456789', '321 Rue de la Paix, Lille', 'Étudiant', FALSE, '2023-06-04', 1),
('Moreau', 'Claire', 'claire.moreau@example.com', 30, '0432156789', '654 Rue de la Liberté, Bordeaux', 'Designer', TRUE, '2023-06-05', 2),
('Roux', 'Luc', 'luc.roux@example.com', 36, '0543216789', '987 Avenue de la Victoire, Toulouse', 'Commercial', FALSE, '2023-06-06', 2),
('Petit', 'Emilie', 'emilie.petit@example.com', 25, '0654321789', '159 Rue des Fleurs, Nice', 'Architecte', TRUE, '2023-06-07', 1),
('Durand', 'Julien', 'julien.durand@example.com', 29, '0765432178', '753 Avenue de la Gare, Strasbourg', 'Développeur', FALSE, '2023-06-08', 2),
('Girard', 'Nathalie', 'nathalie.girard@example.com', 32, '0876543217', '951 Boulevard Saint-Germain, Rennes', 'Avocate', TRUE, '2023-06-09', 1),
('Morel', 'Hugo', 'hugo.morel@example.com', 38, '0987654321', '357 Rue de la République, Montpellier', 'Journaliste', FALSE, '2023-06-10', 1);



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

INSERT INTO inscription (visiteurId, evenementId) VALUES
(1, 1),
(2, 1),
(3, 2);

INSERT INTO ag (nom, date, description, type, quorum) VALUES
('AG Annuelle 2024', NOW() + INTERVAL 3 MONTH, 'Discussion sur les bilans et projets futurs', 'Ordinaire', 15),
('AG Extraordinaire pour Statuts', NOW() + INTERVAL 4 MONTH, "Modification des statuts de l\'association", 'Extraordinaire', 20);


INSERT INTO participation_ag (userId, agId) VALUES
(1, 1),
(2, 1);

INSERT INTO proposition (question, type, choix, agId) VALUES
('Satisfais de l asso ?', 'radio', 'Oui' ,2),
('Satisfais de l asso ?', 'radio', 'Non' ,2);

INSERT INTO vote (propositionId, userId, choix) VALUES
(1, 1, 'Oui'),
(2, 2, 'Non');

INSERT INTO transaction (montant, type, dateTransaction, visiteurId) VALUES
(50.00, 'Cotisation', NOW(), 1),
(100.00, 'Don', NOW(), 2);

INSERT INTO transaction (montant, type, dateTransaction, visiteurId, evenementId) VALUES
(10.00, 'Inscription', NOW(),3,1);



INSERT INTO ressource (nom, type,  quantite ,emplacement) VALUES
('Sac de pomme', 'Alimentaire', 3, 'Bâtiment B');
INSERT INTO ressource (nom, type,  quantite) VALUES
('VIdéoprojecteur', 'Matériel', 2);

/*INSERT INTO reservation (dateDebut, dateFin, description, ressourceId, UserId) VALUES
(NOW(), NOW() + INTERVAL 2 HOUR, 'Réunion du bureau', 1, 1);*/

INSERT INTO demande (type, dateDemande, statut, visiteurId)
VALUES 
('Evénement', '2024-05-19 14:30:00', 'En attente',1),
('Projet', '2024-05-20 10:00:00', 'Acceptée',2),
('Parrainage', '2024-05-21 08:45:00', 'Refusée',3);

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
