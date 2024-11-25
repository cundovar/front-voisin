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

}