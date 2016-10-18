# Lambda Kernel
Kernel to handle and provide structure to requests and responses for AWS Lambda and Serverless.

This module provides the necessary building blocks for you to build a structured Lambda function. Initially it is targeting Serverless v1, but easily used for vanilla Lambda.

## Install
```
npm i -S lambda-kernel
```

## Basic Usage
```javascript
// handler.js (the lambda entrypoint)

const kernel = require('lambda-kernel');
// controller is your own business logic
const controller = require('./lib/controller');

module.exports = {
  exampleName: kernel.dispatch(controller.exampleName)
};
```
```javascript
// ./lib/controller.js (your business logic)

const Response = require('lambda-kernel/lib/Response');

module.exports = {
  exampleName: (req, env) => {
    return new Response(`this is an example in ${env.stage}`, 200);
  }
};
```

## Middleware
You can create middleware by extending the middlware class and passing your middleware instances in an array as the second parameter of the `kernel.dispatch` method.
`Middleware#create` is passed the same `req` and `env` parameters as controller methods.
The return value of the `Middleware#create` method will then be provided to the controller method in the order that the middleware was provided (after the `req`, `env` parameters).

