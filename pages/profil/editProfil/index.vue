<template>
    <div class="container mx-auto px-4 py-6">
        <NuxtLink to="/profil">  <-- retour</NuxtLink>
      <h1 class="text-2xl font-bold mb-6">Éditer le profil</h1>
      <form @submit.prevent="updateProfile">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium">Pseudo</label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username" 
            class="w-full mt-1 p-2 border rounded" 
            placeholder="Entrez votre nouveau pseudo" 
          />
        </div>
  
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="w-full mt-1 p-2 border rounded"
            placeholder="Entrez votre email"
          />
        </div>
  
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium">Nouveau mot de passe (facultatif)</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            class="w-full mt-1 p-2 border rounded"
            placeholder="Entrez un nouveau mot de passe"
          />
        </div>
  
        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Sauvegarder</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from "~/stores/auth";
  import { updateUserProfile } from "~/services/userService";
  import { reactive } from "vue";
  
  const authStore = useAuthStore();
  
  // Initialisation du formulaire avec les données utilisateur
  const form = reactive({
    username: authStore.user?.username || '',
    email: authStore.user?.email || '',
    password: '' // Champ vide pour ne pas remplacer le mot de passe par défaut
  });
  
  const updateProfile = async () => {
    try {
      const updatedUser = await updateUserProfile(authStore.user.id, authStore.token, form);
      console.log("Profil mis à jour :", updatedUser);
  
      // Mettre à jour les informations utilisateur dans le store
      authStore.user = { ...authStore.user, ...updatedUser };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
    }
  };
  </script>
  