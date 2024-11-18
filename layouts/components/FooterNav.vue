<template>
<div class="footernav flex items-center justify-around ">
    <button class="btn btn-danger">accueil</button>
    <button class="btn btn-danger">publier</button>
    <client-only>

 
     <template v-if="authStore.isAuthenticated">

        <NuxtLink class="nav-link cursor-pointer" to="/profil">Profil</NuxtLink>
              <NuxtLink @click.prevent="logout" class="nav-link cursor-pointer">Logout</NuxtLink>
     </template>

     <template v-else>
        <NuxtLink class="nav-link cursor-pointer" to="/auth/login">Login</NuxtLink>
    </template>
     
     
    </client-only>
    <button class="btn btn-danger">message</button>
    
    
</div>

</template>
<style>
.footernav{
    position:fixed;
    height: 3rem;
    border: 1px solid black;
    bottom: 0;
    width: 100%;
}


</style>

<script setup>

import { onMounted } from 'vue';
import { useAuthStore } from "~/stores/auth";
import { useRouter } from 'nuxt/app';
//acceder au store d'indentifacation
const authStore = useAuthStore();
const router = useRouter();
onMounted(()=>{
  
  authStore.initAuth(); // Initialise l'authentification au démarrage de l'application
})
console.log("user",authStore.initAuth)
function logout() {
  authStore.logout();
  //redirection
  router.push("/"); // Redirection vers la page d'accueil
}



</script>