# EStame DI

The dependency injection module will be used to handle all the dependencies in EStame. The IOC container will act as the module container. 

The DI proxy should also act as the assignable base proxy. The namespace of the DI proxy should indicate where a proxy can be created on.

Factories can be registered on a namespace. If a namespace is not found, the factory will be invoked in order to try and load the namespace.

Named and anonymous IOC entity instances can be created with same syntax as willcore assingables.

___

* Let's say we have a base EStame class. It is registered as "estame".
* We can create a HTTP server instance on the estame base proxy. It is registered as "estame/httpServer".
* The factory for the HTTP server is registered as "estame/httpServer.factory".
* Additional proxy traps can be registered as "estame/httpServer.traps".
* IOC entities can be instanciated by getting or setting a property on the parent IOC entity starting with a "$".
* IOC entities can be created by proxy chains. EStame does not have assignables, classes with constructor parameter definitions are replacing assignables.
* Nameless IOC entities can be defined by added it on the IOC container with the addAnonymous method. The method should take another string value that is the target the entity can be applied to.
* Instance IOC entities construction parameter types:
    * string
    * number
    * object
    * name
    * parent

Example:

```javascript
const parameterTypes = require("parameterTypes.js");
class mySQLDB {
    static get $constructor() { return [mySQLDB.name, mySQLDB.string, mySQLDB.number, "mySQL/dbCreator"] }
    constructor(name, connectionString, portName, dbCreator) {
    }
}

module.exports = mySQLDB;
```

```javascript
//to add an nameless IOC instance entity
//can be applied to /estame/server
iocContainer.addAnonymous("/estame/server/http", httpServer); 
```