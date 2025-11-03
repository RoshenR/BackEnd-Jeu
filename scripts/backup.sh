#!/bin/bash
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
mkdir -p backups

# Sauvegarde Postgres
docker exec backend-jeu-postgres-1 pg_dump -U maets maets > backups/pg_${DATE}.sql

# Sauvegarde MongoDB
docker exec backend-jeu-mongo-1 mongodump --archive=backups/mongo_${DATE}.gz --gzip

echo "✅ Backup completed at ${DATE}"
