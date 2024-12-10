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
import { useAuthStore } from '~/stores/auth';
import { useNuxtApp } from '#app';

const route = useRoute();
const { $messagesSocket } = useNuxtApp();

const messagesStore = useMessagesStore();
const userStore = useAuthStore();

// Récupérer l'ID du destinataire et de l'objet
const recipientId = route.query.recipientId;
const objectId = route.query.objectId;

// Nom du destinataire
const recipientName = ref('');
const newMessage = ref('');

// Identifiant de l'utilisateur connecté
const currentUser = computed(() => userStore.user?.id);

// Liste des messages échangés
const messages = computed(() =>
  messagesStore.getMessagesBetween(currentUser.value, recipientId)
);

// Charger le nom du destinataire et les messages existants
onMounted(async () => {
  try {
    const recipient = await messagesStore.getRecipientName(recipientId);
    recipientName.value = recipient;
    await messagesStore.loadMessages(objectId, recipientId);
  } catch (error) {
    console.error('Erreur lors du chargement des messages ou du destinataire :', error);
  }
});

// Gestion WebSocket
if ($messagesSocket) {
  $messagesSocket.onopen = () => {
    console.log('WebSocket connecté.');
  };

  $messagesSocket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.action === 'receiveMessage' && message.message.recipientId === currentUser.value) {
      messagesStore.addMessage(message.message);
    }
  };

  $messagesSocket.onerror = (error) => {
    console.error('Erreur WebSocket :', error);
  };

  $messagesSocket.onclose = (event) => {
    console.warn('WebSocket déconnecté :', event.reason || 'sans raison');
  };
} else {
  console.error('WebSocket non disponible.');
}

// Fonction d'envoi de message
const sendMessage = async () => {
  if (!newMessage.value.trim()) {
    console.warn('Message vide.');
    return;
  }

  const messageData = {
  sender: currentUser.value.toString(), // Convertir en chaîne si nécessaire
  recipient: recipientId.toString(),
  content: newMessage.value.trim(),
};

try {
  const response = await fetch('https://localhost:8000/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData),
  });

  if (!response.ok) {
    throw new Error(`Erreur API REST: ${await response.text()}`);
  }

  console.log('Message sauvegardé via API REST.');
} catch (error) {
  console.error('Erreur lors de l\'envoi du message :', error);
}finally {
    newMessage.value = '';
  }
};
</script>

<style scoped>
.messages-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.message-item {
  padding: 0.5rem;
  margin: 0.5rem 0;
}

.sent {
  text-align: right;
  background-color: #d1e7dd;
  border-radius: 10px;
}

.received {
  text-align: left;
  background-color: #f8d7da;
  border-radius: 10px;
}

textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
