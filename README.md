<p align="center">
<img src="res/Logo.png" height="300"  />
<h1 align="center">ESTame Dependency Injection (AMD)</h1>

<h5 align="center">Build With Proxies - By Philip Schoeman</h5>
<h5 align="center">License : MIT</h5>
</p>

## Introduction

The ESTame dependency injection framework is a small JavaScript framework that brings powerful dependency injection and inversion of control to JavaScript. Leveraging the power of ES6+ it provides the following features to your JavaScript project:

* Constructor parameter injection
* Method parameter injection
* Property injection

## Getting Started

The ESTame dependency injection module can be installed via NPM:

```javascript
npm install estame.di
```

## The IOC Container

The IOC container is an object containing the classes and the names they are bound to. With the ESTame dependency injection, the class definitions are bound to string names since JavaScript does not really have types. Name spaces can be used for property injection, more on that in the property injection section.

#### Creating An IOC Container Instance:

```javascript
const container = require("estame.di");
//Creating a new container instance
const iocContainer = new container();
//Adding a class definition to the container
iocContainer.Add("calculator", require("./calculator"));
```

#### Creating A Class Instance From The Container

```javascript
//Getting the IOC ready class from the IOC container
const calculatorConstructor = iocContainer.get("calculator");
//Creating an instance of the class
const calculator = new calculatorConstructor();
```

