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
const calculator = iocContainer.get("calculator");
//Creating an instance of the class
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

Parameters that will be injected manually, are defined as undefined. To call the method defined in the class above, only 2 parameters is passed, the third is injected:

```javascript
const container = require("estame.di").container;
//Creating a new container instance
const iocContainer = new container();
//Adding a class definition to the container
iocContainer.Add("calculator", require("./calculator"));
iocContainer.Add("additionCalc", require("./additionCalc"));

const calculator = iocContainer.get("calculator");
//Calling the method with 2 parameters. The third parameter is injected.
let operationResult = calculator.getValue(2,6);
```

## Property Injection

Property injection allows dependency injection on properties of an injected class.

Property injection can be defined use the names of the registered IOC classes to define where they can be injected. When a class is registered with a forward slash in the name ("/"),the property injection can only happen on the "namespaces" assigned to them. When a class is registered without a forward slash in the name, it can be injected on any class.

Example:

* classA is registered with name "classA"
* classB is registered with name "classB"
* classC is registered with name "classA/classC"
* classD is registered with name "classA/classC/classD"

In this example classC can be assigned to classA and classD can be assigned to classC. ClassA and ClassB can be injected on all other classes.

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

const iocInstance = container.get("basicClass");
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

const iocInstance = container.get("basicClass");
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
* array

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

const basicClass = container.get("basicClass");
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

A global function ( _ ) is available to assign more than one value at once:
```javascript
//Injecting by assigning values to property via the assignment function
basicClass.$dog = _("Doberman", "Doberman", { age: 5 });
```

__Example, property assignment (named):__

