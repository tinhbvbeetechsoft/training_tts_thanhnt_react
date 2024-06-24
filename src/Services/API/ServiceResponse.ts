
export class ServiceRespone<T> {
    private type?: string;
    private code?: string;
    private message?: string;
    private data?: T;
    constructor() {
    }
    static from<S>(res: any): ServiceRespone<S> {
        const serviceRespone = new ServiceRespone<S>();
        serviceRespone.type = res.type;
        serviceRespone.code = res.code;
        serviceRespone.message = res.message;
        serviceRespone.data = res.data;
        return serviceRespone;
    }
    static fromError(res: any) {
        const serviceRespone = new ServiceRespone<any>();
        serviceRespone.type = 'ERROR';
        serviceRespone.code = 'error_exception';
        serviceRespone.message = res.message;
        return serviceRespone;
    }
    isSuccess() {
        return this.type == 'SUCCESS';
    }
    hasData() {
        return this.data != null;
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
    getData(): T {
        return this.data as T;
    }
}