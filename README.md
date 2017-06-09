# Lambda Kernel
Kernel to handle and provide structure to requests and responses for AWS Lambda and Serverless.

[![view on npm](https://img.shields.io/npm/v/lambda-kernel.svg)](https://img.shields.io/npm/v/lambda-kernel.svg)

This module provides the necessary building blocks for you to build a structured Lambda function.
Initially it is targeting Serverless v1, but easily used for vanilla Lambda.

## Install
```
npm i -S lambda-kernel
```

## Basic Usage
```javascript
// handler.js (the lambda entrypoint)

const Kernel = require('lambda-kernel');
// controller is your own business logic
const controller = require('./lib/controller');

// instantiate the kernel, global configuration
// can be passed into the constructor here
const kernel = new Kernel();

module.exports = {
  exampleAction: kernel.dispatch(controller.exampleAction)
};
```

```javascript
// ./lib/controller.js (your business logic)

const Response = require('lambda-kernel/lib/Response');

module.exports = {
  exampleAction: (req, env) => {
    return new Response(`this is an example in ${env.stage}`, 200);
  }
};
```

### Middleware
Middleware provides a clean and re-usable way to instantiate services needed for your actions.
You can create middleware by extending the middleware class and passing your middleware
instances in an array into the Kernel constructor to apply it globally or as a parameter of the dispatch method to
apply it to that action only.

`Middleware#create` is passed the same `req` and `env` parameters as controller methods.
The return value of the `Middleware#create` method will then be provided to the controller method
in the order that the middleware was provided (after the `req`, `env` parameters).

Action-specific middleware is always provided in order after the Kernel middleware.

## Classes

<dl>
<dt><a href="#ServerlessTransformer">ServerlessTransformer</a> ⇐ <code><a href="#Transformer">Transformer</a></code></dt>
<dd><p>Transformer to handle Serverless v1&#39;s
default Lambda integration event.</p>
</dd>
<dt><a href="#Transformer">Transformer</a></dt>
<dd><p>Abstract class that all transformers should extend and
implement the interface as below</p>
</dd>
<dt><a href="#DictAccessor">DictAccessor</a></dt>
<dd><p>Simple Dictionary (Map) accessor for data.</p>
</dd>
<dt><a href="#Kernel">Kernel</a></dt>
<dd><p>The core class of Lambda-Kernel, use this at the root of your application
to handle the request to response lifecycle.</p>
</dd>
<dt><a href="#Middleware">Middleware</a></dt>
<dd><p>Abstract class that your Middleware must extend and implement
the interface as below.</p>
</dd>
<dt><a href="#Request">Request</a></dt>
<dd><p>Request object provided to your action by the dispatcher.
You use this to access the event request data.</p>
</dd>
<dt><a href="#Response">Response</a></dt>
<dd><p>You must return a Response from your action.</p>
</dd>
</dl>

<a name="ServerlessTransformer"></a>

## ServerlessTransformer ⇐ <code>[Transformer](#Transformer)</code>
Transformer to handle Serverless v1's
default Lambda integration event.

**Kind**: global class  
**Extends:** <code>[Transformer](#Transformer)</code>  

* [ServerlessTransformer](#ServerlessTransformer) ⇐ <code>[Transformer](#Transformer)</code>
    * [.parseFromEvent(event)](#Transformer+parseFromEvent) ⇒ <code>RequestData</code>
    * *[.parsePath(event)](#Transformer+parsePath) ⇒ <code>object</code>*
    * *[.parseMethod(event)](#Transformer+parseMethod) ⇒ <code>object</code>*
    * *[.parseHeaders(event)](#Transformer+parseHeaders) ⇒ <code>object</code>*
    * *[.parseQuery(event)](#Transformer+parseQuery) ⇒ <code>object</code>*
    * *[.getRawBody(event)](#Transformer+getRawBody) ⇒ <code>string</code>*

<a name="Transformer+parseFromEvent"></a>

### serverlessTransformer.parseFromEvent(event) ⇒ <code>RequestData</code>
**Kind**: instance method of <code>[ServerlessTransformer](#ServerlessTransformer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | lambda integration event |

<a name="Transformer+parsePath"></a>

### *serverlessTransformer.parsePath(event) ⇒ <code>object</code>*
**Kind**: instance abstract method of <code>[ServerlessTransformer](#ServerlessTransformer)</code>  
**Overrides:** <code>[parsePath](#Transformer+parsePath)</code>  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | lambda integration event |

<a name="Transformer+parseMethod"></a>

### *serverlessTransformer.parseMethod(event) ⇒ <code>object</code>*
**Kind**: instance abstract method of <code>[ServerlessTransformer](#ServerlessTransformer)</code>  
**Overrides:** <code>[parseMethod](#Transformer+parseMethod)</code>  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | lambda integration event |

<a name="Transformer+parseHeaders"></a>

### *serverlessTransformer.parseHeaders(event) ⇒ <code>object</code>*
**Kind**: instance abstract method of <code>[ServerlessTransformer](#ServerlessTransformer)</code>  
**Overrides:** <code>[parseHeaders](#Transformer+parseHeaders)</code>  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | lambda integration event |

<a name="Transformer+parseQuery"></a>

### *serverlessTransformer.parseQuery(event) ⇒ <code>object</code>*
**Kind**: instance abstract method of <code>[ServerlessTransformer](#ServerlessTransformer)</code>  
**Overrides:** <code>[parseQuery](#Transformer+parseQuery)</code>  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | lambda integration event |

<a name="Transformer+getRawBody"></a>

### *serverlessTransformer.getRawBody(event) ⇒ <code>string</code>*
Return the raw body string from the event structure

**Kind**: instance abstract method of <code>[ServerlessTransformer](#ServerlessTransformer)</code>  
**Overrides:** <code>[getRawBody](#Transformer+getRawBody)</code>  

| Param | Type |
| --- | --- |
| event | <code>object</code> | 

<a name="Transformer"></a>

## *Transformer*
Abstract class that all transformers should extend and
implement the interface as below

**Kind**: global abstract class  

* *[Transformer](#Transformer)*
    * *[new Transformer(bodyParser)](#new_Transformer_new)*
    * *[.parseFromEvent(event)](#Transformer+parseFromEvent) ⇒ <code>RequestData</code>*
    * **[.parsePath(event)](#Transformer+parsePath) ⇒ <code>object</code>**
    * **[.parseMethod(event)](#Transformer+parseMethod) ⇒ <code>object</code>**
    * **[.parseHeaders(event)](#Transformer+parseHeaders) ⇒ <code>object</code>**
    * **[.parseQuery(event)](#Transformer+parseQuery) ⇒ <code>object</code>**
    * **[.getRawBody(event)](#Transformer+getRawBody) ⇒ <code>string</code>**

<a name="new_Transformer_new"></a>

### *new Transformer(bodyParser)*

| Param | Type |
| --- | --- |
| bodyParser | <code>function</code> | 

<a name="Transformer+parseFromEvent"></a>

### *transformer.parseFromEvent(event) ⇒ <code>RequestData</code>*
**Kind**: instance method of <code>[Transformer](#Transformer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | lambda integration event |

<a name="Transformer+parsePath"></a>

### **transformer.parsePath(event) ⇒ <code>object</code>**
**Kind**: instance abstract method of <code>[Transformer](#Transformer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | lambda integration event |

<a name="Transformer+parseMethod"></a>

### **transformer.parseMethod(event) ⇒ <code>object</code>**
**Kind**: instance abstract method of <code>[Transformer](#Transformer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | lambda integration event |

<a name="Transformer+parseHeaders"></a>

### **transformer.parseHeaders(event) ⇒ <code>object</code>**
**Kind**: instance abstract method of <code>[Transformer](#Transformer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | lambda integration event |

<a name="Transformer+parseQuery"></a>

### **transformer.parseQuery(event) ⇒ <code>object</code>**
**Kind**: instance abstract method of <code>[Transformer](#Transformer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>object</code> | lambda integration event |

<a name="Transformer+getRawBody"></a>

### **transformer.getRawBody(event) ⇒ <code>string</code>**
Return the raw body string from the event structure

**Kind**: instance abstract method of <code>[Transformer](#Transformer)</code>  

| Param | Type |
| --- | --- |
| event | <code>object</code> | 

<a name="DictAccessor"></a>

## DictAccessor
Simple Dictionary (Map) accessor for data.

**Kind**: global class  

* [DictAccessor](#DictAccessor)
    * [.has(key)](#DictAccessor+has) ⇒ <code>boolean</code>
    * [.get(key, defaultVal)](#DictAccessor+get) ⇒ <code>\*</code>
    * [.all()](#DictAccessor+all) ⇒ <code>Object</code>

<a name="DictAccessor+has"></a>

### dictAccessor.has(key) ⇒ <code>boolean</code>
Check whether the dictionary has the provided key.

**Kind**: instance method of <code>[DictAccessor](#DictAccessor)</code>  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | dictionary key to check |

<a name="DictAccessor+get"></a>

### dictAccessor.get(key, defaultVal) ⇒ <code>\*</code>
Ger the value for the provided key,
or the provided default value if the key
does not exist. Otherwise returns null.

**Kind**: instance method of <code>[DictAccessor](#DictAccessor)</code>  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | dictionary key to get |
| defaultVal |  | default value if key doesn't exist |

<a name="DictAccessor+all"></a>

### dictAccessor.all() ⇒ <code>Object</code>
Return a clone of this dictionary as
a simple JavaScript Object.

**Kind**: instance method of <code>[DictAccessor](#DictAccessor)</code>  
<a name="Kernel"></a>

## Kernel
The core class of Lambda-Kernel, use this at the root of your application
to handle the request to response lifecycle.

**Kind**: global class  

* [Kernel](#Kernel)
    * [new Kernel([options])](#new_Kernel_new)
    * [.dispatch(action, [middleware])](#Kernel+dispatch) ⇒

<a name="new_Kernel_new"></a>

### new Kernel([options])
Construct a new kernel with the provided options.


| Param | Type |
| --- | --- |
| [options] | <code>Object</code> | 
| [options.transformer] | <code>[Transformer](#Transformer)</code> | 
| [options.middlewares] | <code>[Array.&lt;Middleware&gt;](#Middleware)</code> | 
| [options.forceEnd] | <code>boolean</code> | 

<a name="Kernel+dispatch"></a>

### kernel.dispatch(action, [middleware]) ⇒
Public dispatch method to interface with
the Lambda integration layer.

**Kind**: instance method of <code>[Kernel](#Kernel)</code>  
**Returns**: function  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>function</code> | function to invoke for the request |
| [middleware] | <code>[Array.&lt;Middleware&gt;](#Middleware)</code> | any additional middleware for this request |

<a name="Middleware"></a>

## *Middleware*
Abstract class that your Middleware must extend and implement
the interface as below.

**Kind**: global abstract class  

* *[Middleware](#Middleware)*
    * *[new Middleware()](#new_Middleware_new)*
    * **[.create(req, env)](#Middleware+create) ⇒**
    * **[.destroy()](#Middleware+destroy)**

<a name="new_Middleware_new"></a>

### *new Middleware()*
The constructor is the opportune time
to pass any config information which can
be later used in the create() method.

<a name="Middleware+create"></a>

### **middleware.create(req, env) ⇒**
Return the value which should be
passed to the controller method.

**Kind**: instance abstract method of <code>[Middleware](#Middleware)</code>  
**Returns**: any  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>[Request](#Request)</code> | Request transformed from Lambda integration event |
| env | <code>Object</code> | Lambda context information |

<a name="Middleware+destroy"></a>

### **middleware.destroy()**
Perform any cleanup required before
the termination of the request.

**Kind**: instance abstract method of <code>[Middleware](#Middleware)</code>  
<a name="Request"></a>

## Request
Request object provided to your action by the dispatcher.
You use this to access the event request data.

**Kind**: global class  

* [Request](#Request)
    * [.path](#Request+path) ⇒ <code>string</code>
    * [.method](#Request+method) ⇒ <code>string</code>
    * [.query](#Request+query) ⇒ <code>[DictAccessor](#DictAccessor)</code>
    * [.headers](#Request+headers) ⇒ <code>[DictAccessor](#DictAccessor)</code>
    * [.body](#Request+body) ⇒ <code>[DictAccessor](#DictAccessor)</code>

<a name="Request+path"></a>

### request.path ⇒ <code>string</code>
The HTTP path requested

**Kind**: instance property of <code>[Request](#Request)</code>  
<a name="Request+method"></a>

### request.method ⇒ <code>string</code>
The HTTP request method

**Kind**: instance property of <code>[Request](#Request)</code>  
<a name="Request+query"></a>

### request.query ⇒ <code>[DictAccessor](#DictAccessor)</code>
The HTTP request path query params

**Kind**: instance property of <code>[Request](#Request)</code>  
<a name="Request+headers"></a>

### request.headers ⇒ <code>[DictAccessor](#DictAccessor)</code>
The HTTP request headers

**Kind**: instance property of <code>[Request](#Request)</code>  
<a name="Request+body"></a>

### request.body ⇒ <code>[DictAccessor](#DictAccessor)</code>
The HTTP request body

**Kind**: instance property of <code>[Request](#Request)</code>  
<a name="Response"></a>

## Response
You must return a Response from your action.

**Kind**: global class  

* [Response](#Response)
    * [new Response(body, [code], [headers])](#new_Response_new)
    * [.simplified()](#Response+simplified) ⇒ <code>Object</code>

<a name="new_Response_new"></a>

### new Response(body, [code], [headers])
Construct a new response


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| body | <code>object</code> |  | object to be serialized for HTTP body |
| [code] | <code>number</code> | <code>200</code> | integer HTTP code |
| [headers] | <code>object</code> |  | key/value map of any HTTP headers |

<a name="Response+simplified"></a>

### response.simplified() ⇒ <code>Object</code>
Generate and return Lambda integration object for the response.

**Kind**: instance method of <code>[Response](#Response)</code>  

* * *

&copy; 2017 Matthew Webb