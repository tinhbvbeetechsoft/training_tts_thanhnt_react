import { CONFIG } from 'src/Config/app-config';
import { UsersModel } from 'src/Services/Models/UsersModel';
import { BaseService } from './base.services';
import axios from 'axios';
import { ServiceRespone } from './ServiceResponse';

export class UsersService extends BaseService<UsersModel> {
    constructor() {
        super(CONFIG.SERVICE_CODE.OPTICAL, 'users');
    }
    public async resetPassword(id: number) {
        const url = `${this.baseUrl}/${id}/reset-password`;
        try {
            const resp = await axios.post(url);
            return ServiceRespone.from<any>(resp.data);
        } catch (ex) {
            return ServiceRespone.fromError(ex);
        }
    }
}

export default new UsersService();
