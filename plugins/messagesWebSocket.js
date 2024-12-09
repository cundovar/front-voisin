export default defineNuxtPlugin(() => {
    // Initialiser le WebSocket uniquement côté client
    if (!process.client) return;
  
    const socket = new WebSocket('ws://127.0.0.1:8081/messages'); // Remplacez par votre URL WebSocket
  
    // Gestion des messages reçus
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
  
        if (message.action === 'receiveMessage') {
          // Utilisation du store pour ajouter le message reçu
          const messagesStore = useMessagesStore();
          messagesStore.addMessage(message.message);
        }
      } catch (error) {
        console.error('Erreur lors du traitement du message WebSocket:', error);
      }
    };
  
    // Gestion des erreurs
    socket.onerror = (error) => {
      console.error('Erreur WebSocket détectée:', error);
    };
  
    // Gestion de la fermeture de la connexion
    socket.onclose = () => {
      console.log('Connexion WebSocket fermée');
    };
  
    return {
      provide: {
        messagesSocket: socket, // Injection pour utilisation globale
      },
    };
  });
  