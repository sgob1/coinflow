# Istruzioni

L'applicazione è eseguibile sia come container che tramite comandi separati.

## Container

Si eseguano in ordine,

per installare e fare la build della app client,
```
sh install-all.sh
```

per lanciare il container
```
docker-compose up
```

oppure
```
podman-compose up
```
se in un sistema Red Hat.

A quel punto il database sarà completamente vuoto.
Per riempirlo con dati utente preimpostati, si sfrutti il comando

```
sh init-db.sh
```

Attenzione, perché se nella cartella `server` dovesse rimanere la cartella
`node_modules` (rimossa dallo script `init-db.sh`) la composizione del
container funzionerà, ma la app non funzionerà. La mia opinione è che il
pacchetto `bcrypt` non venga correttamente copiato nel container nel caso in
cui anche la cartella `node_modules` venisse copiata; difatti, se nel codice si
rimuove tale pacchetto, tutto funziona anche se non si elimina la cartella
`node_modules`.

Le **password** degli utenti preimpostati sono disponibili nel file `password`.

## Comandi separati

Si può anche lanciare l'applicazione mediante comandi separati. Ci si assicuri
di aver eseguito `install-all.sh`; dopodiché, nella cartella `server`,
eseguiremo

```
npm install
```

e dunque

```
docker run --name mongodb -p 27017:27017 --replace docker.io/mongodb/mongodb-community-server:latest
```

oppure

```
podman run --name mongodb -p 27017:27017 --replace docker.io/mongodb/mongodb-community-server:latest
```

e 

```
npm start
```

Per eseguire l'inizializzazione del database, si esegua 

```
npm run resetdb
```
