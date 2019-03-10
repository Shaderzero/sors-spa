export interface BusinessProcess {
    id?: number;
    code: number;
    name: string;
    children?: BusinessProcess[];
    parent?: BusinessProcess;
    parentId?: number;
}
