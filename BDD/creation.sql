DROP DATABASE IF EXISTS ECAF;
CREATE DATABASE ECAF;

USE ECAF;


CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    motDePasse VARCHAR(255),
    role ENUM('Visiteur', 'Administrateur', 'Adherent') NOT NULL,
    dateInscription DATE NOT NULL,
    estBenevole BOOLEAN DEFAULT FALSE,
    parrainId INT,
    FOREIGN KEY (parrainId) REFERENCES user(id)
);

CREATE TABLE fonctionnalite (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE droit (
    id int AUTO_INCREMENT,
    userId INT,
    fonctionnaliteId INT,
    FOREIGN KEY (userId) REFERENCES user(id),
    FOREIGN KEY (fonctionnaliteId) REFERENCES fonctionnalite(id),
    PRIMARY KEY (id, userId, fonctionnaliteId)
);

CREATE TABLE tache (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT NOT NULL,
    dateDebut DATETIME NOT NULL,
    dateFin DATETIME,
    statut ENUM('En cours', 'Fini') NOT NULL,
    responsableId INT,
    FOREIGN KEY (responsableId) REFERENCES user(id)
);

CREATE TABLE evenement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    description TEXT NOT NULL,
    lieu VARCHAR(255) NOT NULL,
    estProposition BOOLEAN NOT NULL
);

CREATE TABLE inscription (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    eventId INT NOT NULL,
    statut VARCHAR(50) NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id),
    FOREIGN KEY (eventId) REFERENCES evenement(id)
);

CREATE TABLE ag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    quorum INT NOT NULL
);

CREATE TABLE participationAG (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    agId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id),
    FOREIGN KEY (agId) REFERENCES ag(id)
);

CREATE TABLE proposition (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    agId INT NOT NULL,
    FOREIGN KEY (agId) REFERENCES ag(id)
);

CREATE TABLE vote (
    id INT AUTO_INCREMENT PRIMARY KEY,
    propositionId INT NOT NULL,
    userId INT NOT NULL,
    choix VARCHAR(255) NOT NULL,
    FOREIGN KEY (propositionId) REFERENCES proposition(id),
    FOREIGN KEY (userId) REFERENCES user(id)
);

CREATE TABLE transaction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    montant DECIMAL(10, 2) NOT NULL,
    type ENUM('Don', 'Cotisation', 'Paiement evenement', 'Inscription') NOT NULL,
    date DATETIME NOT NULL,
    userId INT NOT NULL,
    eventId INT DEFAULT NULL,
    FOREIGN KEY (eventId) REFERENCES evenement(id),
    FOREIGN KEY (userId) REFERENCES user(id)
);

CREATE TABLE document (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    cheminAcces TEXT NOT NULL,
    userId INT,
    FOREIGN KEY (userId) REFERENCES user(id)
);

CREATE TABLE ressource (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    type ENUM('Salle', 'Matériel', 'Alimentaire') NOT NULL,
    statut ENUM('Disponible', 'Réservé') NOT NULL,
    emplacement VARCHAR(255) NOT NULL
);

CREATE TABLE reservation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dateDebut DATETIME NOT NULL,
    dateFin DATETIME NOT NULL,
    description TEXT NOT NULL,
    ressourceId INT NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (ressourceId) REFERENCES ressource(id),
    FOREIGN KEY (userId) REFERENCES user(id)
);

CREATE TABLE token (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    userId INT REFERENCES user(id)
);
