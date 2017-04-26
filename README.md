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

### Runing the API

Run `npm run start:api` to start the api

### Runing the APP

Run `npm run start:app` to start the application server and nagivate to `http://localhost:4200` to start playing with it


#### Happy Hacking
