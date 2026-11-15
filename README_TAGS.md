# Mise à jour Tags

La base Supabase est déjà prête : la colonne `items.tags` a été ajoutée.

## À remplacer sur GitHub dans `plam-ia/achats`
Remplace uniquement ces 4 fichiers à la racine de la branche `main` :

- `app.js`
- `index.html`
- `styles.css`
- `sw.js`

Ne touche pas à `config.js`, aux icônes ni à `manifest.json`.

## Fonctionnement
Dans une fiche achat :
- champ `Tags`
- saisir par exemple : `Black Friday, Noël`
- séparer plusieurs tags par une virgule

Dans l'onglet Achats :
- les tags s'affichent sur les cartes
- un filtre `Tags` apparaît automatiquement dès qu'au moins un tag existe
- la recherche texte prend également les tags en compte
