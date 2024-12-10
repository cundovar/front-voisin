// import { useObjectsStore } from '~/stores/objects';

// export default defineNuxtPlugin(() => {
//   const socket = new WebSocket('ws://127.0.0.1:8080'); // Vérifiez l'adresse et le port du WebSocket

//   // Log chaque étape pour vérifier ce qui est déclenché
//   socket.onopen = () => {
//     console.log('Connexion WebSocket établie avec succès');
//   };

//   socket.onmessage = (event) => {
//     console.log("Message brut reçu :", event.data);

//     try {
//       const message = JSON.parse(event.data);
//       console.log("Message parsé :", message);

//       if (message.action === 'update') {
//         const store = useObjectsStore();
//         const { objet, userId } = message;
//         store.updateObjet(objet, userId);
//       }
//     } catch (error) {
//       console.error("Erreur lors du parsing du message :", error);
//     }
//   };

//   socket.onerror = (error) => {
//     console.error('Erreur WebSocket détectée :', error);
//   };

//   socket.onclose = () => {
//     console.log('Connexion WebSocket fermée');
//   };

//   return {
//     provide: {
//       socket,
//     },
//   };
// });
