import { expect } from 'chai';
import { serialize } from '../src/serialize';

describe("serialize", () => {
    const parent1 = { name: "parent1", childs: [] };
    const child1 = { parent: parent1, name: "child1" };
    const child2 = { parent: parent1, name: "child2" };
    parent1.childs = [child1, child2];

    it("child1", () => {
        expect('{"$id":"1","parent":{"$id":"2","name":"parent1","childs":{"$id":"3","$values":[{"$ref":"1"},{"$id":"4","parent":{"$ref":"2"},"name":"child2"}]}},"name":"child1"}').to.eql(serialize(child1));
    });

    it("child2", () => {
        expect('{"$id":"1","parent":{"$id":"2","name":"parent1","childs":{"$id":"3","$values":[{"$id":"4","parent":{"$ref":"2"},"name":"child1"},{"$ref":"1"}]}},"name":"child2"}').to.eql(serialize(child2));
    });

    it("parent1", () =>{
        expect('{"$id":"1","name":"parent1","childs":{"$id":"2","$values":[{"$id":"3","parent":{"$ref":"1"},"name":"child1"},{"$id":"4","parent":{"$ref":"1"},"name":"child2"}]}}').to.eql(serialize(parent1));
    });

    it("[child1, child2]", () =>{
        expect('{"$id":"1","$values":[{"$id":"2","parent":{"$id":"3","name":"parent1","childs":{"$id":"4","$values":[{"$ref":"2"},{"$id":"5","parent":{"$ref":"3"},"name":"child2"}]}},"name":"child1"},{"$ref":"5"}]}').to.eql(serialize([child1, child2]));
    });

    it("[child1,child2,parent1]", () => {
        expect('{"$id":"1","$values":[{"$id":"2","parent":{"$id":"3","name":"parent1","childs":{"$id":"4","$values":[{"$ref":"2"},{"$id":"5","parent":{"$ref":"3"},"name":"child2"}]}},"name":"child1"},{"$ref":"5"},{"$ref":"3"}]}').to.eql(serialize([child1, child2, parent1]));
    });
});