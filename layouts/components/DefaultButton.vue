<template>
    <div>
      <h1>Layout de l'Application</h1>
  
      <h2>Supprimer un utilisateur</h2>
      <DeleteButton
        :deleteAction="deleteUser"
        :itemId="userId"
        itemType="utilisateur"
        @deleted="handleDelete('utilisateur', $event)"
      >
        Supprimer utilisateur
      </DeleteButton>
  
      <h2>Supprimer un article</h2>
      <DeleteButton
        :deleteAction="deleteArticle"
        :itemId="articleId"
        itemType="article"
        @deleted="handleDelete('article', $event)"
      >
        Supprimer article
      </DeleteButton>
    </div>
  </template>
  
  <script setup>
  import { deleteUser, deleteArticle } from '~/services/deleteService';
  import DeleteButton from '~/components/DeleteButton.vue';
  
  const userId = 1; // Exemple d'ID utilisateur
  const articleId = 42; // Exemple d'ID article
  
  function handleDelete(type, id) {
    console.log(`${type} avec l'ID ${id} a été supprimé.`);
  }
  </script>
  