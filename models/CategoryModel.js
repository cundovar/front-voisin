import { Model } from 'pinia-orm';
import Objet from './ObjetModel';


export default class Category extends Model {
  static entity = 'categories';

  static fields() {
    return {
      id: this.attr(null),
      name: this.string(''),
      
    };
  }
}