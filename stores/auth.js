import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token, // Calculé dynamiquement en fonction du token
  },
  actions: {
    loadFromStorage() {
      this.token = localStorage.getItem('authToken');
      this.user = JSON.parse(localStorage.getItem('user'));
    },
    initAuth() {
      if (process.client) {
        this.loadFromStorage();
        if (this.token) {
          this.fetchUser(); // Charger les informations utilisateur
        }
      }
    },
    async login(userData) {
      try {
        // Mettre à jour les données utilisateur et le token
        this.user = {
          id: userData.id,
          email: userData.email,
          username: userData.username,
          roles: userData.roles,
        };
        this.token = userData.token;

        // Stocker dans le localStorage
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));

        console.log("Connexion réussie, token stocké:", this.token);
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
      }
    },
    logout() {
      // Réinitialiser l'état d'authentification
      this.user = null;
      this.token = null;

      // Supprimer les données du localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      console.log("Déconnexion réussie.");
    },

    
    async fetchUser() {
      if (!this.token) return;

      try {
        const { $axios } = useNuxtApp();
        const response = await axios.get('https://localhost:8000/api/me', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.user = response.data; // Mettre à jour les informations utilisateur
        console.log("Utilisateur récupéré:", response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        this.logout(); // Déconnecter en cas d'erreur
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
