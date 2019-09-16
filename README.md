# Ethernaut Event Log Filter

Storing all the level complete logs into mongo database, including player address and level contract address.

### To run 
1. create `.env` file
```
DB_URI=YOUR_MONGODB_URI
```
2. run `npm install` 
3. run `init.js` to drop the old collections and create new ones
4. run `server.js` to start listening event
