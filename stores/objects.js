import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import axios from 'axios'

export const useObjectsStore = defineStore('objects', {
  state: () => ({
    objects: [],
    categories: {} // Ajout du cache pour les catégories
  }),

  actions: {
    async fetchUserObjects() {
      const authStore = useAuthStore();
      try {
        const { data } = await axios.get(`https://localhost:8000/api/user/${authStore.user.id}/objets`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        this.objects = await Promise.all(
          data.map(async (objet) => {
            // Vérifiez que l'objet a une catégorie et que category n'est pas `undefined` ou `null`
            if (objet.category && typeof objet.category === 'string') {
              // Vérifiez si la catégorie est déjà dans le cache
              if (!this.categories[objet.category]) {
                try {
                  // Récupère les informations de la catégorie si elle n'est pas en cache
                  const response = await axios.get(
                    `https://localhost:8000${objet.category}`, // Assurez-vous qu'il n'y a pas d'espace après `8000`
                    {
                      headers: {
                        Authorization: `Bearer ${authStore.token}`,
                      },
                    }
                  );

                  // Vérifiez que la réponse contient bien `name`
                  const categoryData = response.data;
                  if (categoryData && categoryData.name) {
                    this.categories[objet.category] = categoryData.name;
                  } else {
                    console.warn(`Nom de catégorie non trouvé pour ${objet.category}`);
                  }
                } catch (error) {
                  console.error(
                    `Erreur lors de la récupération de la catégorie pour ${objet.category}:`,
                    error
                  );
                }
              }
              // Associe le nom de la catégorie à l'objet si disponible dans le cache
              objet.categoryName = this.categories[objet.category] || 'Catégorie inconnue';
            } else {
              // Si `objet.category` est manquant ou invalide, définissez un nom par défaut
              objet.categoryName = 'Catégorie inconnue';
            }
            return objet;
          })
        );
      } catch (error) {
        console.error("Erreur lors de la récupération des objets de l'utilisateur :", error);
      }
    },
  },
});
