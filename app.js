const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');

const app = express();

const jwtCheck = jwt({
	secret: jwks.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: 'https://assistweb.auth0.com/.well-known/jwks.json'
	}),
	audience: 'http://GOD-mode-Production',
	issuer: 'https://assistweb.auth0.com/',
	algorithms: ['RS256']
});

const checkScopes = jwtAuthz(['read:secfgfdgdfdretarea']);

// jwt({ secret: new Buffer('shhhhhhared-secret', 'base64') })

app.use(bodyParser.json());
// app.use(jwtCheck.unless({ path: ['/public'] }));

app.get('/protected', jwtCheck, (req, res) => {
	res.send('secret area');
});

app.get('/protected-scoped', jwtCheck, checkScopes, (req, res) => {
	res.send('secret area');
});

// app.get('/protected', (req, res) => {
// 	res.send('secret area');
// });

// app.get('/protected-scoped', checkScopes, (req, res) => {
// 	res.send('scoped secret area');
// });

app.get('/public', (req, res) => {
	console.log(req.get('Authorization'));
	res.send('public area');
});

app.listen(3000, () => {
	console.log('App has started on port 3000');
});
