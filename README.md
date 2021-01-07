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
const container = require("estame.di").container;
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
parentClassInstance.$propertyName.className
```

_Example:_

```javascript
container.add("basicClass", require("basicClass"));
container.addAnonymous("basicClass/model", require("model"));

const iocInstance = new (container.get("basicClass"))();
iocInstance.$myModel.model; //the model class
//the model instance will be available on the myModel property
const modelInstance = icoInstance.myModel;
```

### Anonymous Property Injection

Classes registered as anonymous are assigned to their parent classes with the name they are registered with on the IOC container. Their injection is requested without a name. The syntax is:

```javascript
parentClassInstance.$className
```

_Example:_

```javascript
container.add("basicClass", require("basicClass"));
container.addAnonymous("basicClass/model", require("model"));

const iocInstance = new (container.get("basicClass"))();
iocInstance.$myModel.model; //the model class
//the model instance will be available on the myModel property
const modelInstance = icoInstance.myModel;
```

### Constructor Parameter Assignment

When a class is injected on a property, additional parameters that are not registered in the IOC container can be passed to the constructor of the class.

Assigned parameters also need to be defined in the constructor definition of the class. However, they are not defined as strings, but symbols contained on an object that can be accessed:

```javascript
require("estame.di").types
```

Available Types For Constructor Parameter Assignment:
* string
* number
* object
* function
* boolean

#### Constructor Definitions For Parameter Assignment

Let's say we have a dog class that takes a breed, owner name and settings object as constructor parameters. We can then define the class as following:

```javascript
const parameterTypes = require("estame.di").types;
//
class dog {
    static get $constructor() { return [parameterTypes.string, parameterTypes.string, parameterTypes.object]; }
    constructor(breed, ownerName, settings) {
        this.stringAssignedA = stringAssignedA;
        this.stringAssignedB = stringAssignedB;
        this.objectAssigned = objectAssigned;
    }
}
```

When a class has a constructor definition that requires parameters, a proxy object will be assigned to the class until all the parameters are provided. When all the parameters are provided, the class will be constructed with provided values and assigned to the property. 

Values will be assigned on the following events:
* On assigning a value to the property - value
* On getting a property from the proxy object - property name
* On setting a property on the proxy object - property name and value

__Example, property assignment (anonymous):__

```javascript
container.add("basicClass", require("basicClass"));
//
container.addAnonymous("basicClass/dog", require("dog"));

const basicClass = new (container.get("basicClass"))();
```

To inject the class with the specified 2 string and one object argument as defined in the example above.

```javascript
//Injecting by assigning values to property
basicClass.$dog;
basicClass.dog = "Doberman";
basicClass.dog = "John";
basicClass.dog = { age: 5 };
```

```javascript
//Injecting by accessing values
basicClass.$dog.Doberman.John;
basicClass.dog = { age: 5 };
```

```javascript
//Injecting by accessing values and assigning value
basicClass.$dog.Doberman.John = { age: 5 };
```

Values assigned can be contained in an array to assign them all at once:
```javascript
//Injecting by assigning values to property via an array
basicClass.$dog = ["Doberman", "Doberman", { age: 5 }];
```

__Example, property assignment (named):__

```javascript
container.add("basicClass", require("basicClass"));
//
container.add("basicClass/dog", require("dog"));

const basicClass = new (container.get("basicClass"))();
```

To inject the class with the specified 2 string and one object argument as defined in the example above.

```javascript
//Injecting by assigning values to property
basicClass.$someDog.dog;
basicClass.someDog = "Doberman";
basicClass.someDog = "John";
basicClass.someDog = { age: 5 };
```

```javascript
//Injecting by accessing values
basicClass.$someDog.dog.Doberman.John;
basicClass.someDog = { age: 5 };
```

```javascript
//Injecting by accessing values and assigning value
basicClass.$someDog.dog.Doberman.John = { age: 5 };
```

Values assigned can be contained in an array to assign them all at once:
```javascript
//Injecting by assigning values to property via an array
basicClass.$someDog.dog = ["Doberman", "Doberman", { age: 5 }];
```

## IOC Container Reference

### add

The add method can be used to register a class definition. The object registered must have a constructor available since the framework will create a new instance when injected.

> When a class is registered with the add method, a new instance will be injected every time the class is injected.

| Parameter Name | Type | Description |
| -------------- | ------- | ----------- |
| nameSpace | string | The name of the class or the namespace of the class. |
| classDefinition | string | The class definition to register in the IOC container |
| detached | boolean | When set to true and the class is injected to a property, no instance will be applied to the parent class. The property will be undefined after it is injected. |

Can be used to register classes for:
* Constructor parameter injection
* Method parameter injection
* Property injection

### addScoped

The addScoped method can be used to register a class definition in a scoped context. The object registered must have a constructor available since the framework will create a new instance when injected.

> When a class is registered with the addScoped method, a new instance will be created for every time a class is manually constructed from the get method of the IOC container. When a class is created from the IOC container, all classes referenced by the class will receive the same instance, but when a new class is constructed from the container, a new instance will be injected for the new class.

| Parameter Name | Type | Description |
| -------------- | ------- | ----------- |
| nameSpace | string | The name of the class or the namespace of the class. |
| classDefinition | string | The class definition to register in the IOC container |

Can be used to register classes for:
* Constructor parameter injection
* Method parameter injection

### addSingleton

The addScoped method can be used to register a class definition as a singleton. The object registered must have a constructor available since the framework will create a new instance when injected.

> When a class is registered as a singleton, a new instance will be created the first time it is injected, and after that the same instance will be injected every time the class is injected.

| Parameter Name | Type | Description |
| -------------- | ------- | ----------- |
| nameSpace | string | The name of the class or the namespace of the class. |
| classDefinition | string | The class definition to register in the IOC container |

Can be used to register classes for:
* Constructor parameter injection
* Method parameter injection