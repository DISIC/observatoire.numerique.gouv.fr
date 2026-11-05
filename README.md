# Vos démarches essentielles

Ce dépôt contient le code du site observatoire.numerique.gouv.fr, un site gouvernemental dédié à l'évaluation collaborative des démarches administratives.

# Développement

## Base de donnée

Pour lancer la base de donnée PostgreSQL

```
docker compose up -d
```

Les tables Payload sont dans le schéma `payload` (migrations dans `src/migrations`), celles de Prisma dans `public`.

## Frontend NextJS

Copier le .env.example

```
cp .env.example .env
```

Installer les dépendances (npm version >= 18)

```
yarn
```

Créer les tables Prisma

```
yarn prisma db push
```

Créer les tables Payload et insérer les seed (payloadcms)

```
yarn seed:dev
```

Après une modification d'une collection Payload, générer la migration correspondante

```
yarn payload migrate:create <nom>
```

## Migration des données depuis l'ancienne base MongoDB

Le script lit l'ancienne base et écrit dans PostgreSQL (tables créées au préalable par `yarn payload migrate` et `yarn prisma db push`).
Il refuse d'écrire dans des tables non vides, sauf avec `--reset`.

```
MONGO_SOURCE_URI=mongodb://... yarn migrate:mongo-to-postgres --dry-run
MONGO_SOURCE_URI=mongodb://... yarn migrate:mongo-to-postgres
```

Pour tester en local avec une copie de la base : `docker compose --profile migration up -d` lance aussi un MongoDB.

Lancer le frontend en local

```
yarn dev
```

Utilisateur admin seed

| Email          | Rôle    | Compte activé | Ancien compte observatoire | Mot de passe |
| -------------- | ------- | ------------- | -------------------------- | ------------ |
| admin@test.loc | Porteur | Non           | Non                        | admin123     |
