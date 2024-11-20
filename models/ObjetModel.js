import { Model } from 'pinia-orm';
import User from './UserModel';
import Category from './CategoryModel';
import { publicService } from '~/api/api';
import { useRepo } from 'pinia-orm';

export default class Objet extends Model {

    static entity='objets'

    static fields(){
        return{

            id:this.attr(null),
            title:this.string(''),
            description:this.string(''),
            user_id: this.attr(null),
            category_id: this.attr(null),
            user: this.belongsTo(User, 'user_id'),
            category: this.belongsTo(Category, 'category_id')
        }
    }

    static async fetchAllObjet() {
        try {
          const response = await publicService.get('/objets'); // Appel à l'API
          console.log('Réponse brute de l’API:', response.data);
      
          // Extraire les objets depuis `hydra:member`
          const objets = response.data['hydra:member'].map((item) => ({
            id: item['@id'].split('/').pop(), // Extraire l'ID depuis `@id`
            title: item['title'], // Utiliser `@type` comme titre
            description: item['description'], // Utiliser `@type` comme titre
            user: { id:item.user['@id'].split('/').pop(),
                   name:item.user.username
                
            },
            category: {
              id: item.category['@id'].split('/').pop(), // Extraire l'ID de la catégorie
              name: item.category.name,
            },
          }));
      
          console.log('Objets transformés:', objets);
      
          // Insérer les objets dans le store Pinia ORM
          const result = useRepo(Objet).save(objets);
      console.log('Données insérées dans le store:', result);
        } catch (error) {
          console.error('Erreur lors du chargement des objets:', error);
          throw error;
        }
      }
}