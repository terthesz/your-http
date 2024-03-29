<div style="display: flex;">
  <div>
    <h1 style="margin: 0; padding: 0">Package: your-http</h1>
    <h6 style="margin-top: 0; padding: 0; margin-bottom: 25px;">(Because you're the one using it).</h6>
  </div>

  <div style="margin: 10px 0 0 auto;">
    <img style="align:left;" src="https://github.com/TerThesz/your-http/actions/workflows/publish.yaml/badge.svg" />
    <img src="https://github.com/TerThesz/your-http/actions/workflows/test.yaml/badge.svg" />
    <img src="https://img.shields.io/npm/v/your-http?label=version" />
    <img src="https://img.shields.io/github/license/TerThesz/your-http" />
  </div>
</div>

<hr style="background-color: gray; opacity: 0.4; height: 2px; margin-top: 15px; margin-bottom: 40px;" />

### 1. Installation

Install package using:
``` bash
npm i your-http

or

yarn add your-http
```

### 2. Usage <br/>

##### 1. Importing

###### JS
``` javascript
  const http = require('your-http');
```

###### TS
``` typescript
  import http from 'your-http';
```

##### 2. Route Examples

###### JS
``` javascript
  const http = require('your-http');
  const router = new http.Router();

  router.get('/', (req, res, next) => {
    /* Code... */
  });

  exports.default = router;
```

###### TS
``` typescript
  import { Router } from 'your-http';
  const router = new Router();

  router.get('/', (req, res, next) => {
    /* Code... */
  });

  export = router;
```
<br/>

##### 3. How to use the Router

##### 3.A Methods

###### Usage:
`router.get('/', (req, res, next) => {});`

###### Methods:
`.get(), .post(), .delete(), .put(), .update()`

##### 3.B Arguments

###### All arguments:
`req, res, next`

##### 3.B A Request (req)
###### All request information is stored in here.

###### Request object:
###### How to use it: [Click here](#3-detailed-usage)

| Value | Description | Type |
| ------|:------------|-----:|
| socket | TCP socket | Socket |
| headers | Returns all headers | Object Property |
| rawHeaders | All raw headers | Array |
| protocol | Request HTTP protocol | string |
| method | Request method | string |
| url | Request endpoint | string |
| body | Request body | any |
| ip | Client IP | string |
| query | Returns all query parameters | Object Property |
| cookies | Returns all cookies | Object Property |

###### Only useful functions:
``` javascript
req.headers;

req.rawHeaders;

req.body;

req.ip;

req.query;

req.cookies;
```

##### 3.B B Response (res)
###### All response information is stored in here.

###### Response object:
###### How to use it: [Click here](#3-detailed-usage)

| Value | Description | Type |
| ------|:------------|-----:|
| socket | TCP socket | Socket |
| protocol | Response HTTP protocol (HTTP/1.1) | string |
| statusCode | Response status code | number |
| statusMessage | Response status message | string |
| headers | Returns all headers | Object Property |
| body | Response body | any |
| server | Server name | string |
| lastModified | Last change to the response | Date |
| canBeSent, wasSent | Values used by the http server. | boolean |
| status(number) | Change status code of the response | Function |
| write(string) | Set content type to text and change response body | Function |
| json(object) | Set content type to application/json and change response body | Function |
| cookies | Returns all cookies | Object Property |
| setCookie(name, value, settings: object) | Adds a cookie to the response headers | Function |
| send(any) | Automatically sets content type and changes body | Function |
| setHeaders(name, value) | Adds a response header | Function |

###### Only useful functions:
``` javascript
res.headers;

res.status(number);

res.write(string);

res.json(object);

res.send(any);

res.setCookie(name, value, settings);

res.setHeader(name, value);
```

##### DO NOT MANUALLY CHANGE RESPONSE INFORMATION. Use response functions instead ( All functions displayed above );

##### 3.B C NextFunction (next)
###### If called, next router will run after the current one finishes.

###### Type: Function. No arguments or values.

##### 4. How to create a server
###### Usage
``` javascript
  http.createServer(router1, router2...).listen(port, ip[optional], callback[optional]);
```
###### Example
``` javascript
  http.createServer(router1).listen(3000, '0.0.0.0', () => 
    console.log('🏃 on port 3000.'));
```
###### Tip: Use ip: '0.0.0.0' to get IPv4 from req.ip
<br/>

### 3. Detailed Usage

##### 1. Working with cookies

###### Getting all request cookies
```javascript
...
req.cookies;
...
```
###### Adding response cookies
```javascript
...
res.setCookie('name', 'value', { Settings: true });
...
```

##### 2. Query & body

###### Getting request body
``` javascript
...
req.body;
...
```
###### Returning response body
``` javascript
...
res.functionName/* send or write or json or status */(value);
...
```
###### Getting query parameters
``` javascript
...
req.query;
...
```
##### Headers

###### Getting request headers
``` javascript
...
req.headers;
...
```
###### Adding a response header
``` javascript
...
res.setHeader('name', 'value');
...
```

<br/>
<br/>

###### More features coming soon!

#### WARNING: I did not add any security features yet.