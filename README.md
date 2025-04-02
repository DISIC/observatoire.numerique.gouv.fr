# Vos démarches essentielles

Ce dépôt contient le code du site observatoire.numerique.gouv.fr, un site gouvernemental dédié à l'évaluation collaborative des démarches administratives.

# Développement

## Base de donnée

Pour lancer la base de donnée MongoDB

```
docker compose up -d
```

## Frontend NextJS

Copier le .env.example

```
cp .env.example .env
```

Installer les dépendances (npm version >= 18)

```
yarn
```

Insérer les seed (payloadcms)

```
yarn seed:dev
```

Lancer le frontend en local

```
yarn dev
```

Utilisateur admin seed

| Email          | Rôle    | Compte activé | Ancien compte observatoire | Mot de passe |
| -------------- | ------- | ------------- | -------------------------- | ------------ |
| admin@test.loc | Porteur | Non           | Non                        | admin123     |
