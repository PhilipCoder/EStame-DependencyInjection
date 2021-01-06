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

## Constructor Descriptors

When a class instance is created, ESTame needs to know what parameters to inject. To define the constructor's parameters, a static property "$constructor" (with only a get) should be present on the class. The property should return an array of the registered IOC entries' names.

```javascript
class calculator {
    //The constructor descriptor.
    //First parameter will loaded from name "numberMultiplier"
    //Second parameter will be loaded from name "numberDivider"
    static get $constructor(){ return ["numberMultiplier", "numberDivider"]; }
    constructor(multiplier, divider){
        this.multiplier = multiplier;
        this.numberDivider = divider;
    }
}
```

## Method Descriptors

Method descriptors can be defined to specify dependency injection on a method call. Unlike constructor descriptions, method descriptors are not static. The method descriptor should be a property with the same name as the method, but with a leading "$".

```javascript
class calculator {
    constructor() {

    }
    //Will inject additionCalc into the third parameter
    get $getValue() { return [undefined, undefined, "additionCalc"] }
    getValue(a, b, additionCalc) {
        return additionCalc.addValue(a, b);
    }
}
```

## Property Injection

Property injection allows dependency injection on properties of an injected class.

Property injection use the names of the registered IOC classes to define where they can be injected. Unlike constructor and method injection, property injection can only happen on the "namespaces" assigned to them. 

Example:
* classA is registered with name "classA"
* classB is registered with name "classB"
* classC is registered with name "classA/classC"
* classD is registered with name "classA/classC/classD"

In this example classC can be assigned to classA and classD can be assigned to classC.

### Named Property Injection

By default when you add an IOC class to the container via the add method, the property will require a name.

Property injection can be activated by accessing a value starting with "$" on a class. With named injected properties, the syntax is:

```javascript
classInstance.$propertyName.className
```

## Dependency Injection Life Cycles