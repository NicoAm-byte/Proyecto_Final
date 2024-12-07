drop database if exists gameburst;
CREATE DATABASE gameburst;
USE gameburst;

-- Tabla de cuentas (usuarios)
CREATE TABLE cuentas (
    id_cuenta INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nac DATE NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL
);

-- Tabla de juegos
CREATE TABLE juegos (
    id_juego INT AUTO_INCREMENT PRIMARY KEY,
    nom_juego VARCHAR(100) NOT NULL,
    detalles_juego TEXT NOT NULL
);

-- Tabla de progreso (relación entre cuentas y juegos)
CREATE TABLE progreso (
    id_progreso INT AUTO_INCREMENT PRIMARY KEY,
    id_cuenta INT NOT NULL,
    id_juego INT NOT NULL,
    nivel INT DEFAULT 0,
    misiones INT DEFAULT 0,
    logros INT DEFAULT 0,
    horas_invertidas DECIMAL(5,2) DEFAULT 0.00,
    FOREIGN KEY (id_cuenta) REFERENCES cuentas(id_cuenta),
    FOREIGN KEY (id_juego) REFERENCES juegos(id_juego)
);

-- Tabla de personajes (personajes creados por los usuarios en los juegos)
CREATE TABLE personajes (
    id_personaje INT AUTO_INCREMENT PRIMARY KEY,
    id_cuenta INT NOT NULL,
    id_juego INT NOT NULL,
    nombre_personaje VARCHAR(100) NOT NULL,
    nivel INT DEFAULT 1,
    clase VARCHAR(50),
    habilidades TEXT,
    nivel_hab1 INT DEFAULT 0,
    nivel_hab2 INT DEFAULT 0,
    nivel_hab3 INT DEFAULT 0,
    nivel_hab4 INT DEFAULT 0,
    FOREIGN KEY (id_cuenta) REFERENCES cuentas(id_cuenta),
    FOREIGN KEY (id_juego) REFERENCES juegos(id_juego)
);

-- Tabla de géneros (categorías para los juegos)
CREATE TABLE generos (
    id_genero INT AUTO_INCREMENT PRIMARY KEY,
    nombre_genero VARCHAR(50) UNIQUE NOT NULL
);

-- Relación muchos-a-muchos entre juegos y géneros
CREATE TABLE juego_genero (
    id_juego INT NOT NULL,
    id_genero INT NOT NULL,
    PRIMARY KEY (id_juego, id_genero),
    FOREIGN KEY (id_juego) REFERENCES juegos(id_juego),
    FOREIGN KEY (id_genero) REFERENCES generos(id_genero)
);

-- Tabla de plataformas (plataformas donde están disponibles los juegos)
CREATE TABLE plataformas (
    id_plataforma INT AUTO_INCREMENT PRIMARY KEY,
    nombre_plataforma VARCHAR(50) UNIQUE NOT NULL
);

-- Relación muchos-a-muchos entre juegos y plataformas
CREATE TABLE juego_plataforma (
    id_juego INT NOT NULL,
    id_plataforma INT NOT NULL,
    PRIMARY KEY (id_juego, id_plataforma),
    FOREIGN KEY (id_juego) REFERENCES juegos(id_juego),
    FOREIGN KEY (id_plataforma) REFERENCES plataformas(id_plataforma)
);