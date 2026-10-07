# Achats — V1 à 2 onglets

## Modifications
- Suppression de l'Accueil.
- Onglets uniquement : Achats / Cadeaux.
- Acheté masqué par défaut : le filtre "En cours" affiche Idée + Modèle trouvé.
- Tri automatique : Urgent > Haute > Moyenne > Basse.
- Filtre Catégorie.
- Image possible dès le statut Idée.
- Nouvelle icône PWA.
- Correction du flux Reset password Supabase.

## IMPORTANT : config.js
Ce ZIP NE CONTIENT PAS `config.js`.

C'est volontaire : garde ton `config.js` actuel sur GitHub avec :
- SUPABASE_URL
- SUPABASE_PUBLISHABLE_KEY

Ne le supprime pas.

## Mise à jour GitHub
1. Décompresse le ZIP.
2. Dans le dépôt GitHub, branche `main`.
3. Add file > Upload files.
4. Glisse tout le contenu du ZIP.
5. Commit directement sur `main`.

Ton `config.js` déjà présent restera inchangé.

## Pour définir ton mot de passe
1. Dans Supabase : utilisateur > Reset password.
2. Ouvre le mail.
3. Le lien ouvre l'application.
4. Une fenêtre "Choisir mon mot de passe" apparaît.
5. Choisis ton mot de passe définitif.
6. Les connexions suivantes fonctionnent avec email + mot de passe.

## Icône iPhone
Après le déploiement :
1. Supprime l'ancien raccourci "Achats" de l'écran d'accueil.
2. Ouvre l'URL GitHub Pages dans Safari.
3. Recharge la page.
4. Partager > Sur l'écran d'accueil.

iOS met fortement en cache les anciennes icônes : il faut donc recréer le raccourci.
