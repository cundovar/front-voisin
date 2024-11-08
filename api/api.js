import axios from "axios";
import { ElMessage } from "element-plus";
import { useAuthStore } from "../stores/auth";


 export const service=axios.create({
    baseURL:"https://localhost:8000/api" ,
    withCredentials:true,
    timeout:5000
})

// Intercepteur de requêtes
service.interceptors.request.use(
    config => {
        const authSore= useAuthStore()
        const token=authSore.token
        if(token){
            config.headers['Authorization']='Bearer ${token}'
        }
        return config
    },
    error =>{
        console.error('erreur requete',error)
    }
)
// Intercepteur de réponses
service.interceptors.response.use(
    response=>response,
    error=>{
        console.error('erreur reponse',error)
     

        ElMessage({
            massage:error.message || 'erreur lors de la requète',
            type:'error',
            duration:5000
        })

        return Promise.reject(error)

    }
)