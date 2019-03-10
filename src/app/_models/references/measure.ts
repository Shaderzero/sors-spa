export class Measure {
    id?: number;
    number?: number;
    description: string;
    expectedResult: string;
    deadLine?: string;
    responsible?: string;
    costs?: string;
    costsSource?: string;
    monitoringStatus?: string;
    monitoringDescription?: string;

    constructor() {
        this.number = 0;
        this.description = '';
        this.expectedResult = '';
        this.deadLine = '';
        this.responsible = '';
        this.costs = '';
        this.costsSource = '';
        this.monitoringStatus = '';
        this.monitoringDescription = '';
    }
}
