<template>
  <div v-if="object">
    <h1>Détails de l'Objet</h1>
    <p><strong>Nom :</strong> {{ object.title }}</p>
    <p><strong>Description :</strong> {{ object.description }}</p>
    <p><strong>Catégorie :</strong> {{ object.category?.name }}</p>
    <p><strong>Utilisateur :</strong> {{ object.user?.name }}</p>
  </div>
  <div v-else>
    <p>Chargement en cours...</p>
  </div>
</template>

<script setup>
import { useRepo } from 'pinia-orm';
import Objet from '~/models/ObjetModel';

// Utiliser `useAsyncData` pour charger les données dynamiques
const { data: object, error } = await useAsyncData(async () => {
  const repo = useRepo(Objet);

  try {
// Obtenir l'ID depuis la route
const route = useRoute();
console.log('route',route)

const objectId = route.params.id;
console.log('routeParam',route.params)

const { data: object, error } = await useAsyncData(async () => {
  const repo = useRepo(Objet);

  // Vérifier si l'objet est déjà dans le store
  const object = repo.query()
    .with('category')
    .with('user')
    .find(objectId);

  if (!object) {
    // Si l'objet n'existe pas, charger depuis l'API
    await Objet.fetchAllObjet();
    object = repo.query()
      .with('category')
      .with('user')
      .find(objectId);

    if (!object) {
      throw new Error('Objet introuvable');
    }
  }

  return object;
});






 

  } catch (err) {
    console.error('Erreur lors du chargement de l\'objet :', err);
    return null; // Retourne null si l'objet est introuvable
  }
});
</script>
