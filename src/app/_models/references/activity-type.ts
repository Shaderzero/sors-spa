export interface ActivityType {
    id?: number;
    code: number;
    name: string;
    children?: ActivityType[];
    parent?: ActivityType;
    parentId?: number;
}
