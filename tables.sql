CREATE DATABASE laboleria;

CREATE TABLE cakes(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    price NUMERIC NOT NULL,
    image VARCHAR(2000) NOT NULL,
    description TEXT DEFAULT ""
);

CREATE TABLE clients(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(1000) NOT NULL,
    phone VARCHAR(40) NOT NULL
);

CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    "clientId" INTEGER NOT NULL REFERENCES clients("id"),
    "cakeId" INTEGER NOT NULL REFERENCES cakes("id"),
    quantity INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    "totalPrice" NUMERIC NOT NULL DEFAULT 0,
    "isDelivered" BOOLEAN NOT NULL DEFAULT FALSE
);