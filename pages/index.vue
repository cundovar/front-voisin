<template>
  <div>
    <h1>Liste des Objets</h1>

    <ul class="flex space-x-2  flex-wrap">
      <NuxtLink v-for="object in objets" :key="object.id" :to="`/objects/${object.id}`">
        <li class="border p-6 bg-orange-300 " >
         nom: {{ object.title }}
           - Catégorie : {{ object.category?.name }}
        </li>

      </NuxtLink>
    </ul>
  </div>
</template>

<script>
import Objet from '~/models/ObjetModel';
import { useRepo } from 'pinia-orm';

export default {
  async setup() {
    const repo = useRepo(Objet);

    try {
      await Objet.fetchAllObjet(); // Charger les objets via l'API

      // Charger les objets avec leurs relations
      const objets = repo.query().with('category').get();
      return {
        objets,
      };
    } catch (error) {
      console.error('Erreur lors du chargement des objets:', error);
      return {
        objets: [],
      };
    }
  },
};
</script>
