export interface Factor {
    id?: number;
    code: number;
    name: string;
    children?: Factor[];
    parent?: Factor;
    parentId?: number;

}
