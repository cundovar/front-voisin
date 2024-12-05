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
        console.log("Données brutes des objets : ", data);
        const objects = data.map((objet) => ({
          id: objet.id,
          title: objet.title,
          description: objet.description,
          user_id: objet.user.split('/').pop(),
          category: {
            id: objet.category?.id,
            name: objet.category?.name || 'Catégorie inconnue',
          },
        }));
           console.log("constObjet",objects)
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
        console.log("respinse",response.data['hydra:member'])
        const objets = response.data['hydra:member'].map((item) => {
          const category =item.category ? {

            id: item.category['@id'].split('/').pop(),
            name: item.category.name
          } 
          : null;
          return {
            id: item['@id'].split('/').pop(),
            title: item.title,
            description: item.description,
            user: {
              id: item.user['@id'].split('/').pop(),
              name: item.user.username,
            },
            
            category,
            
          }
           

            
          
        });
        // Insérer les objets dans le store Pinia ORM
        useRepo(Objet).save(objets);
        this.objects = objets; // Mettre à jour le state
        console.log("objetss",response.data)
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

    async updateObjet(object,userId){
      try{
        const response=await axios.put(`https://localhost:8000/api/user/${userId}/objet/${object.id}`,object,
          {
            headers: {
           
              'Content-Type': 'application/json', // En-tête attendu par le serveur
            },
          }
        )
      
          // Mettre à jour l'objet dans la liste
    const updatedObject = response.data;
    const index = this.objects.findIndex((obj) => obj.id === updatedObject.id);
    if (index !== -1) {
      this.objects[index] = { ...this.objects[index], ...updatedObject };
    }
    
    this.currentObjet = updatedObject; // Met à jour le `currentObjet`

      }catch(error){
        console.error("erreur lors de la mise à jpour de l'objet ;",error)
        throw error
      }
    },
  
    async deleteObjetId(userId, objetId, token) {
      try {
        await axios.delete(
          `https://localhost:8000/api/user/${userId}/objet/${objetId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        // Supprime l'objet de la liste
//         this.objects : Représente la liste des objets (probablement une propriété de l'état du store Pinia ou Vuex) affichée dans l'interface utilisateur.
// objetId : C'est l'ID de l'objet qu'on veut supprimer de la liste objects.
// L'objectif de cette ligne est de mettre à jour la liste this.objects en supprimant l'objet dont l'ID correspond à objetId.his.objects.filter(callback) :

// La méthode .filter() retourne un nouveau tableau contenant uniquement les éléments qui remplissent une condition définie par le callback.
// Le callback est une fonction exécutée pour chaque élément de this.objects.
// Le callback (obj) => obj.id !== objetId :

// obj représente un objet dans la liste this.objects.
// obj.id est comparé à objetId.
// Si la condition obj.id !== objetId est true :
// L'objet est conservé dans le tableau retourné.
// Si la condition est false (c'est-à-dire que l'ID correspond à objetId) :
// L'objet est exclu du tableau retourné.
// Mise à jour de this.objects :

// Le tableau retourné par .filter() remplace l'ancien tableau dans this.objects.
// Cela effectue effectivement la suppression de l'objet correspondant à objetId.



        this.objects = this.objects.filter((obj) => obj.id !== objetId);
      } catch (error) {
        console.error('Erreur suppression objet :', error);
        throw error;
      }
    },
    async addOdjet(userId, token, newObjet) {
      console.log('Données envoyées au backend :', newObjet);
      try {
        const response = await axios.post(
          `https://localhost:8000/api/user/${userId}/objet`,
          newObjet,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const addedObjet = response.data.objet;
        console.log('Réponse du backend :', addedObjet);
        this.objects.push({
          id: addedObjet.id,
          title: addedObjet.title,
          description: addedObjet.description,
     
        });
        return addedObjet;
      } catch (error) {
        console.error('Erreur lors de l\'ajout :', error.response?.data || error);
        throw error;
      }
    },
  
  },


  // Activer la persistance avec Pinia
  persist: true,
});
