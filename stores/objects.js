import { defineStore } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import axios from 'axios';
import { publicService } from '~/api/api';
import { useRepo } from 'pinia-orm';
import Objet from '~/models/ObjetModel';

export const useObjectsStore = defineStore('objects', {
  state: () => ({
    objects: [],
    categories: {}, // Cache pour les catégories
    currentObjet: null, // Objet actuel
  }),

  actions: {
    async fetchUserObjects() {
      const authStore = useAuthStore();
      try {
        const { data } = await axios.get(
          `https://localhost:8000/api/user/${authStore.user.id}/objets`,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );

        const objects = data.map((objet) => ({
          id: objet.id,
          title: objet.title,
          description: objet.description,
          user_id: objet.user.id,
          category: {
            id: objet.category?.id,
            name: objet.category?.name || 'Catégorie inconnue',
          },
        }));

        // Insérer les objets dans le store Pinia ORM
        useRepo(Objet).save(objects);
        this.objects = objects; // Mettre à jour le state
      } catch (error) {
        console.error("Erreur lors de la récupération des objets de l'utilisateur :", error);
      }
    },

    async fetchAllObjet() {
      try {
        const response = await publicService.get('/objets'); // Appel à l'API
        const objets = response.data['hydra:member'].map((item) => ({
          id: item['@id'].split('/').pop(),
          title: item.title,
          description: item.description,
          user: {
            id: item.user['@id'].split('/').pop(),
            name: item.user.username,
          },
          category: {
            id: item.category['@id'].split('/').pop(),
            name: item.category.name,
          },
        }));

        // Insérer les objets dans le store Pinia ORM
        useRepo(Objet).save(objets);
        this.objects = objets; // Mettre à jour le state
      } catch (error) {
        console.error('Erreur lors du chargement des objets:', error);
      }
    },

    async fetchOneObjet(objetId) {
      const repo = useRepo(Objet);
      let objet = repo.query()
        .with('category')
        .with('user')
        .find(objetId);

      if (!objet) {
        try {
          const response = await publicService.get(`https://localhost:8000/api/objets/${objetId}`);
          console.log('response',response)
          objet = {
            id: response.data['@id'].split('/').pop(),
            title: response.data.title,
            description: response.data.description,
            user: {
              id: response.data.user['@id'].split('/').pop(),
              name: response.data.user.username,
            },
            category: {
              id: response.data.category['@id'].split('/').pop(),
              name: response.data.category.name,
            },
          };

          // Insérer l'objet dans le store Pinia ORM
          repo.save(objet);
        } catch (error) {
          console.error('Erreur lors du chargement de l\'objet:', error);
          throw error;
        }
      }

      this.currentObjet = objet; // Mettre à jour l'état
    },
  },

  async deleteObjetId(userId,objetId,token){
    

    try{
       const response = await axios.delete(`https://localhost:8000/api/user/${userId}/objet/${objetId}`,
       { headers:{
          Authorization:`Bearer ${token}`}
        },
       )

return response
    }catch(error){
      console.error("erreur supression objet")
      throw error
    }
  },

  // Activer la persistance avec Pinia
  persist: true,
});
