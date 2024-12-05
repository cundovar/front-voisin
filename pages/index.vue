<template>
  <div>
    <h1>Liste des Objets</h1>

    <ul class="flex space-x-2  flex-wrap">
      <NuxtLink v-for="object in objets" :key="object.id" :to="`/objects/${object.id}`">
        <li class="border p-6 bg-orange-300 " >
          <p>
            nom: {{ object.title }}

          </p>
         <div v-if="object.category?.name ">

           - Catégorie : {{ object.category?.name }}
         </div>
         <div v-else>
          <p>pas de categorie</p>
         </div>

        </li>

      </NuxtLink>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRepo } from 'pinia-orm';
import Objet from '~/models/ObjetModel';
import { useObjectsStore } from '~/stores/objects';

const store = useObjectsStore();
const repo = useRepo(Objet);
const objets = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    if (repo.query().get().length === 0) {
      // Charger les objets seulement s'ils ne sont pas déjà présents
      await store.fetchAllObjet();
    }
    objets.value = repo.query().with('category').get(); // Récupérer les objets avec leurs relations
  } catch (error) {
    console.error('Erreur lors du chargement des objets :', error);
  } finally {
    isLoading.value = false; // Fin du chargement
  }
});
</script>