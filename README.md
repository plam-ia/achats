# Achats — version épurée

Modifications :
- nouvel icône root :
  - apple-touch-icon.png
  - icon-192.png
  - icon-512.png
- réduction de l'espace entre le titre et la zone de recherche
- dans les cartes de liste :
  - suppression de la ligne modèle
  - suppression de la ligne catégorie / marchand
- ces infos restent accessibles quand tu cliques sur l'item (dialogue détail/édition)
- cache du service worker renouvelé

## Important
Le ZIP ne contient pas `config.js`.
Garde ton `config.js` actuel dans le dépôt.

## Fichiers à uploader sur la branche main
- index.html
- styles.css
- app.js
- manifest.json
- sw.js

## Après upload
1. Commit sur `main`
2. Ouvre l'URL GitHub Pages dans Safari
3. Recharge 2 fois
4. Ferme complètement la PWA
5. Rouvre-la

Si l'ancienne icône reste :
- supprime le raccourci de l'écran d'accueil
- ouvre Safari
- recharge le site
- Partager > Sur l'écran d'accueil
