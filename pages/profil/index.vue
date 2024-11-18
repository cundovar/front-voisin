<template>
    <h2>profil</h2>
    <client-only>
        <section v-if="authStore.isAuthenticated" class=" relative flex flex-col justify-center border m-2 p-2 ">
            <div class="mt-10">
                <div class="w-20 h-20 m-auto bg-red-400 ">
                    photo
                </div>
            </div>
            <div class="absolute top-0 right-3">
              <NuxtLink to="/profil/editProfil">editer profil</NuxtLink>
            </div>
    
            
            <div class="flex flex-col w-full border mt-10 ">
                <p>
                    compte de {{ authStore.user?.username }}
    
                </p>
                <h3>Objets :</h3>
    <ul>
      <li v-for="objet in objects" :key="objet.id">
<!-- {{ objet }}/ -->
        
            <p><strong>Nom:</strong> {{ objet.title }}</p>
            <p><strong>description:</strong> {{ objet.description }}</p>
            <p><strong>catégorie:</strong> {{ objet.categoryName }}</p>

        
    
      </li>
    </ul>
                <p>
                    paramettre
    
                </p>
    
    
            </div>
      </section>



    </client-only>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useObjectsStore } from '~/stores/objects'

const authStore = useAuthStore()
const objectStore = useObjectsStore()

const objects = objectStore.objects
console.log('object',objects)

onMounted(() => {
  objectStore.fetchUserObjects()
})
</script>
