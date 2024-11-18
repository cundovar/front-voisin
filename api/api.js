import axios from "axios";
import { ElMessage } from "element-plus";
import { useAuthStore } from "../stores/auth";

// Créez une instance Axios avec la configuration de base
export const service = axios.create({
  baseURL: "https://localhost:8000/",
  withCredentials: true,
  timeout: 5000,
});

export default defineNuxtPlugin((nuxtApp) => {
  // Injecte Axios en tant que `$axios`
  nuxtApp.provide('axios', service);
});

// Intercepteur de requêtes pour ajouter le token d'authentification
service.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore(); // Accès au store Pinia
    const token = authStore.token;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Utilisation correcte des backticks
    }
    return config;
  },
  (error) => {
    console.error("Erreur requête", error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponses pour gérer les erreurs et les messages
service.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur réponse", error);

    ElMessage({
      message: error.message || "Erreur lors de la requête",
      type: "error",
      duration: 5000,
    });

    return Promise.reject(error);
  }
);
