<template>
  <div>
    <h1>Messagerie</h1>
    <div v-if="nameObjet">
       <h2 > objet : {{ nameObjet}} </h2>


    </div>
    <div v-else>
  <p>Chargement de l'objet...</p>
</div>
    <div v-if="recipientName">
      <h2>Discussion avec {{ recipientName }}</h2>
    </div>
    <div v-else>
      <p>Chargement des informations du destinataire...</p>
    </div>

    <!-- Liste des messages -->

    <div v-if="messages.length > 0" class="messages-list">
    
  <div v-for="(msg, index) in messages" :key="msg.id" class="message-item">
    <p :class="msg.sender === currentUser? 'sent' : 'received'">
      <strong>{{ msg.sender === currentUser? 'Vous' : recipientName }}:</strong>
      {{ msg.content }}
    </p>
    <p v-if="msg.object.id">
      <em>Objet associé : {{  'ID ' + msg.object.id }}</em>
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
import { useObjectsStore } from '#build/imports';

const route = useRoute();
const { $messagesSocket } = useNuxtApp();

const messagesStore = useMessagesStore();
const userStore = useAuthStore();
const objectSore=useObjectsStore()

// Récupérer l'ID du destinataire et de l'objet
const recipientId = route.query.recipientId;
const objectId = route.query.objectId;
console.log("objectID",objectId)

// Nom du destinataire
const recipientName = ref('');
const newMessage = ref('');
const nameObjet = ref(null)
// Identifiant de l'utilisateur connecté
const currentUser = computed(()=>userStore.user?.id)
console.log("currentuser",currentUser)
console.log("currentuser1",userStore.user?.id)

// Liste des messages échangés
const messages = computed(() => {
  console.log('Messages affichés dans le DOM :', messagesStore.messages);
  return messagesStore.messages;
});
// Charger le nom du destinataire et les messages existants
onMounted(async () => {
  try {
    const recipient = await messagesStore.getRecipientName(recipientId);
    recipientName.value = recipient;
    await messagesStore.loadMessages(objectId, recipientId);

 
    const fetchedObjet = await objectSore.fetchOneObjet(objectId.toString());
    nameObjet.value = fetchedObjet ? fetchedObjet.title : 'Objet inconnu';
 
    // Transformez les messages pour inclure `objectId` directement
    messagesStore.messages = messagesStore.messages.map((msg) => ({
      ...msg,
      objectId: msg.object ? msg.object.id : null,
    }));
  } catch (error) {
    console.error('Erreur lors du chargement des messages ou du destinataire :', error);
  }
  // nom de l'objet pour le titre :
  const fetchNameObjet= await objectSore.fetchOneObjet(objectId.toString())
  nameObjet.value = fetchNameObjet ? fetchNameObjet.title : 'Objet inconnu'; // Assurez-vous que title existe dans l'objet
  console.log('nameObjetzzz', nameObjet.value);
  console.log("nameobjet",nameObjet)
  console.log("nameobjettitle",nameObjet.title)
  console.log('Messages disponibles dans le store :', messagesStore.messages);
console.log('Messages filtrés affichés dans le DOM :', messages.value);
});

// Gestion WebSocket
if ($messagesSocket) {
  $messagesSocket.onopen = () => {
    console.log('WebSocket connecté.');
  };

  $messagesSocket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Nouveau message reçu :', message);

  if (
    message.action === 'receiveMessage' &&
    (message.message.sender === recipientId || message.message.recipient === recipientId)
  ) {
    messagesStore.addMessage(message.message);
    console.log("message.message",message.message)
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

  const success = await messagesStore.sendMessage({
    sender: currentUser.value,
    recipient: recipientId,
    content: newMessage.value,
    objectId,
  });

  if (success) {
    console.log('Message envoyé avec succès');
    newMessage.value = ''; // Réinitialiser le champ
  } else {
    console.error('Échec de l\'envoi du message.');
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
