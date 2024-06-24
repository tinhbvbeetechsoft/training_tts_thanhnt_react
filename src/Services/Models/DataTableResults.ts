export class DataTableResults<T> {
    type?: string;
    code?: string;
    message?: string;

    draw: number = 10;
    first: number = 0;
    recordsFiltered: number = 0;
    recordsTotal: number = 0;

    data?: T[];

    constructor() {
    }
    static fromError<E>(ex: any): DataTableResults<E> {
        const instance = new DataTableResults<E>();
        instance.type = 'ERROR';
        return instance;
    }
    isSuccess(): boolean {
        return this.type == 'SUCCESS';
    }
    hasData(): boolean {
        return !!this.data;
    }
    getType() {
        return this.type;
    }
    getCode() {
        return this.code;
    }
    getMessage() {
        return this.message;
    }
    getData() {
        return this.data;
    }
}