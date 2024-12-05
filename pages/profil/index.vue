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
        <NuxtLink :to="`/objects/add`">

          <button class="btn btn-danger w-1/6 m-2 ">ajouter</button>

        </NuxtLink>
        <div class="flex space-x-2">
          <div v-if=" objects && objects.length > 0">
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
                <ul class="mt-20" >
                  <li >
           *

                      <p><strong>Nom:</strong> {{ objet.title }}</p>
                      <!-- <p><strong>id user:</strong> {{ objet.user.id }}</p> -->
                      <p><strong>description:</strong> {{ objet.description }}</p>
                      <p><strong>catégorie:</strong> {{ objet.category?.name}}</p>

                      
                    
                  </li>
                </ul>
                
              
    
    
            </div>
            </div>
            <div v-else>
              <p>pas objet</p>
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

onMounted(() => {
  objectStore.fetchUserObjects();
  console.log("Objets de l'utilisateur connecté :", objectStore.objects);
});
const objects = computed(() =>
objectStore.objects.filter((obj) => obj.user_id === authStore.user.id.toString())
);

// Fonction pour supprimer un objet
async function deleteObject(objectId) {
  const userId = authStore.user.id;
  const token = authStore.token;

  try {
    await objectStore.deleteObjetId(userId, objectId, token);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'objet :", error);
  }
}

// Gestion de l'objet supprimé
function handleObjectDeleted(deletedId) {
  objectStore.objects = objectStore.objects.filter((o) => o.id !== deletedId);
}
</script>



