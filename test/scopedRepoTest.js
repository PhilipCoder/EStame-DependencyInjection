const assert = require('chai').assert;
const iocContainer = require("../iocContainer.js");
const grandParent = require("./scopedRepoMocks/grandParent");
const parent = require("./scopedRepoMocks/parent");
const me = require("./scopedRepoMocks/me");
const scopedGene = require("./scopedRepoMocks/scopedGene");


describe('scoped repo', function () {
    it("scoped",function () {
        const container = new iocContainer();
        container.add("grandParent", grandParent);
        container.add("parent", parent);
        container.add("me", me);
        container.addScoped("scopedGene", scopedGene);

        let grantParentClassDefinition = container.get("grandParent");
        let grantParentClassInstance = new grantParentClassDefinition();
        assert(grantParentClassInstance.parentA.instance !== grantParentClassInstance.parentB.instance, "Instance error" );
        assert(grantParentClassInstance.parentA.me.instance !== grantParentClassInstance.parentB.me.instance, "Instance error" );

        assert(grantParentClassInstance.parentA.scopedGene.instance === grantParentClassInstance.parentB.scopedGene.instance, "Instance error" );
        assert(grantParentClassInstance.parentA.me.scopedGene.instance === grantParentClassInstance.parentB.me.scopedGene.instance, "Instance error" );
        assert(grantParentClassInstance.parentA.scopedGene.instance === grantParentClassInstance.parentA.me.scopedGene.instance, "Instance error" );
        assert(grantParentClassInstance.parentB.scopedGene.instance === grantParentClassInstance.parentB.me.scopedGene.instance, "Instance error" );

        let grantParentClassInstanceB = new grantParentClassDefinition();
        assert(grantParentClassInstanceB.parentA.scopedGene.instance !== grantParentClassInstance.parentB.scopedGene.instance, "Instance error" );
        assert(grantParentClassInstanceB.parentA.me.scopedGene.instance !== grantParentClassInstance.parentB.me.scopedGene.instance, "Instance error" );
        assert(grantParentClassInstanceB.parentA.scopedGene.instance !== grantParentClassInstance.parentA.me.scopedGene.instance, "Instance error" );
        assert(grantParentClassInstanceB.parentB.scopedGene.instance !== grantParentClassInstance.parentB.me.scopedGene.instance, "Instance error" );
    });


});