<template>
    <div class="register-container">
      <h2>Créer un Compte</h2>
      
      <form @submit.prevent="submitRegistration">
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input v-model="username" type="text" id="username" required />
        </div>
  
        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="email" type="email" id="email" required />
        </div>
  
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input v-model="password" type="password" id="password" required />
        </div>
  
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button type="submit">S'inscrire</button>
      </form>
  
      <div class="mt-4">
        <NuxtLink to="/auth/login">Déjà un compte ? Connectez-vous ici</NuxtLink>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const router = useRouter()
  const username = ref('')
  const email = ref('')
  const password = ref('')
  const errorMessage = ref('')
  
  async function submitRegistration() {
    try {
      const response = await axios.post('https://localhost:8000/api/register', {
        username: username.value,
        email: email.value,
        password: password.value,
      })
  
      if (response.status === 201) {
        // Redirige vers la page de connexion après l'inscription réussie
        router.push('/auth/login')
      }
    } catch (error) {
      errorMessage.value = error.response?.data?.error || 'Erreur lors de l\'inscription'
    }
  }
  </script>
  
  <style scoped>
  .register-container {
    max-width: 400px;
    margin: auto;
    padding: 2rem;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .error-message {
    color: red;
  }
  </style>
  