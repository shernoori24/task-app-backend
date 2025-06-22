import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import axios from 'axios';

// URL de base pour l'API backend
const API_URL = "http://192.168.43.127:3000";

// Définition du type Task
type Task = {
  _id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  createdAt: string;
};

// Couleurs pour les statuts des tâches
const statusColors = {
  todo: 'gray',
  in_progress: 'blue',
  done: 'green',
};

// Composant pour afficher une tâche
const TaskItem = ({ task }: { task: Task }) => (
  <View style={[styles.taskItem, { borderLeftColor: statusColors[task.status] }]}>
    <Text style={styles.taskTitle}>{task.title}</Text>
    <Text style={[styles.taskStatus, { color: statusColors[task.status] }]}>{task.status}</Text>
  </View>
);

const App = () => {
  // État pour stocker la liste des tâches
  const [tasks, setTasks] = useState<Task[]>([]);
  // État pour indiquer si la simulation est en cours
  const [isSimulating, setIsSimulating] = useState(false);
  // Ref pour suivre la date de création la plus récente pour récupérer les nouvelles tâches
  const latestCreatedAt = useRef<string | null>(null);

  // Initialiser latestCreatedAt à une date passée au premier chargement
  useEffect(() => {
    if (!latestCreatedAt.current) {
      latestCreatedAt.current = new Date(0).toISOString();
    }
  }, []);

  // Fonction pour récupérer les nouvelles tâches créées après latestCreatedAt
  const fetchNewTasks = useCallback(async () => {
    try {
      const afterParam = latestCreatedAt.current ? `?after=${latestCreatedAt.current}` : '';
      console.log('Récupération des nouvelles tâches après :', afterParam);
      const response = await axios.get<Task[]>(`${API_URL}/tasks${afterParam}`);
      const newTasks = response.data;
      console.log('Nombre de nouvelles tâches récupérées :', newTasks.length);
      if (newTasks.length > 0) {
        setTasks(prevTasks => {
          // Filtrer les tâches déjà présentes dans prevTasks par _id
          const existingIds = new Set(prevTasks.map(task => task._id));
          const filteredNewTasks = newTasks.filter(task => !existingIds.has(task._id));
          if (filteredNewTasks.length === 0) {
            return prevTasks;
          }
          // Mettre à jour latestCreatedAt avec la date de création de la dernière tâche
          latestCreatedAt.current = filteredNewTasks[filteredNewTasks.length - 1].createdAt;
          // Ajouter les nouvelles tâches à la liste existante
          return [...prevTasks, ...filteredNewTasks];
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches :', error);
    }
  }, []);

  // Récupérer les nouvelles tâches au montage du composant et toutes les 5 secondes
  useEffect(() => {
    fetchNewTasks();
    const interval = setInterval(fetchNewTasks, 5000);
    return () => clearInterval(interval);
  }, [fetchNewTasks]);

  // Gestionnaire du clic sur le bouton de simulation
  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      console.log('Bouton de simulation cliqué');
      await axios.post(`${API_URL}/simulate`);
      console.log('Requête de simulation envoyée');
      await fetchNewTasks();
    } catch (error) {
      console.error('Erreur lors de la simulation des tâches :', error);
    } finally {
      setIsSimulating(false);
    }
  };

  // Fonction de rendu pour chaque tâche
  const renderItem = ({ item }: { item: Task }) => {
    console.log('Rendu de l\'élément avec la clé :', item._id);
    return <TaskItem task={item} />;
  };

  return (
    <View style={styles.container}>
      <Button title={isSimulating ? "Simulation en cours..." : "Simuler l'ajout de tâches"} onPress={handleSimulate} disabled={isSimulating} />
      <FlatList
        data={tasks}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default App;

// Styles pour les composants de l'application
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  list: {
    marginTop: 20,
  },
  taskItem: {
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskStatus: {
    marginTop: 5,
    fontSize: 14,
  },
});
