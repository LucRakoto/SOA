CREATE DATABASE IF NOT EXISTS hotel_reservation_db;
USE hotel_reservation_db;

CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(50),
    type_piece_id VARCHAR(50) COMMENT 'ex: CNI, Passeport',
    num_piece VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chambres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(100) NOT NULL COMMENT 'ex: Simple, Double, Suite',
    tarif DECIMAL(10, 2) NOT NULL,
    statut_dispo ENUM('disponible', 'occupee', 'maintenance') DEFAULT 'disponible',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    chambre_id INT NOT NULL,
    date_entree DATE NOT NULL,
    date_sortie DATE NOT NULL,
    prix_total DECIMAL(10, 2),
    statut_paiement ENUM('en_attente', 'paye') DEFAULT 'en_attente',
    statut ENUM('en_attente', 'confirmee', 'annulee', 'terminee') DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (chambre_id) REFERENCES chambres(id) ON DELETE CASCADE
);
