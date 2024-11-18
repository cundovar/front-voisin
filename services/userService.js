import axios from "axios";
import { service } from "../api/api";





const service = axios.create({
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

        const response = await service.get('/me', {
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