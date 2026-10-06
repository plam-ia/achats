# Mes envies — V1

PWA personnelle pour gérer :
- idées d'achats
- modèles trouvés
- prix vus / prix cibles
- cadeaux par personne
- objets à vendre

## 1. Configurer Supabase
Ouvrir `config.js` et remplacer uniquement :
- `COLLE_ICI_TON_PROJECT_URL`
- `COLLE_ICI_TA_PUBLISHABLE_KEY`

Ne jamais mettre de `service_role`, `secret key` ou `sb_secret_...` dans ce fichier.

## 2. Publier sur GitHub Pages
1. Uploader tous les fichiers à la racine du dépôt GitHub.
2. Settings > Pages.
3. Deploy from a branch.
4. Branch : `main`.
5. Folder : `/ (root)`.

## 3. Configurer Supabase Auth
Une fois l'URL GitHub Pages connue :
Supabase > Authentication > URL Configuration
- Site URL : `https://TON-PSEUDO.github.io/mes-achats/`
- Redirect URLs : ajouter la même URL.

Tu pourras ensuite confirmer ton email.

## 4. Installer sur iPhone
Safari > ouvrir l'URL GitHub Pages > Partager > Sur l'écran d'accueil.
