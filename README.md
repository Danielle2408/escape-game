# 🕵️ Escape Game : Évasion de la classe

Un jeu d’enquête collaboratif où vous devez explorer une salle de classe, récolter des indices, résoudre des calculs et trouver le code secret pour ouvrir la porte. Le jeu comporte un timer, des sons, des objets utiles et d’autres pièges qui vous feront perdre du temps.

## 👥 Équipe

- **Aubin** – Branches `aubin/html-css` et `aubin/code-validation`
- **Marco** – Branche `marco-timer-sound`
- **Danielle** – Branches `danielle-indices-calculs` et `danielle-objet-click`
- les autres membres du groupe n'ont pas pu participer *Brad n'était pas connecté *Apostel il a été impossible de l'ajouter comme collaborateur

---

## 🧩 Répartition des fonctionnalités

### 1️⃣ Structure HTML / CSS – *Aubin (branche `aubin/html-css`)*

- Création de la structure complète de la page (`index.html`) :
  - Écran de jeu avec la salle de classe.
  - Objets interactifs : Table, Sac, Tableau, Bibliothèque, Globe, Corbeille, Porte.
  - Panneau d’affichage des indices.
  - Zone de saisie du code et boutons.
- Mise en page (`style.css`) :
  - Design moderne inspiré de Windows 11 (dégradés, flou, ombres).
  - Animations au survol des objets.
  - Style responsive pour mobile et desktop.
  - Effet “porte ouverte” avec changement de couleur.

### 2️⃣ Timer & Sons – *Marco (branche `marco-timer-sound`)*

- Implémentation du **timer** :
  - Affichage minutes:secondes, mise à jour chaque seconde.
  - Fin du jeu quand le temps atteint 0 (perte automatique).
- Fonction `penalizeTime(seconds)` pour retirer du temps en cas de clic sur un objet inutile.
- **Sons** avec l’API Web Audio :
  - `click` : son court lors de l’interaction.
  - `error` : son grave pour pénalité ou code erroné.
  - `success` : son aigu pour victoire.
  - `door` : son spécifique lors de l’ouverture de la porte.

### 3️⃣ Indices & Calculs mathématiques – *Danielle (branche `danielle-indices-calculs`)*

- Génération aléatoire du **code secret** (4 chiffres) à chaque nouvelle partie.
- Configuration des objets avec :
  - Objets **utiles** (table, sac, tableau, bibliothèque) : chacun donne un chiffre du code via un calcul simple (ex: `d × 1 = ?`, `(d+5) – 5 = ?`).
  - Objets **inutiles** (globe, corbeille) : font perdre du temps.
- Fonction `buildCluesDataFromCode(code)` : construit dynamiquement les messages d’indice en fonction du code généré.

### 4️⃣ Gestion des clics sur les objets – *Danielle (branche `danielle-objet-click`)*

- Détection des clics sur chaque objet.
- Affichage des indices dans le panneau `#cluesList`.
- Gestion des objets déjà cliqués (message « Déjà vu »).
- Application des pénalités de temps pour les objets inutiles.
- Animation visuelle (agrandissement temporaire) au clic.
- Fonction `bindObjectClicks()` pour attacher les événements à tous les objets.

### 5️⃣ Vérification du code, fin de jeu et réinitialisation – *Aubin (branche `aubin/code-validation`)*

- Validation du code saisi par l’utilisateur :
  - Comparaison avec `secretCode`.
  - Message d’erreur et secousse du champ en cas d’échec.
  - Succès : animation de la porte, sons de victoire, désactivation des clics.
- Fonction `resetGame()` :
  - Génère un nouveau code secret.
  - Reconstruit les indices dynamiquement.
  - Réinitialise le timer, la liste des indices, l’état des objets.
  - Remet la porte en position fermée.
- Liaison des boutons **« Vérifier »** et **« Recommencer »** aux fonctions correspondantes.

