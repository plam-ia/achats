# Ajout des emojis personnalisables

## 1. Supabase
Dans SQL Editor, exécuter :

```sql
ALTER TABLE public.people
ADD COLUMN IF NOT EXISTS emoji text;
```

## 2. GitHub
Réuploader les fichiers de ce ZIP sur `main`.

Le ZIP ne contient pas ton `config.js` : garde celui déjà présent.

## Résultat
Dans Cadeaux > Modifier une personne :
- choix de l'emoji
- modification du nom
- suppression possible

L'emoji choisi est enregistré dans Supabase.
