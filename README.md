# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview



# verifier le fichier manifest et installation pwa
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

src/
├── assets/                 # Ressources statiques (images, styles globaux)
│   ├── images/
│   └── styles/
│       └── main.css
├── components/             # Composants partagés entre modules
│   └── Button.vue
├── modules/                # Dossiers des différents modules fonctionnels
│   ├── auth/               # Module de gestion des utilisateurs et authentification
│   │   ├── components/     # Composants spécifiques au module
│   │   │   ├── Login.vue
│   │   │   └── Register.vue
│   │   ├── composables/    # Fichiers de gestion d’état local
│   │   │   └── useAuth.js
│   │   ├── services/       # Fichiers pour les appels API
│   │   │   └── authService.js
│   │   └── AuthModule.vue  # Composant principal du module Auth
│   ├── objects/            # Module pour gérer les objets partagés
│   │   ├── components/
│   │   │   ├── ObjectList.vue
│   │   │   └── ObjectDetail.vue
│   │   ├── composables/
│   │   │   └── useObjects.js
│   │   ├── services/
│   │   │   └── objectService.js
│   │   └── ObjectsModule.vue
│   ├── reservations/       # Module pour la gestion des réservations
│   │   ├── components/
│   │   │   ├── ReservationCalendar.vue
│   │   │   └── ReservationForm.vue
│   │   ├── composables/
│   │   │   └── useReservations.js
│   │   ├── services/
│   │   │   └── reservationService.js
│   │   └── ReservationsModule.vue
│   ├── map/                # Module pour la carte et la localisation
│   │   ├── components/
│   │   │   └── MapView.vue
│   │   ├── composables/
│   │   │   └── useMap.js
│   │   └── MapModule.vue
│   └── notifications/      # Module de notifications et messagerie
│       ├── components/
│       │   └── NotificationList.vue
│       ├── composables/
│       │   └── useNotifications.js
│       ├── services/
│       │   └── notificationService.js
│       └── NotificationsModule.vue
├── composables/            # Composables globaux accessibles à tous les modules
│   └── useGlobalState.js
├── layouts/                # Templates de mise en page pour l’application
│   ├── DefaultLayout.vue
│   └── AuthLayout.vue
├── pages/                  # Routes principales pour chaque module
│   ├── index.vue           # Page d’accueil
│   ├── auth/
│   │   └── index.vue       # Page de connexion
│   ├── objects/
│   │   └── index.vue       # Liste des objets
│   ├── reservations/
│   │   └── index.vue       # Page de réservation
│   └── map/
│       └── index.vue       # Page de carte
├── router/                 # Configuration des routes de l’application
│   └── index.js
├── store/                  # Dossier pour la gestion d’état si nécessaire
│   └── index.js
└── main.js                 # Point d’entrée de l’application
# front-voisin
