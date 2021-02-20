const validateIOCClassValues = (nameSpace, classDefinition, iocContainer) => {
    if (typeof nameSpace !== "string")
        throw 'The namespace of an IOC entity has to be a string.';
    if (nameSpace.trim().length === 0)
        throw 'Please provide a namespace in order to register IOC entity.';
    if (typeof classDefinition !== "function")
        throw 'An IOC entity has to be a class or function.';
    if (iocContainer[nameSpace])
        throw `Namespace ${nameSpace} is already registered.`;
};

const validateIOCValues = (nameSpace, iocContainer) => {
    if (typeof nameSpace !== "string")
        throw 'The namespace of an IOC entity has to be a string.';
    if (nameSpace.trim().length === 0)
        throw 'Please provide a namespace in order to register IOC entity.';
    if (iocContainer[nameSpace])
        throw `Namespace ${nameSpace} is already registered.`;
};

const validateIOCClassContainerValues = (nameSpace, classDefinition, iocContainer) => {
    if (typeof nameSpace !== "string")
        throw 'The namespace of an IOC entity has to be a string.';
    if (nameSpace.trim().length === 0)
        throw 'Please provide a namespace in order to register IOC entity.';
    if (typeof classDefinition !== "function")
        throw 'An IOC entity has to be a class or function.';
    if (iocContainer[nameSpace] && !Array.isArray(iocContainer[nameSpace]))
        throw `Namespace ${nameSpace} is already registered as a non collection repo.`;
    if (!iocContainer[nameSpace])
        iocContainer[nameSpace] = [];
};

const validateIOCCollectionValues = (nameSpace, iocContainer) => {
    if (typeof nameSpace !== "string")
        throw 'The namespace of an IOC entity has to be a string.';
    if (nameSpace.trim().length === 0)
        throw 'Please provide a namespace in order to register IOC entity.';
        if (iocContainer[nameSpace] && !Array.isArray(iocContainer[nameSpace]))
        throw `Namespace ${nameSpace} is already registered as a non collection repo.`;
    if (!iocContainer[nameSpace])
        iocContainer[nameSpace] = [];
};


module.exports = { validateIOCValues, validateIOCClassValues, validateIOCClassContainerValues, validateIOCCollectionValues };
