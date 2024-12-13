
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '~/stores/auth';


const routes=[
    {
        path:'/',
        name:'home',
        component:()=>import('~/pages/index.vue')
    },
    {
        path:'/profil',
        name:'profil',
        component:()=>import('~/pages/profil/index.vue'),
        meta: { requiresAuth: true }, // Ajouter un indicateur "requiresAuth"
  },
    {
        path:'/profil/editprofil',
        name:'editProfil',
        component:()=>import('~/pages/profil/editProfil/index.vue'),
        meta: { requiresAuth: true }, // Ajouter un indicateur "requiresAuth"
  },
    
    {
        path:`/objects/:objetId/edit`,
        name:'edit',
        component:()=>import('~/pages/objects/[id]/edit.vue'),
        meta: { requiresAuth: true }, // Ajouter un indicateur "requiresAuth"
  },
  {
    path: '/message',
    name: 'message',
    component: () => import('~/pages/message.vue'),
    props: (route) => ({
      objectId: route.query.objectId,
      recipientId: route.query.recipientId,
    }),
  }
    
]

const router=createRouter({
    history:createWebHistory(),
    routes
})

//en global

router.beforeEach((to,from,next)=>{
    const authStore=useAuthStore()
     // Charger l'état depuis le localStorage si nécessaire
  if (!authStore.token) {
    authStore.loadFromStorage();
  }
   // Vérifier si la route nécessite une authentification
   if(to.meta.requiresAuth && !authStore.isAuthenticated){
    next({path:'/'})
   }else {
    next()
   }
})

export default router