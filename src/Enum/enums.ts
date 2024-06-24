/* eslint-disable no-unused-vars */
export enum AUTHORITIES {
    ANONYMOUS = 'ANONYMOUS',
    ADMIN = 'ADMIN',
    STAFF = 'STAFF'
};

export enum RESPONSE_TYPE {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    WARNING = 'WARNING'
};

export enum ActionType {
    None,
    Request,
    Error,
    Success
}

export enum BUTTON_TYPE {
    PRIMARY = 'primary',
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    DANGER = 'danger',
    DEFAULT = 'default'
}

export enum BUTTON_SIZE {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
}

export enum CATEGORY_TYPE_CODE {
    LY_DO_CHAM_DUT_DANG = 'LY_DO_CHAM_DUT_DANG',
    LOAI_HINH_TO_CHUC_DANG = 'LOAI_HINH_TO_CHUC_DANG'
}

export enum DOI_TUONG_HUONG {
    BAN_THAN = 1,
    THAN_NHAN = 2,
    CA_HAI = 3,
}