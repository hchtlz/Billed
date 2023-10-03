<img src="https://repository-images.githubusercontent.com/448993750/e2838bde-b2f3-4209-a1f1-07f48ca80e3d">

#### Débuggez et testez un SaaS RH

## L'architecture du projet :

Ce projet, dit frontend, est connecté à un service API backend que vous devez aussi lancer en local.

Le projet backend se trouve ici: https://github.com/MichelD-dev/Billed-Back.git


## Organiser son espace de travail :

Pour une bonne organisation, vous pouvez créer un dossier bill-app dans lequel vous allez cloner le projet backend et par la suite, le projet frontend:

Créer un dossier Bill-App

L’initialiser :

```
$ git init
```

Copier le code Backend :

```
$ git clone https://github.com/MichelD-dev/Billed-Back.git
```

Copier le code frontend :

```
$ git clone https://github.com/MichelD-dev/Billed.git
```


Ouvrir chaque dossier dans un terminal différent :

- Terminal 1:

```
$ cd Billed-app-FR-Back
$ npm i
$ npm i -g sequelize
$ npm i -g sequelize-cli
$ npm i -g jest
$ npm install -g win-node-env
```

Pour lancer le back:

```
$ npm run run:dev
```


- Terminal 2:

```
$ cd Billed-app-FR-Front
$ npm install
$ npm install -g live-server
```

Pour lancer le front:

```
$ live-server
```

Si le site n’est pas lancé automatiquement :
Ouvrir le navigateur à l'adresse: http://127.0.0.1:8080/


## Comment lancer tous les tests en local avec Jest ?

```
$ npm run test
```

## Comment lancer un seul test ?

Installez jest-cli :

```
$ npm i -g jest-cli
$ jest src/__tests__/your_test_file.js
```

## Comment voir la couverture de test ?

`http://127.0.0.1:8080/coverage/lcov-report/`


## Comptes et utilisateurs :

Vous pouvez vous connecter en utilisant les comptes:

### administrateur :

```
utilisateur : admin@test.tld
mot de passe : admin
```

### employé :

```
utilisateur : employee@test.tld
mot de passe : employee
```

## Auteur

[@hchtlz](https://github.com/hchtlz)

![giphy](https://github.com/hchtlz/Les-Petits-Plats/assets/93914147/46fdd794-2211-44f4-83c0-4cddb23411fd)
