export interface UsersModel {
    id?: number;
    organizationId?: number;
    fullName?: string;
    userName?: string;
    email?: string;
    organizationName?: string;
    memberType?: number;
    expiredDate?: Date;
}
