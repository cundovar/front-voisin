import axios from "axios";
import { service } from "../api/api";





const services = axios.create({
    baseURL: 'https://localhost:8000/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export async function getCurrentUser() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token not found');
        }

        const response = await services.get('/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur', error);
        throw error;
    }
}

export const  updateUserProfile =async(userId,token,formData)=>{

    try{

        const response = await axios.put(
            `https://localhost:8000/api/user/${userId}`,
            {
                username: formData.username,
                email: formData.email,
                ...(formData.password && { password: formData.password }), // Inclure le mot de passe seulement s'il est rempli
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                
              }
        )
        return response.data; // Retourne les données mises à jour
    }catch(error){
        console.error("erreur lors de la mise à jour profile :",error)
        throw error //relance l'erreur pour que l'appellant puis la gérer
    }
}