<template>
<h1>
    ajouter un objet
</h1>
<form @submit.prevent="addNewObjet">
      <input v-model="newObjet.title" placeholder="Titre" required />
      <input v-model="newObjet.description" placeholder="Description" required />
      <!-- <select v-model="newObjet.category">
        <option disabled value="">Sélectionnez une catégorie</option>
        <option v-for="category in store.categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select> -->
      <button type="submit">Ajouter</button>
    </form>
</template>

<script setup>
import { useObjectsStore } from '~/stores/objects';
import { useAuthStore } from '~/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const store = useObjectsStore();
const router=useRouter()

const newObjet = ref({
  title: '',
  description: '',
//   category: null, // ID de la catégorie sélectionnée
});
const addNewObjet = async () => {
  console.log('Avant l\'appel de addOdjet'); // Vérifier si cette partie s’exécute
  try {
     await store.addOdjet(
      authStore.user.id,
      authStore.token,
      newObjet.value
    );
    console.log('Après l\'appel de addOdjet'); // Vérifier si l'appel réussit
    alert('Objet ajouté avec succès');
    router.push('/profil')
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'objet:', error);
    alert('Erreur lors de l\'ajout de l\'objet');
  }
};
</script>