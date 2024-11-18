import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
  }),

  actions: {
    initAuth() {
      if (process.client) {
        const savedToken = localStorage.getItem('authToken');
        // console.log("InitAuth - Token récupéré depuis localStorage:", savedToken);
        if (savedToken) {
          this.token = savedToken;
          this.isAuthenticated = true;
          // console.log("Token initialisé dans le store:", this.token);
          // console.log("Appel de fetchUser dans initAuth");
          this.fetchUser(); // Appeler fetchUser avec le token existant
        } else {
          console.log("Aucun token trouvé dans localStorage");
        }
      }
    },

    async login(userData) {
      try {
        this.user = {
          id: userData.id,
          email: userData.email,
          username: userData.username,
          roles: userData.roles,
        };
        this.token = userData.token;
        this.isAuthenticated = true;
        console.log("Token après connexion:", this.token);

        // Stocker le token dans localStorage côté client
        if (process.client) {
          localStorage.setItem('authToken', this.token);
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
      }
    },

    logout() {
      // Réinitialiser l'état d'authentification
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;

      // Supprimer le token du localStorage côté client
      if (process.client) {
        localStorage.removeItem('authToken');
      }
    },

    async fetchUser() {
      if (!this.token) return;

      try {
        // Utiliser l'instance Axios injectée par Nuxt
        const { $axios } = useNuxtApp();
        const response = await axios.get('https://localhost:8000/api/me', {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });
        
        this.user = response.data; // Stocker les données utilisateur
        console.log("Réponse des données utilisateur:", response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        this.logout(); // Déconnecter l'utilisateur si une erreur survient
      }
    },
  },

  // Watcher pour sauvegarder le token dans localStorage automatiquement
  watch: {
    token(newToken) {
      if (process.client && newToken) {
        localStorage.setItem('authToken', newToken);
        console.log("Token mis à jour dans le watcher:", newToken);
      }
    }
  }
});
