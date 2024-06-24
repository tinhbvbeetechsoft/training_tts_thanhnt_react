import { ColumnProps } from "primereact/column";
import { translate } from "react-jhipster"
import { ImpossibleOptions } from "src/Constants/constants";
import { Utils } from "src/Utils/Utils";
import React from "react";

export class DynamicDataTableUtils {
    static renderRowIndex = (frozen: boolean) => {
        return {header: translate('common.rowNum'), className: 'size-1 mxw-1 text-center required-show', frozen: frozen, body: (rowData: any, x: any) => {
            return x.rowIndex * 1 + 1;
        }}
    };
    static dateFormat = (columnProps: ColumnProps): ColumnProps => {
        return {...columnProps, align: 'center', body: (rowData: any) => Utils.convertDateToString(columnProps?.field ? rowData[columnProps?.field] : null)};
    };
    static statusFormat = (datasource: ImpossibleOptions[], columnProps: ColumnProps): ColumnProps => {
        if (!datasource) {
            return {...columnProps, align: 'left', body: (rowData: any) => columnProps?.field ? rowData[columnProps?.field] : null};
        }
        return {...columnProps, className: 'text-left', body: (rowData: any) => {
            const _mapItem = datasource.find(item => item?.id == rowData[columnProps?.field || '']);
            return _mapItem?.name ? React.createElement('span', { className: `${_mapItem.className || ''}`}, _mapItem.name) : null
        }, align: 'left'};
    };
}