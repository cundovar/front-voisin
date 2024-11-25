<template>
    <button
      class="delete-button"
      :disabled="isLoading"
      @click="confirmAndDelete"
    >
      <slot>Supprimer</slot>
    </button>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    deleteAction: {
      type: Function, // La fonction qui effectuera la suppression
      required: true,
    },
    itemId: {
      type: [String, Number], // Identifiant de l'élément à supprimer
      required: true,
    },
    itemType: {
      type: String, // Type de l'élément (optionnel, pour les notifications)
      default: 'élément',
    },
  });
  
  const emit = defineEmits(['deleted']); // Émettre un événement après suppression
  const isLoading = ref(false);
  
  async function confirmAndDelete() {
    if (confirm(`Êtes-vous sûr de vouloir supprimer cet ${props.itemType} ?`)) {
      isLoading.value = true;
  
      try {
        await props.deleteAction(props.itemId); // Appel de l'action de suppression
        emit('deleted', props.itemId); // Informer le parent de la suppression
        alert(`${props.itemType} supprimé avec succès.`);
      } catch (error) {
        console.error(`Erreur lors de la suppression de l'${props.itemType} :`, error);
        alert(`Erreur lors de la suppression de l'${props.itemType}.`);
      } finally {
        isLoading.value = false;
      }
    }
  }
  </script>
  
  <style>
  .delete-button {
    background-color: red;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  .delete-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  </style>
  