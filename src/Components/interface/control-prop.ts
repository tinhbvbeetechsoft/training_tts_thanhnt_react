import { FormikErrors, FormikTouched, FormikValues } from 'formik';

export interface IControlProps {
    property: string; // tên trường
    labelKey?: string;
    initialValue?: any;
    required?: boolean;
    disabled?: boolean;
    errors?: FormikErrors<FormikValues>;
    touched?: FormikTouched<FormikValues>;
    fieldPath?: string; // field path dùng cho trường hợp form array
    id?: string; // id trường
    className?: string;
    groupCode?: string;
    baseService?: any; // load data source
    callbackValueChange?: (fieldName: string, event: any, value: any) => void; // call back khi thay đổi dữ liệu
}
