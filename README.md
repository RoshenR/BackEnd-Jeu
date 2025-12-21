# API BackEnd-Jeu

Maets est une librairie de jeux vidéo connectée développée en Node.js / Express.
Ce Proof of Concept (POC) propose une API complète permettant de :

✅ Authentifier les utilisateurs via JWT

🎮 Gérer une librairie de jeux avec PostgreSQL (Prisma ORM)

⚙️ Gérer les configurations de jeux via MongoDB (Mongoose)

👑 Administrer les jeux et les bibliothèques utilisateur

🧾 Documenter et tester l’API avec Swagger et Postman


# Stack technique

| Technologie                  | Utilisation                                     |
| ---------------------------- | ----------------------------------------------- |
| **Node.js / Express.js**     | API REST principale                             |
| **PostgreSQL**               | Stockage principal (users, jeux, bibliothèques) |
| **Prisma ORM**               | Mapping SQL et migrations                       |
| **MongoDB (Mongoose)**       | Gestion des configurations de jeux              |
| **JWT / bcrypt**             | Authentification et rôles                       |
| **Docker Compose**           | Environnement de développement                  |
| **Swagger UI**               | Documentation interactive                       |
| **Mocha / Chai / Supertest** | Tests automatisés                               |


# Environnement de développement

Le projet est développé sous WebStorm, configuré avec :

Node.js v23.6.0

Docker Desktop (PostgreSQL + MongoDB)

Prisma CLI et Prisma Studio

mkcert (certificats HTTPS locaux)

MongoDB Compass

Postman pour les tests API


# Installation et Configuration

```
cd BackEnd-Jeu
```

```
cp .env.example .env
```

```
# Application
PORT=3001
NODE_ENV=development
JWT_SECRET=SECRET
JWT_EXPIRES_IN=7d
HTTPS=true

# PostgreSQL
DATABASE_URL="postgresql://maets:maets@127.0.0.1:5433/maets"

# MongoDB
MONGODB_URI="mongodb://localhost:27017/maets"
```

! ⚠️ Le port 5433 est utilisé pour éviter les conflits avec un Postgres local sur 5432. !

# Lancer l’environnement Docker

```
docker compose up -d
```

```
docker compose ps
```

### Exemple attendu :

| Name                   | Image       | Ports                    |
| ---------------------- | ----------- | ------------------------ |
| backend-jeu-mongo-1    | mongo:7     | 0.0.0.0:27017->27017/tcp |
| backend-jeu-postgres-1 | postgres:16 | 0.0.0.0:5433->5432/tcp   |

### Vérifier les logs

```
docker logs backend-jeu-postgres-1 --tail=20
```


# Prisma (PostgreSQL)

Générer le client Prisma
```
npx prisma generate
```

Synchroniser le schéma avec la base
```
npx prisma db push
```

Insérer des données de démonstration
```
npm run db:seed
```



# Lancer le serveur

```
npm run dev
```

### Le serveur démarre par défaut sur :

https://localhost:3001


# Documentation API

## Swagger (Documentation interactive)

Accessible à :
https://localhost:3001/docs


## Authentification (JWT)

| Méthode | Endpoint         | Auth | Description                                         |
| ------- | ---------------- | ---- | --------------------------------------------------- |
| POST    | `/auth/register` | ❌    | Crée un compte utilisateur                          |
| POST    | `/auth/login`    | ❌    | Connecte un utilisateur (retourne un JWT)           |
| GET     | `/auth/me`       | ✅    | Retourne les informations de l’utilisateur connecté |

### Exemple /auth/login

```
POST https://localhost:3000/auth/login

{
  "email": "user@dev.local",
  "password": "pass123"
}
```

## Jeux (PostgreSQL)

| Méthode | Endpoint     | Auth | Rôle  | Description         |
| ------- | ------------ | ---- | ----- | ------------------- |
| GET     | `/games`     | ✅    | Tous  | Liste tous les jeux |
| POST    | `/games`     | ✅    | Admin | Crée un jeu         |
| DELETE  | `/games/:id` | ✅    | Admin | Supprime un jeu     |


### Exemple POST /games

```
POST https://localhost:3000/games

{
  "title": "Doom",
  "publisher": "id Software",
  "year": 1993,
  "coverUrl": "https://example.com/doom.jpg"
}
```


# Bibliothèque utilisateur

| Méthode | Endpoint           | Auth | Description                        |
| ------- | ------------------ | ---- | ---------------------------------- |
| GET     | `/library`         | ✅    | Liste les jeux possédés            |
| POST    | `/library/:gameId` | ✅    | Ajoute un jeu à la bibliothèque    |
| DELETE  | `/library/:gameId` | ✅    | Supprime un jeu de la bibliothèque |


# Configurations de jeux (MongoDB)

| Méthode | Endpoint                  | Auth | Description                          |
| ------- | ------------------------- | ---- | ------------------------------------ |
| GET     | `/library/:gameId/config` | ✅    | Récupère la configuration d’un jeu   |
| PUT     | `/library/:gameId/config` | ✅    | Crée ou met à jour une configuration |


### Exemple PUT /library/1/config

```
PUT https://localhost:3000/library/1/config

{
  "settings": {
    "difficulty": "hard",
    "fov": 100
  }
}
```


# Administration

| Méthode | Endpoint       | Auth | Rôle  | Description                                      |
| ------- | -------------- | ---- | ----- | ------------------------------------------------ |
| POST    | `/admin/grant` | ✅    | Admin | Ajoute un jeu à la bibliothèque d’un utilisateur |


### Exemple

```
POST https://localhost:3000/admin/grant

{
  "userId": 2,
  "gameId": 1
}
```


# Tests

## Lancer les tests automatisés

```
npm test
```

Tests couverts :
Authentification (register, login, me)
Jeux (CRUD)
Bibliothèque (ajout/suppression/config)
Administration
Tests unitaires (services)


# Tests avec Postman

1️⃣ Ouvre Postman

2️⃣ Crée une collection BackEnd-Jeu

3️⃣ Ajoute les requêtes principales (auth, games, library, config, admin)

4️⃣ Configure l’Authorization → Type : Bearer Token

5️⃣ Copie le JWT obtenu après le login

# Dépannage

| Problème                         | Cause possible                   | Solution                                  |
| -------------------------------- | -------------------------------- | ----------------------------------------- |
| ❌ `P1000: Authentication failed` | Mauvais mot de passe PostgreSQL  | Vérifie la variable `DATABASE_URL`        |
| ❌ `Prisma ne trouve pas la base` | Conteneur arrêté                 | Lance `docker compose up -d`              |
| ❌ `JWT invalide`                 | Token expiré                     | Reconnecte-toi pour en générer un nouveau |
| ❌ `Port 5432 occupé`             | Conflit avec une instance locale | Utilise le port 5433 (déjà configuré)     |



### Tech Stack : Node.js, Express, Prisma, MongoDB, Docker