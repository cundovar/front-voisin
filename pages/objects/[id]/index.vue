<template>
    <div v-if="object">
      <h1>Détails de l'Objet</h1>
      <p><strong>Nom :</strong> {{ object.title }}</p>
      <p><strong>Description :</strong> {{ object.description }}</p>
      <p><strong>Catégorie :</strong> {{ object.category?.name }}</p>
      <p><strong>posté par :</strong> {{ object.user?.name }}</p>
    </div>
    <div v-else>
      <p>Chargement en cours ou objet introuvable...</p>
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted } from 'vue';
  import { useObjectsStore } from '~/stores/objects';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const store = useObjectsStore();
  
  const object = computed(() => store.currentObjet); // Lier `store.currentObjet` au template
  console.log('currentobjet',object)
  onMounted(async () => {
    try {
      await store.fetchOneObjet(route.params.id); // Charger l'objet via l'ID de la route
     
    } catch (error) {
      console.error('Erreur lors du chargement de l\'objet :', error);
    }
  
  // 1  computed : Propriété Calculée
  // computed est une méthode fournie par Vue.js pour créer des propriétés calculées. Une propriété calculée est dérivée d'autres données réactives, et elle est mise à jour automatiquement lorsque les données dont elle dépend changent.
  
  // Caractéristiques :
  // Réactivité : Les propriétés calculées réagissent automatiquement aux changements des données dont elles dépendent.
  // Caching : La valeur calculée est mise en cache et ne sera recalculée que si ses dépendances changent.
  // Lecture seule : Les propriétés calculées ne modifient pas directement les données, elles sont uniquement dérivées de celles-ci.
  
  // 2 onMounted : Cycle de Vie du Composant
  // onMounted est un hook de cycle de vie de Vue 3 qui exécute une fonction une fois que le composant a été monté dans le DOM.
  
  // Caractéristiques :
  // Moment d'exécution : Il est appelé après que le composant a été monté (les éléments HTML générés sont ajoutés au DOM).
  // Utilisation typique : Charger des données, initialiser des événements ou effectuer des actions nécessitant que le DOM soit prêt.
  
  });
  </script>
  