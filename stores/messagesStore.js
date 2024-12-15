import { defineStore } from 'pinia';

export const useMessagesStore = defineStore('messages', {
  state: () => ({
    messages: [],
    usersCache: {}, // Stocke les utilisateurs avec leurs noms et IDs
  }),
  actions: {

    async sendMessage({ sender, recipient, content, objectId }) {
      const messageData = {
        action: 'sendMessage',
        sender,
        recipient,
        content: content.trim(),
        objectId,
      };
    
      console.log('Message envoyé :', messageData);
    
      try {
        // Envoyer via l'API
        const response = await fetch('https://localhost:8000/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messageData),
        });
    
        if (!response.ok) {
          throw new Error(`Erreur API REST : ${await response.text()}`);
        }
    
        const responseData = await response.json();
        console.log('Réponse de l\'API :', responseData);
    
        // Ajouter localement au store
        this.addMessage({
          id: responseData.messageId,
          sender,
          recipient,
          content,
          timestamp: new Date().toISOString(),
          object: { id: objectId }, // Inclure d'autres détails de l'objet si nécessaire
        });
    
        return true; // Indiquer que l'envoi a réussi
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message :', error);
        return false; // Indiquer un échec
      }
    },

    getMessagesBetween(senderId, recipientId) {
      senderId = Number(senderId); // Force les IDs à être des nombres
      recipientId = Number(recipientId);
    
      console.log("Sender ID attendu :", senderId);
      console.log("Recipient ID attendu :", recipientId);
      console.log("this.messages:", this.messages);
    
      return this.messages.filter((msg) => {
        console.log("Vérification du message :", msg);
        console.log("Type de msg.sender :", typeof msg.sender, "Valeur :", msg.sender);
        console.log("Type de msg.recipient :", typeof msg.recipient, "Valeur :", msg.recipient);
    
        return (
          (Number(msg.sender) === senderId && Number(msg.recipient) === recipientId) ||
          (Number(msg.sender) === recipientId && Number(msg.recipient) === senderId)
        );
      });
    },
    async loadMessages(objectId, recipientId) {
      try {
        const response = await fetch(`https://localhost:8000/api/messages?objectId=${objectId}&recipient=${recipientId}`);
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement des messages : ${await response.text()}`);
        }
    
        const data = await response.json();
     
        // Transformez les données reçues pour inclure le bon format
        this.messages = data.messages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          recipient: msg.recipient,
          timestamp: msg.timestamp,
          object: msg.object.id, // Inclure l'objet associé si nécessaire
        }));
        console.log('data',data.messages)
      } catch (error) {
        console.error('Erreur :', error);
      }
    },
    addMessage(message) {
      this.messages.push(message);
      console.log("messi",message)
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


