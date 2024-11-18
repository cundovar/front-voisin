<template>
  <header>
    <client-only>
      <div class="absolute z-50" v-if="authStore.isAuthenticated">
        Bonjour {{ authStore.user?.username }}
      </div>
    </client-only>
      <!-- Barre de navigation -->
      <nav class="navbar navbar-expand-lg navbar-light p-5 bg-light">
        <NuxtLink class="nav-link text-black" to="/">Accueil</NuxtLink>
        <client-only>
          <!-- Afficher le lien approprié selon l'état d'authentification -->
          <template v-if="authStore.isAuthenticated">
            <div class="border absolute right-10">

              <NuxtLink class="nav-link cursor-pointer" to="/profil">Profil</NuxtLink>
              <NuxtLink @click.prevent="logout" class="nav-link cursor-pointer">Logout</NuxtLink>

            </div>
        </template>
        <template v-else>
          <NuxtLink class="nav-link cursor-pointer" to="/auth/login">Login</NuxtLink>
        </template>
      </client-only>
      </nav>
  </header>
</template>

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
// Encapsulation avec <client-only> : Cette approche garantit que tout ce qui est conditionné par authStore.isAuthenticated n'est rendu qu'après le montage côté client. Cela empêche Nuxt de rendre des éléments v-if et v-else côté serveur, qui peuvent provoquer des discordances DOM.

// onMounted pour initAuth : Utiliser onMounted pour appeler authStore.initAuth() permet de s'assurer que l'authentification est initialisée uniquement côté client, réduisant ainsi les risques d'erreurs SSR.
</script>
