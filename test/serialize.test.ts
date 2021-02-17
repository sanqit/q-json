import { expect } from 'chai';
import { serialize } from '../src/serialize';
import { Child, Parent } from './model';

describe("serialize", () => {
    const parent: Parent = { id: "11111111-1111-1111-1111-111111111111", name: "Parent1" };
    const child1: Child = { id: "22222222-2222-2222-2222-222222222222", name: "Child1", parentId: parent.id, parent: parent };
    const child2: Child = { id: "33333333-3333-3333-3333-333333333333", name: "Child2", parentId: parent.id, parent: parent };
    parent.children = [child1, child2];

    it("parent", () =>{
        expect(`{
    "$id": "1",
    "id": "11111111-1111-1111-1111-111111111111",
    "name": "Parent1",
    "children": {
        "$id": "2",
        "$values": [
            {
                "$id": "3",
                "id": "22222222-2222-2222-2222-222222222222",
                "name": "Child1",
                "parentId": "11111111-1111-1111-1111-111111111111",
                "parent": {
                    "$ref": "1"
                }
            },
            {
                "$id": "4",
                "id": "33333333-3333-3333-3333-333333333333",
                "name": "Child2",
                "parentId": "11111111-1111-1111-1111-111111111111",
                "parent": {
                    "$ref": "1"
                }
            }
        ]
    }
}`).to.eql(serialize(parent, {space: 4}));
    })

    it("children", () => {
        expect(`{
    "$id": "1",
    "$values": [
        {
            "$id": "2",
            "id": "22222222-2222-2222-2222-222222222222",
            "name": "Child1",
            "parentId": "11111111-1111-1111-1111-111111111111",
            "parent": {
                "$id": "3",
                "id": "11111111-1111-1111-1111-111111111111",
                "name": "Parent1",
                "children": {
                    "$id": "4",
                    "$values": [
                        {
                            "$ref": "2"
                        },
                        {
                            "$id": "5",
                            "id": "33333333-3333-3333-3333-333333333333",
                            "name": "Child2",
                            "parentId": "11111111-1111-1111-1111-111111111111",
                            "parent": {
                                "$ref": "3"
                            }
                        }
                    ]
                }
            }
        },
        {
            "$ref": "5"
        }
    ]
}`).to.eql(serialize(parent.children, {space: 4}));
    });

    it("custom", () => {
        const c = {a:1, b:[]}
        c.b.push(c);
        expect(`{"$id":"1","a":1,"b":{"$id":"2","$values":[{"$ref":"1"}]}}`).to.eql(serialize(c));
    });
});