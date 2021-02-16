import { deserialize } from "./src/deserialize";

debugger;
const obj = deserialize('{"$id":"1","parent":{"$id":"2","name":"parent1","childs":{"$id":"3","$values":[{"$ref":"1"},{"$id":"4","parent":{"$ref":"2"},"name":"child2"}]}},"name":"child1"}')
debugger;