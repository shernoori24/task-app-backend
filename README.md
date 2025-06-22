# Application de Gestion de Tâches - Backend et Frontend

## Présentation

Ce projet est une application mobile de gestion de tâches avec un backend Node.js + MongoDB et un frontend React Native. L'application permet d'afficher une liste de tâches et de voir automatiquement les nouvelles tâches créées côté backend, simulant un environnement multi-utilisateurs.

## Backend

- Développé avec Node.js, Express et MongoDB (Mongoose).
- Fournit les endpoints REST suivants :
  - `GET /tasks?after=<date>` : Retourne jusqu'à 20 tâches créées après la date spécifiée.
  - `POST /simulate` : Crée automatiquement 10 tâches simulées avec des statuts aléatoires.

## Frontend

- Développé avec React Native et Expo.
- Affiche une liste dynamique de tâches avec FlatList.
- Met à jour automatiquement la liste toutes les 5 secondes sans recharger toute la liste.
- Bouton pour simuler l'ajout de tâches en appelant l'endpoint `/simulate` du backend.
- Utilisation appropriée des hooks React (`useEffect`, `useCallback`, `useRef`) pour la gestion asynchrone des données et de l'état.

## Installation

### Backend

1. Se placer dans le dossier `api` :
   ```
   cd api
   ```
2. Installer les dépendances (les dossiers `node_modules` ne sont pas inclus dans le dépôt Git) :
   ```
   npm install
   ```
3. Lancer le serveur backend :
   ```
   node index.js
   ```
   Le serveur écoute sur le port 3000.

### Frontend

1. Se placer dans le dossier `task_app` :
   ```
   cd task_app
   ```
2. Installer les dépendances (les dossiers `node_modules` ne sont pas inclus dans le dépôt Git) :
   ```
   npm install
   ```
3. Lancer le serveur de développement Expo :
   ```
   npm start
   ```
4. Utiliser l'application Expo Go sur votre téléphone pour scanner le QR code et lancer l'application.

## Remarques

- Assurez-vous que votre téléphone et votre machine de développement sont connectés au même réseau.
- L'URL de l'API dans le frontend est configurée avec l'adresse IP locale de la machine de développement.
- La chaîne de connexion MongoDB est configurée dans `api/index.js`.

## Licence

Ce projet est fourni tel quel à des fins de démonstration.
