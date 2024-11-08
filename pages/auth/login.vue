<template>
    <div class="login-form">
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Entrez votre email"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Entrez votre mot de passe"
            required
          />
        </div>
  
        <button type="submit">Connexion</button>
      </form>
  
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import { login } from '@/services/authServices';
  import { useAuthStore } from '@/stores/auth';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        errorMessage: '',
      };
    },
    methods: {
      async handleLogin() {
        try {
          const response = await login({ email: this.email, password: this.password });
          
          const authStore = useAuthStore();
          authStore.login(response.data); // Stocke l'utilisateur et le token dans le store
  
          // Redirige après une connexion réussie
          this.$router.push({ path: '/' });
        } catch (error) {
          this.errorMessage = 'Erreur de connexion. Veuillez vérifier vos identifiants.';
          console.error(error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .login-form {
    max-width: 400px;
    margin: auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .form-group {
    margin-bottom: 1rem;
  }
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
  }
  .form-group input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
  }
  button {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
  .error-message {
    color: red;
    margin-top: 1rem;
  }
  </style>
  