import { expect } from 'chai';
import {deserialize} from '../src/deserialize';
import {serialize} from '../src/serialize';
import { Parent } from './model';

describe("deserialize", () => {
    it("parent", () => {
        const json = `{"$id":"1","id":"11111111-1111-1111-1111-111111111111","name":"Parent1","children":{"$id":"2","$values":[{"$id":"3","id":"22222222-2222-2222-2222-222222222222","name":"Child1","parentId":"11111111-1111-1111-1111-111111111111","parent":{"$ref":"1"}},{"$id":"4","id":"33333333-3333-3333-3333-333333333333","name":"Child2","parentId":"11111111-1111-1111-1111-111111111111","parent":{"$ref":"1"}}]}}`;
        const obj = deserialize<Parent>(json)
        expect(json).to.eql(serialize(obj));
    });

    it("custom", () => {
        const json = `{"$id":"1","a":1,"b":{"$id":"2","$values":[{"$ref":"1"}]}}`;
        const obj = deserialize<any>(json);
        expect(json).to.eql(serialize(obj));
    });
})