Backend de mon projet, une librairie de jeux vidéo connectée.  
Ce POC (Proof of Concept) fournit une API complète permettant :

- ✅ Authentifier les utilisateurs (JWT)
- 🎮 Gérer une librairie de jeux (PostgreSQL via Prisma)
- ⚙️ Gérer les configurations de jeux (MongoDB via Mongoose)
- 👑 Gérer les jeux et librairies via un administrateur
- 🧾 Documenter et tester l’API (Swagger / Postman)

---

## 🧱 Stack technique

| Technologie | Utilisation |
|--------------|-------------|
| **Node.js / Express.js** | API REST |
| **PostgreSQL** | Stockage principal (users, jeux, librairies) |
| **Prisma ORM** | Mapping SQL + migrations |
| **MongoDB (Mongoose)** | Configuration des jeux |
| **JWT / bcrypt** | Authentification et rôles |
| **Docker Compose** | Environnement de développement |
| **Swagger UI** | Documentation interactive |

---

Le projet est développé sous **WebStorm**, configuré avec :
- Node.js v23.6.0
- Docker Desktop (PostgreSQL + MongoDB)
- Prisma CLI
- mkcert (HTTPS local)
- MongoDB Compass
- Prisma Studio
- Postman (tests API)
- Git Bash comme terminal intégré

---

## ⚙️ Installation & Configuration

### 1️⃣ Cloner le dépôt

```bash
git clone https://github.com/RoshenR/BackEnd-Jeu.git
cd BackEnd-Jeu
```


### 2️⃣ Créer le fichier .env

```
cp .env.example .env
```

### Et configure-le ainsi :

```
# App
PORT=3000
NODE_ENV=development
JWT_SECRET=ricardo
JWT_EXPIRES_IN=7d

# Postgres (Prisma)
DATABASE_URL="postgresql://maets:maets@127.0.0.1:5433/maets"

# Mongo
MONGODB_URI="mongodb://localhost:27017/maets"
```
⚠️ Le port 5433 est utilisé pour éviter les conflits avec un Postgres local sur 5432.





                                    🐳 Environnement Docker

### Lancer les bases de données

```
    docker compose up -d
```

### Vérifie que tout tourne :

```
    docker compose ps
```

Tu devrais voir : 

NAME                     IMAGE         COMMAND                  SERVICE    CREATED       STATUS       PORTS
backend-jeu-mongo-1      mongo:7       "docker-entrypoint.s…"   mongo      2 hours ago   Up 2 hours   0.0.0.0:27017->27017/tcp, [::]:27017->27017/tcp
backend-jeu-postgres-1   postgres:16   "docker-entrypoint.s…"   postgres   2 hours ago   Up 2 hours   0.0.0.0:5433->5432/tcp, [::]:5433->5432/tcp


### Tu peux vérifier les logs :

```
    docker logs backend-jeu-postgres-1 --tail=20
```




                                        🧩 Prisma (PostgreSQL)

### Générer le client Prisma

```
    npx prisma generate
```


### Pousser le schéma vers la base

```
    npx prisma db push
```


### (Optionnel) Insérer des données de démo

```
    npm run db:seed
```



### 🚀 Lancer le serveur

```
    npm run dev
```


### 📘 Documentation Swagger

Accès à la documentation interactive :
-> http://localhost:3000/docs


### 👤 Comptes par défaut (Seed)
Email	                Mot de passe	Rôle
admin@maets.dev	        admin123	    Admin
user@dev.local	        pass123	        Utilisateur



### 🔑 Authentification (JWT)
Méthode         Endpoint	        Auth	        Description
POST	        /auth/register	    ❌	            Inscription
POST	        /auth/login	        ❌	            Connexion (retourne JWT)
GET	            /auth/me	        ✅	            Infos utilisateur courant


### Exemple /auth/register

POST http://localhost:3000/auth/register

{
"email": "user@dev.local",
"password": "pass123"
}


### Exemple /auth/login

POST http://localhost:3000/auth/login

{
"email": "user@dev.local",
"password": "pass123"
}



| Méthode | Endpoint     | Auth | Rôle  | Description     |
| ------- | ------------ | ---- | ----- | --------------- |
| GET     | `/games`     | ✅    | Tous  | Liste les jeux  |
| POST    | `/games`     | ✅    | Admin | Ajoute un jeu   |
| DELETE  | `/games/:id` | ✅    | Admin | Supprime un jeu |


### Exemple POST /games

{
"title": "Doom",
"publisher": "id Software",
"year": 1993,
"coverUrl": "https://example.com/doom.jpg"
}


### 📚 Librairie utilisateur

Méthode 	Endpoint	        Auth	    Description
GET     	/library	        ✅	        Liste les jeux possédés
POST	    /library/:gameId	✅	        Ajoute un jeu
DELETE  	/library/:gameId	✅	        Supprime un jeu


### ⚙️ Configurations (MongoDB)
Méthode	    Endpoint	                 Auth	    Description
GET	        /library/:gameId/config	     ✅	        Récupère la config
PUT	        /library/:gameId/config	     ✅      	Met à jour ou crée une config


### Exemple PUT /library/1/config

{
"settings": {
"difficulty": "hard",
"fov": 100
}
}


### 👑 Administration
Méthode	    Endpoint	    Auth	Rôle	Description
POST	    /admin/grant	✅	    Admin	Ajoute un jeu à la librairie d’un utilisateur

### Exemple

POST http://localhost:3000/admin/grant
{
"userId": 2,
"gameId": 1
}



### 💻 Tests avec Postman

1️⃣ Ouvre Postman
2️⃣ Crée une collection "Maets API"
3️⃣ Ajoute les requêtes suivantes :

Étape	                Méthode	        URL	                                        Headers	                                    Body

Inscription	            POST	        http://localhost:3000/auth/register	        Content-Type: application/json	             { "email":"user@dev.local","password":"pass123" }
Connexion	            POST	        http://localhost:3000/auth/login	        Content-Type: application/json	             idem
Lister jeux 	        GET	            http://localhost:3000/games	                Authorization: Bearer TOKEN	                 —
Ajouter jeu (admin)	    POST	        http://localhost:3000/games	                Authorization: Bearer TOKEN_ADMIN	         { "title":"Doom","publisher":"id Software","year":1993 }
Librairie	            GET	            http://localhost:3000/library	            Authorization: Bearer TOKEN	                 —
Modifier config	        PUT	            http://localhost:3000/library/1/config	    Authorization: Bearer TOKEN	                 { "settings":{"difficulty":"hard","fov":100} }

### 🔒 Dans Postman : onglet Authorization → Type = Bearer Token → colle ton JWT.



### 🧰 Dépannage
Problème	                         Solution
❌ P1000:                            Authentication failed	Vérifie ton port PostgreSQL et ta variable DATABASE_URL
❌ Prisma ne trouve pas la base	     Lance docker compose up -d
❌ JWT invalide	                     Reconnecte-toi pour regénérer un token
❌ Port 5432 occupé	                 Utilise le port 5433 (déjà configuré ici)



### 🧾 Auteur

Projet développé par Ricardo Rosmaninho
🎓 Projet scolaire – 2025
💻 Tech : Node.js, Express, Prisma, MongoDB, Docker, Postgre
📧 Contact : ricardo.rosmaninho-henriques@efrei.net