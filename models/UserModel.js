import { Model } from 'pinia-orm';
import axios from 'axios';
import Objet from './ObjetModel'; // Modèle associé
import { publicService, service } from '~/api/api';

export default class User extends Model {
  static entity = 'users';

  static fields() {
    return {
      id: this.attr(null),
      name: this.string(''),
     
    };
  }

  
}