```javascript
container.add("basicClass", require("basicClass"));
container.add("basicClass/dog", require("dog"));

const basicClass = container.get("basicClass");
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

A global function "_" can be used to assign values inline and all at once:
```javascript
//Injecting by assigning values to property via the assignment function
basicClass.$someDog.dog = _("Doberman", "Doberman", { age: 5 });
```

## Namespaces

Namespaces are paths that indicate where classes can be injected to. Classes are registered on the IOC container with a namespace. There are two types of namespaces, global and targeted namespaces.

### Global Namespaces

Global namespaces are namespaces that can be injected on all classes. The most obvious difference between global and targeted namespaces is that global namespaces does not contain a target class in the namespace and targeted namespaces do. The target class indicated with forward slashes ("/").

#### Global Namespace Examples:

```javascript
container.add("engine", require("engine"));
container.add("piston", require("piston"));
container.add("rod", require("rod"));
```

Global namespaces can be injected with a using the namespace on any class. It does not take the parent classes in consideration.

#### Targeted Namespaces

Targeted namespaces are registered for a specific layer and class in a class hierarchy. The dependency injection framework takes all the parent classes in consideration when injecting a targeted class. 

Let's take an example:

There is a engine class, the engine class has needs the piston class and the piston class needs the rod class. The namespaces of the three classes will be:

```javascript
container.add("engine", require("engine"));
container.add("engine/piston", require("piston"));
container.add("engine/piston/rod", require("rod"));
```

When registering the classes with their target parents, they can only be injected on those classes. The rod class can not be injected on the engine class and the piston class not on the rod class. The rod class can be injected on the piston class piston class though.

When injecting targeted classes, the path of the class does not need to be in the name used to inject the class. In the example above, the "rod" class can be injected on the piston class by using only the name "rod". The path will be calculated by using the path of the parent class the rod class is injected to.

A single class definition can be registered in the IOC container with more than one namespace. For example, if you want to use the piston class on the engine class and the block class:

```javascript
container.add("engine", require("engine"));
container.add("engine/piston", require("piston"));
container.add("engine/block/piston", require("piston"));
```

More than one class can also be registered with the same name as long as they have different namespaces. In this example the engineWire class instance will be injected on the engine class and the dashboardWire class will be injected on the dashboard class:

```javascript
container.add("engine", require("engine"));
container.add("engine/wire", require("engineWire"));
container.add("dashboard", require("dashboard"));
container.add("dashboard/wire", require("dashboardWire"));
```

## Dependency Collections

When more than one dependency needs to be registered on a namespace, it can be registered in a dependency collection. When the values are injected, the class instances and/or values will be injected in an array to the constructor or method. To register dependencies in dependency collections, use the addToCollection, addScopedToCollection, addSingletonToCollection or addValueToCollection methods on the IOC container. _Please note that dependency collections can not be used via property injection_.

## IOC Container Reference

### add

The add method can be used to register a class definition. The object registered must have a constructor available since the framework will create a new instance when injected.

> When a class is registered with the add method, a new instance will be injected every time the class is injected.

| Parameter Name | Type | Description |
| -------------- | ------- | ----------- |
| nameSpace | string | The name of the class or the namespace of the class. |
| classDefinition | class | The class definition to register in the IOC container |
| detached | boolean | When set to true and the class is injected to a property, no instance will be applied to the parent class. The property will be undefined after it is injected. |

Can be used to register classes for:

* Constructor parameter injection
* Method parameter injection
* Property injection

### addToCollection

The addToCollection method can be used to register a class definition to a dependency collection. The object registered must have a constructor available since the framework will create a new instance when injected.

> When a class is registered with the add method, a new instance will be injected every time the class is injected.

| Parameter Name | Type | Description |
| -------------- | ------- | ----------- |
| nameSpace | string | The name of the class or the namespace of the class. |
| classDefinition | class | The class definition to register in the IOC container |

Can be used to register classes for:

* Constructor parameter injection
* Method parameter injection

### addScoped

The addScoped method can be used to register a class definition in a scoped context. The object registered must have a constructor available since the framework will create a new instance when injected.

> When a class is registered with the addScoped method, a new instance will be created for every time a class is manually constructed from the get method of the IOC container. When a class is created from the IOC container, all classes referenced by the class will receive the same instance, but when a new class is constructed from the container, a new instance will be injected for the new class.

| Parameter Name | Type | Description |
| -------------- | ------- | ----------- |
| nameSpace | string | The name of the class or the namespace of the class. |
| classDefinition | class | The class definition to register in the IOC container |

Can be used to register classes for:

* Constructor parameter injection
* Method parameter injection

### addScopedToCollection

The addScopedToCollection method can be used to register a class definition in a scoped context to a dependency collection. The object registered must have a constructor available since the framework will create a new instance when injected.

> When a class is registered with the addScopedToCollection method, a new instance will be created for every time a class is manually constructed from the get method of the IOC container. When a class is created from the IOC container, all classes referenced by the class will receive the same instance, but when a new class is constructed from the container, a new instance will be injected for the new class.

| Parameter Name | Type | Description |
| -------------- | ------- | ----------- |
| nameSpace | string | The name of the class or the namespace of the class. |
| classDefinition | class | The class definition to register in the IOC container |

Can be used to register classes for:

* Constructor parameter injection
* Method parameter injection

### addSingleton

The addScoped method can be used to register a class definition as a singleton. The object registered must have a constructor available since the framework will create a new instance when injected.

> When a class is registered as a singleton, a new instance will be created the first time it is injected, and after that the same instance will be injected every time the class is injected.

| Parameter Name | Type | Description |
| -------------- | ------- | ----------- |
| nameSpace | string | The name of the class or the namespace of the class. |
| classDefinition | class | The class definition to register in the IOC container |

Can be used to register classes for:

* Constructor parameter injection
* Method parameter injection

### addSingletonToCollection

The addSingletonToCollection method can be used to register a class definition as a singleton to a dependency collection. The object registered must have a constructor available since the framework will create a new instance when injected.

> When a class is registered as a singleton, a new instance will be created the first time it is injected, and after that the same instance will be injected every time the class is injected.

| Parameter Name | Type | Description |
| -------------- | ------- | ----------- |
| nameSpace | string | The name of the class or the namespace of the class. |
| classDefinition | class | The class definition to register in the IOC container |

Can be used to register classes for:

* Constructor parameter injection
* Method parameter injection

### addAnonymous

The addAnonymous method can be used to register a class definition for property injection. The object registered must have a constructor available since the framework will create a new instance when injected. 

> When a class is registered with the addAnonymous method, a new instance will be injected every time the class and the properties will have no names.

| Parameter Name | Type | Description |
| -------------- | ------- | ----------- |
| nameSpace | string | The name of the class or the namespace of the class. |
| classDefinition | class | The class definition to register in the IOC container |
| detached | boolean | When set to true and the class is injected to a property, no instance will be applied to the parent class. The property will be undefined after it is injected. |

Can be used to register classes for:

* Property injection

### addValue

The addValue method can be used to register an object or value that will be injected without the constructor being called. When used with property injection, objects registered with addValue will require a name.

| Parameter Name | Type | Description |
| -------------- | ------- | ----------- |
| nameSpace | string | The name of the class or the namespace of the class. |
| value | any | The object to register into the IOC container |

Can be used to register classes for:

* Constructor parameter injection
* Method parameter injection
* Property injection

### addValueScoped

The addValueScoped method can be used to register an object or value in a scoped context that will be injected without the constructor being called. When used with property injection, objects registered with addValueScoped will require a name.

| Parameter Name | Type | Description |
| -------------- | ------- | ----------- |
| nameSpace | string | The name of the class or the namespace of the class. |
| value | any | The object to register into the IOC container |

Can be used to register classes for:

* Constructor parameter injection
* Method parameter injection
* Property injection

### addValueToCollection

The addValueToCollection method can be used to register an object or value to a dependency collection that will be injected without the constructor being called. When used with property injection, objects registered with addValue will require a name.

| Parameter Name | Type | Description |
| -------------- | ------- | ----------- |
| nameSpace | string | The name of the class or the namespace of the class. |
| value | any | The object to register into the IOC container |

Can be used to register classes for:

* Constructor parameter injection
* Method parameter injection

### addAnonymousValue

The addAnonymousValue method can be used to register an object or value that will be injected without the constructor being called. When used with property injection, objects registered with addAnonymousValue will not require a name.

| Parameter Name | Type | Description |
| -------------- | ------- | ----------- |
| nameSpace | string | The name of the class or the namespace of the class. |
| value | any | The object to register into the IOC container |

Can be used to register classes for:

* Property injection

### get

Dependency injection registered classes or values can be retrieved via the get method. The get method will return an instance of the class if a class definition is retrieved and a value if a value is registered. If a collection of dependencies is registered, an array of the class instances and/or values will be returned.

| Parameter Name | Type | Description |
| -------------- | ------- | ----------- |
| nameSpace | string | The name of the class or the namespace of the class. |

### exists

Runs IOC container factories and checks if a class is registered in the IOC container.

| Parameter Name | Type | Description |
| -------------- | ------- | ----------- |
| nameSpace | string | The name of the class or the namespace of the class. |

## Parameter Types

The parameter types can be accessed from an object exported from the main estame.di module.

__Parameter types:__

| Type Name | Description | Can Be Used On |
| -------------- | ------- | ----------- |
| parent | The parent class of the current class instance. | All |
| container | The IOC container instance. | All |
| string | Defines an assignable string parameter. | Named and anonymous property injection |
| number | Defines an assignable number parameter. | Named and anonymous property injection |
| object | Defines an assignable object parameter. | Named and anonymous property injection |
| function | Defines an assignable function parameter. | Named and anonymous property injection |
| boolean | Defines an assignable boolean parameter. | Named and anonymous property injection |
| array | Defines an assignable array parameter. | Named and anonymous property injection |
| name | The name of a named injected property. | Named property injection |



