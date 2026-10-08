# Cycle Juggernaut : app installable

Dossier statique, sans build. L'app s'installe sur l'écran d'accueil, marche hors ligne et garde tes données sur le téléphone.

## 1. Mettre en ligne (une seule fois, en HTTPS)

Choisis une option :

- **Vercel** : dans ce dossier, lance `npx vercel --prod`, puis suis les questions (connexion, nom du projet). Tu obtiens une URL en `https://…vercel.app`.
- **GitHub Pages** : pousse ce dossier dans un repo, puis va dans Settings → Pages → « Deploy from a branch », branche `main`, dossier `/ (root)`.

## 2. Installer sur le téléphone

- **Android (Chrome)** : ouvre l'URL, puis menu ⋮ → « Installer l'application » (ou « Ajouter à l'écran d'accueil »).
- **iPhone (Safari)** : ouvre l'URL, puis Partager → « Sur l'écran d'accueil ».

## Données

- Tout est stocké sur le téléphone (localStorage). Rien n'est envoyé sur internet.
- Réglages → « Exporter mes données » crée un fichier de sauvegarde. « Importer une sauvegarde » le recharge, par exemple sur un nouveau téléphone.
- Si tu supprimes l'app ou les données du navigateur, tout ce qui n'a pas été exporté est perdu.

## Mises à jour

Remplace les fichiers et redéploie. L'app prend la nouvelle version la prochaine fois qu'elle s'ouvre avec du réseau. Si tu modifies les polices ou les icônes, change aussi `VERSION` dans `sw.js`.

## Contenu

- `index.html` : l'app (programme, saisie, minuteur, sauvegarde)
- `manifest.webmanifest` : nom, icônes, mode plein écran
- `sw.js` : service worker pour le hors ligne
- `icons/` : icônes de l'app
- `fonts/` : Archivo et Big Shoulders Display (licence SIL OFL, fichiers inclus)
