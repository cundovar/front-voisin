<template>
<div v-if="object">
  <form @submit.prevent="updateObjet">
    <div class="mb-4">
      <label for="title">Titre</label>
      <input
        type="text"
        id="title"
        v-model="form.title"
        placeholder="Entrez votre nouveau titre"
        class="border px-2 py-1 w-full"
      />
    </div>
    <div class="mb-4">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="form.description"
        placeholder="Entrez votre nouvelle description"
        class="border px-2 py-1 w-full"
      ></textarea>
    </div>
    <button
      type="submit"
      class="px-4 py-2 bg-blue-500 text-white rounded"
      :disabled="!form.title || !form.description"
    >
      Sauvegarder
    </button>
  </form>
</div>
<div v-else>
  <p>Chargement en cours ou objet introuvable...</p>
</div>
    </template>

    <script setup>
import { computed, onMounted } from 'vue';
import { useObjectsStore } from '~/stores/objects';
import { useRoute,useRouter } from 'vue-router';
import { useAuthStore } from "~/stores/auth";
import { reactive } from "vue";

const authStore = useAuthStore();
const route=useRoute()
const store=useObjectsStore()
const router = useRouter(); // Initialisez useRouter

const objetId = route.params.objetId;
console.log('Objet ID :', objetId);
const object=computed(()=>store.currentObjet)
console.log('curentobjé',object)
const form=reactive({
    title: '',
    description: '',
})
onMounted(async ()=>{
    try{
        await store.fetchOneObjet(route.params.id)
        if (object.value) {
            form.title = object.value.title;
            form.description = object.value.description;
        }
    }catch(error){
        console.error('erreur chargement objet',error)
        if(!authStore.token){
          router.push("/")

        }
    }
})



const updateObjet= async ()=>{
    try{
        await store.updateObjet(   { ...form, id: object.value.id }, // Inclure l'ID de l'objet
            authStore.user.id
        )

        alert('Objet mis à jour avec succès !')
        router.push('/profil'); // Redirection
    }catch(error){
        console.error('erreur lors de la mise à jour de l\'objet;',error)
        
        alert('une erreur est survenue')
    }
}



</script>