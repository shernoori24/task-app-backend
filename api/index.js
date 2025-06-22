const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

/* Création de l'application Express */
const app = express();
const port = 3000;

/* Middleware pour parser les corps JSON et activer CORS */
app.use(bodyParser.json());
app.use(cors());

/* Chaîne de connexion MongoDB */
const MONGOURL = "mongodb+srv://shernoori24:shernoori241@cluster0.ka7oecr.mongodb.net/task_app?retryWrites=true&w=majority&appName=Cluster0";

/* Connexion à MongoDB */
mongoose.connect(MONGOURL)
  .then(() => console.log("Connecté à MongoDB"))
  .catch(err => console.error("Erreur de connexion MongoDB :", err));

/* Définition du schéma Task avec les champs title, status et createdAt */
const taskSchema = new mongoose.Schema({
  title: String,
  status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
  createdAt: { type: Date, default: Date.now, index: true }
});

/* Création du modèle Task à partir du schéma */
const Task = mongoose.model('Task', taskSchema);

/* Endpoint GET /tasks pour récupérer les tâches créées après une date donnée (max 20) */
app.get('/tasks', async (req, res) => {
  try {
    /* Analyse du paramètre 'after' ou valeur par défaut (début de l'époque) */
    const after = req.query.after ? new Date(req.query.after) : new Date(0);
    /* Recherche des tâches créées après la date spécifiée, triées par date croissante */
    const tasks = await Task.find({ createdAt: { $gt: after } })
      .sort({ createdAt: 1 })
      .limit(20);
    /* Renvoi des tâches au format JSON */
    res.json(tasks);
  } catch (err) {
    /* Gestion des erreurs avec réponse 500 */
    res.status(500).json({ message: err.message });
  }
});

/* Endpoint POST /simulate pour créer 10 tâches simulées */
app.post('/simulate', async (req, res) => {
  try {
    console.log("Endpoint simulate appelé");
    /* Création de 10 tâches avec un statut aléatoire */
    for (let i = 0; i < 10; i++) {
      console.log(`Création de la tâche ${i + 1}`);
      await Task.create({
        title: `Tâche simulée ${i + 1}`,
        status: ['todo', 'in_progress', 'done'][Math.floor(Math.random() * 3)],
        /* createdAt est défini automatiquement par MongoDB */
      });
    }
    console.log("Toutes les tâches ont été créées");
    /* Réponse de succès */
    res.status(201).json({ message: '10 tâches simulées' });
  } catch (err) {
    console.error("Erreur dans l'endpoint simulate :", err);
    res.status(500).json({ message: err.message });
  }
});

/* Démarrage du serveur sur le port spécifié */
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
