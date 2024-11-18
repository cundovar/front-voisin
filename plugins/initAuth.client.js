// plugins/initAuth.js
export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
      console.log("Plugin authInit chargé");
      const authStore = useAuthStore();
      
      const storedToken = localStorage.getItem('authToken');
      console.log("Token dans localStorage au chargement du plugin:", storedToken);
      
      // Appeler initAuth pour initialiser l'état de l'utilisateur
      authStore.initAuth();
  }
});
