import { defineStore } from 'pinia';

export const useMessagesStore = defineStore('messages', {
  state: () => ({
    messages: [],
    usersCache: {}, // Stocke les utilisateurs avec leurs noms et IDs
  }),
  actions: {
    getMessagesBetween(senderId, recipientId) {
      return this.messages.filter(
        (msg) =>
          (msg.sender === senderId && msg.recipient === recipientId) ||
          (msg.sender === recipientId && msg.recipient === senderId)
      );
    },
    async loadMessages(objectId, recipientId) {
      try {
        const response = await fetch(`https://localhost:8000/api/messages?objectId=${objectId}&recipient=${recipientId}`);
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement des messages : ${await response.text()}`);
        }
    
        const data = await response.json();
        this.messages = data.messages;
      } catch (error) {
        console.error('Erreur :', error);
      }
    },
    addMessage(message) {
      this.messages.push(message);
    },
  

    // Récupère tous les messages avec un utilisateur spécifique
    getMessagesWithUser(userId) {
      return this.messages.filter(
        (msg) => msg.senderId === userId || msg.recipientId === userId
      );
    },

    // Définit les utilisateurs (peut être utilisé au montage de l'application)
    setUsers(users) {
      this.users = users;
    },

    async fetchUserById(userId) {
        // Si l'utilisateur est dans le cache, pas besoin de l'API
        if (this.usersCache[userId]) {
          return this.usersCache[userId];
        }
        try {
          const response = await fetch(`https://localhost:8000/api/utilisateurs/${userId}`); // API pour récupérer un utilisateur
          const data = await response.json();
      
          // Extraire uniquement les informations pertinentes
          const user = {
            id: userId, // Vous pouvez utiliser l'ID fourni
            username: data.username,
          };
      
          console.log("Utilisateur extrait :", user);
      
          // Stocker dans le cache
          this.usersCache[userId] = user;
      
          return user;
        } catch (error) {
          console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, error);
          return null;
        }
      },
    // Récupère le nom du destinataire via son ID
    async getRecipientName(userId) {
        const user = await this.fetchUserById(userId);
        console.log("tamere",user)
        return user ? user?.username : 'Utilisateur inconnu';
      },
    
  },
});


