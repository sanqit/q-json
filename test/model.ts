interface Child {
    id: string;
    name: string;
    parentId?: string;
    parent?: Parent;
}
interface Parent {
    id: string;
    name: string;
    children?: Child[];
}

export { Child, Parent };