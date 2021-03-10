const getMethodInterceptor = (methodInterceptorDefinition, container, parent) => {
    if (!methodInterceptorDefinition) return [];
    if (!Array.isArray(methodInterceptorDefinition)) throw "Method interceptor description should be an array.";
    return methodInterceptorDefinition.map(nameSpace => container.__get(nameSpace, parent, undefined, []));
};

module.exports = getMethodInterceptor;