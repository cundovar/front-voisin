<template>
    <div>
      <h1>Messagerie</h1>
      <div v-if="recipientName">
        <h2>Discussion avec {{ recipientName }}</h2>
      </div>
      <div v-else>
        <p>Chargement des informations du destinataire...</p>
      </div>
  
      <!-- Liste des messages -->
      <div v-if="messages.length > 0" class="messages-list">
        <div v-for="(msg, index) in messages" :key="index" class="message-item">
          <p :class="msg.senderId === currentUser.id ? 'sent' : 'received'">
            <strong>{{ msg.senderId === currentUser.id ? 'Vous' : recipientName }}:</strong>
            {{ msg.content }}
          </p>
        </div>
      </div>
      <div v-else>
        <p>Aucun message pour le moment.</p>
      </div>
  
      <!-- Formulaire d'envoi de message -->
      <form @submit.prevent="sendMessage">
        <textarea v-model="newMessage" placeholder="Écrivez votre message..." required></textarea>
        <button type="submit">Envoyer</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useMessagesStore } from '~/stores/messagesStore';
  import { useAuthStore } from '~/stores/auth'; // Pour obtenir l'utilisateur connecté
  import { useNuxtApp } from '#app';
  
  const route = useRoute();
  const { messagesSocket } = useNuxtApp(); // Accès à la connexion WebSocket

if (!messagesSocket) {
  console.error('La connexion WebSocket n\'est pas disponible.');
}
  const messagesStore = useMessagesStore();
  const userStore = useAuthStore();
  
  // Récupérer l'ID du destinataire et de l'objet
  const recipientId = route.query.recipientId;
  const objectId = route.query.objectId;
  
  // Nom du destinataire
  const recipientName = ref(''); // Stocke le nom du destinataire
  
  // Identifiant de l'utilisateur connecté
  const currentUser = computed(() => userStore.user?.id);
  
  // Messages échangés
  const messages = computed(() =>
    messagesStore.getMessagesBetween(currentUser.value, recipientId)
  );
  
  // Nouveau message à envoyer
  const newMessage = ref('');
  
  // Charger le nom du destinataire et les messages au montage
  onMounted(async () => {
    try {
      const recipient = await messagesStore.getRecipientName(recipientId);
      recipientName.value = recipient; // Mettre à jour le nom
      messagesStore.loadMessages(objectId, recipientId); // Charger les messages existants
    } catch (error) {
      console.error('Erreur lors du chargement du nom du destinataire ou des messages :', error);
    }
  });
  
  // Fonction d'envoi de message
  const sendMessage = () => {
    if (!newMessage.value.trim()) return;
  
    const messageData = {
      action: 'sendMessage',
      senderId: currentUser.value,
      recipientId,
      content: newMessage.value.trim(),
    };
  
    // Envoyer le message via WebSocket
    messagesSocket.send(JSON.stringify(messageData));
  
    // Ajouter localement le message (optionnel)
    messagesStore.addMessage({
      senderId: currentUser.value,
      recipientId,
      content: newMessage.value.trim(),
    });
  
    // Réinitialiser le champ
    newMessage.value = '';
  };
  </script>
  
  
  <style scoped>
  .messages-list {
    margin-bottom: 1rem;
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 4px;
  }
  
  .message-item {
    margin-bottom: 0.5rem;
  }
  
  .sent {
    text-align: right;
    color: #007bff;
  }
  
  .received {
    text-align: left;
    color: #28a745;
  }
  
  textarea {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  button {
    display: block;
    width: 100%;
    background-color: #007bff;
    color: white;
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  