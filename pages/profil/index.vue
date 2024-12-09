<template>
  <h2>Profil</h2>
  <client-only>
    <section
      v-if="authStore.isAuthenticated"
      class="relative flex flex-col justify-center border m-2 p-2"
    >
      <div class="mt-10">
        <div class="w-20 h-20 m-auto bg-red-400">photo</div>
      </div>
      <div class="absolute top-0 right-3">
        <NuxtLink :to="`/profil/editProfil`">Éditer Profil</NuxtLink>
      </div>

      <div class="flex relative flex-col w-full border mt-10">
        <p>Compte de {{ authStore.user?.username }}</p>
        <p>Email : {{ authStore.user?.email }}</p>

        <h3>Objets :</h3>
        <NuxtLink :to="`/objects/add`">
          <button class="btn btn-danger w-1/6 m-2">Ajouter</button>
        </NuxtLink>

        <div class="flex space-x-2">
          <div v-if="objects && objects.length > 0">
            <div
              v-for="objet in objects"
              :key="objet.id"
              class="p-2 border bg-amber-100 relative"
            >
              <div class="absolute top-0 border right-0">
                <NuxtLink :to="`/objects/${objet.id}/edit`">
                  <button class="cursor-pointer">Modifier</button>
                </NuxtLink>

                <div>
                  <DeleteButton
                    :deleteAction="deleteObject"
                    :itemId="objet.id"
                    itemType="objet"
                  ></DeleteButton>
                </div>
              </div>

              <ul class="mt-20">
                <li>
                  <p><strong>Nom :</strong> {{ objet.title }}</p>
                  <p>
                    <strong>Description :</strong> {{ objet.description }}
                  </p>
                  <p>
                    <strong>Catégorie :</strong>
                    {{ objet.category?.name || "Non spécifiée" }}
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div v-else>
            <p>Pas d'objet.</p>
          </div>
        </div>
        <p>Paramètres</p>
      </div>
    </section>
  </client-only>
</template>

<script setup>
import { onMounted, computed } from "vue";
import DeleteButton from "~/components/buttons/DeleteButton.vue";
import { useAuthStore } from "~/stores/auth";
import { useObjectsStore } from "~/stores/objects";
import { useRoute,useRouter } from 'vue-router';

const authStore = useAuthStore();
const objectStore = useObjectsStore();
const router=useRouter()
onMounted(() => {
  if (!authStore.isAuthenticated) {
    console.log("pas token",authStore.isAuthenticated)
    router.push('/');
    return;
  }

  objectStore.fetchUserObjects();
  console.log("Objets de l'utilisateur connecté :", objectStore.objects);
  

  
  // Initialiser WebSocket pour écouter les mises à jour des objets
  objectStore.initializeWebSocket();
});

// Liste filtrée des objets pour l'utilisateur connecté
const objects = computed(() =>

objectStore.objects.filter(
    (obj) => obj.user?.id === authStore.user.id.toString()
  )
);


// Fonction pour supprimer un objet
async function deleteObject(objectId) {
  const userId = authStore.user.id;
  const token = authStore.token;

  try {
    await objectStore.deleteObjetId(userId, objectId, token);
    console.log(`Objet ${objectId} supprimé avec succès.`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'objet :", error);
  }
}
</script>
