<template>
  <h2>profil</h2>
  <client-only>
    <section
      v-if="authStore.isAuthenticated"
      class="relative flex flex-col justify-center border m-2 p-2"
    >
      <div class="mt-10">
        <div class="w-20 h-20 m-auto bg-red-400">photo</div>
      </div>
      <div class="absolute top-0 right-3">
        <NuxtLink :to="`/profil/editProfil`">editer profil</NuxtLink>
      </div>

      <div class="flex relative flex-col w-full border mt-10">

       
        <p>compte de {{ authStore.user?.username }}</p>
        <p>email : {{ authStore.user?.email }}</p>

    
        <h3>Objets :</h3>
        <button class="btn btn-danger w-1/6 m-2 ">ajouter</button>
        <div class="flex space-x-2">

            <div v-for="objet in objects" :key="objet.id" class="p-2 border bg-amber-100 relative">
                <div class="absolute top-0 border  right-0">
                  <NuxtLink :to="`/objects/${objet.id}/edit`">

                    <button class="cursor-pointer" > 
                       modifier
                    </button>

                  </NuxtLink>
            <div class="">
              <!-- Boutons Editer et Supprimer -->
            
              <DeleteButton
                :deleteAction="deleteObject"
                :itemId="objet.id"
                itemType="objet"
                @deleted="handleObjectDeleted"
              >
                
              </DeleteButton>
            </div>
        </div>
                <ul class="mt-5" >
                  <li >
                    <!-- {{ objet }}// -->
        
                    <p><strong>Nom:</strong> {{ objet.title }}</p>
                    <p><strong>description:</strong> {{ objet.description }}</p>
                    <p><strong>catégorie:</strong> {{ objet.category?.name}}</p>
                  </li>
                </ul>
    
    
    
    
            </div>


        </div>
        <p>paramettre</p>
      </div>
    </section>
  </client-only>
</template>

<script setup>
import { onMounted } from "vue";
import DeleteButton from "~/components/buttons/DeleteButton.vue";
import { useAuthStore } from "~/stores/auth";
import { useObjectsStore } from "~/stores/objects";

const authStore = useAuthStore();
const objectStore = useObjectsStore();

const objects = objectStore.objects;
console.log("object", objects);

objectStore.fetchUserObjects();

// Fonction pour supprimer un objet
async function deleteObject(objectId) {
  const userId = authStore.user.id;
  const token = authStore.token;

  try {
    await objectStore.deleteObjetId(userId, objectId, token); // Appel à la fonction de suppression du store
  } catch (error) {
    console.error("Erreur lors de la suppression de l'objet :", error);
  }
}

// Gestion de l'objet supprimé
function handleObjectDeleted(deletedId) {
  console.log(`Objet avec l'ID ${deletedId} supprimé`);
  objectStore.objects = objectStore.objects.filter((o) => o.id !== deletedId); // Mise à jour locale
}


</script>
