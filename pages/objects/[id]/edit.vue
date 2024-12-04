<template>
    <div class="container mx-auto">
        <h1>Editer objet</h1>
        <NuxtLink to="/profil">  <-- retour</NuxtLink>
    </div>
    <div v-if="object">
       
      <form @submit.prevent="updateObjet" >
<div class="mb-4">
    <label for="title">titre</label>
    <input 
    type="text"
    id="title"
   v-model="object.title" 
    placeholder="Entrez votre nouveau titre"
    class="border px-2 py-1 w-full"
    
    />
</div>
<div class="mb-4">
    <label for="title">déscription</label>
    <input 
    type="text"
    id="description"
   v-model="object.description" 
    placeholder="Entrez votre nouvelle description"
    class="border px-2 py-1 w-full"
    
    />
</div>

<button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Sauvegarder</button>
      </form>
    </div> <div v-else>
      <p>Chargement en cours ou objet introuvable...</p>
    </div>
        
    </template>

    <script setup>
import { computed, onMounted } from 'vue';
import { useObjectsStore } from '~/stores/objects';
import { useRoute } from 'vue-router';
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const route=useRoute()
const store=useObjectsStore()


const object=computed(()=>store.currentObjet)
console.log('curentobjé',object)
onMounted(async ()=>{
    try{
        await store.fetchOneObjet(route.params.id)
    }catch(error){
        console.error('erreur chargement objet',error)
    }
})

const updateObjet= async ()=>{
    try{
        await store.updateObjet(object.value,authStore.user.id)
        console.log("store.id : ", authStore.user.id);
        console.log("store.updateObjet : ", store.updateObjet);
        
        alert('Objet mis à jour avec succès !')
    }catch(error){
        console.error('erreur lors de la mise à jour de l\'objet;',error)
        alert('une erreur est survenue')
    }
}



</script>