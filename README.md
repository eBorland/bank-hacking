# BankHacking

This is a very small project used for a Workshop in Sopra Steria about Ethical Hacking

The slides show the most typical attacks in Web Servers and suggests some defense for each of them

## Development server
### Requisites
- Node 6+ (and the npm included with it)
- MongoDB with the following config:
    - Auth enabled
    - DB Name: `bank`
    - Username: `test`
    - Password: `test`

### Populating the DB

Run `mongorestore --db=bank -u=test -p=test --dir=./backup/bank --drop`

**HEADS UP!** This will detroy the current DB and restore the initial one

### Installing dependencies

Run `npm install` to install all node dependencies

### Runing the API

Run `npm run start:api` to start the api

### Runing the APP

Run `npm run start:app` to start the application server and nagivate to `http://localhost:4200` to start playing with it

## Exposing the server to the internet
Once you are running the app and the api in your local environment, you can expose them using **ngrok**

### Expose the API

Run `npm run expose:api` to expose the api

### Expose the APP

Run `npm run expose:app` to expose the app



#### Happy Hacking
