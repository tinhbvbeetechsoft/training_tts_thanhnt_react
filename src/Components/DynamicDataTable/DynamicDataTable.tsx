/**
 * Hướng dẫn sử dụng component
 * => Công dụng: tạo ra bảng table
 * => Thuộc tính:
 * tableid: tên giá trị của bảng
 * columns : list các trường tên để render lên bảng
 * dataTable: list giá trị để render lên bảng
 * 1 số thuộc tình khác tham khảo: https://www.primefaces.org/primereact/datatable/
 */
import { connect, Options } from 'react-redux';
import { IRootState } from 'src/Services/Reducers';
import { translate } from 'react-jhipster';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { DataTable, DataTableProps } from 'primereact/datatable';
import { DataTableResults } from 'src/Services/Models/DataTableResults';
import { Column, ColumnProps } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import ControlButton from 'src/Components/Controls/ControlButton';
import { Checkbox } from 'primereact/checkbox';
import { BUTTON_TYPE } from 'src/Enum/enums';
import LocalStoragePublic from 'src/Utils/LocalStoragePublic'
import { classNames } from 'primereact/utils';
type IDynamicDataTableProps = StateProps & DispatchProps & DataTableProps & {
    tableid: string
    columns: ColumnProps[]
    dataTable?: DataTableResults<any>;
}

const DynamicDataTable = forwardRef((props: IDynamicDataTableProps, ref: any) => {
    const dynamicTableRef = useRef<any>(null);
    const [hasScroll, setHasScroll] = useState(false);
    const {columns, dataTable, ...dataTableProps} = props;
    // Cột ẩn trong localstorage
    const storeHideColumns = LocalStoragePublic.get(LocalStoragePublic.MENU_TABLE, props.tableid) || {};
    // danh sách cột ẩn
    const [hideColumns, setHideColumns] = useState(storeHideColumns);
    // biến tạm
    const [tempHideColumns, setTempHideColumns] = useState(storeHideColumns);
    // overlay
    const op = useRef<OverlayPanel>(null);
    // build danh sách các columns của table
    const columnComponents = useMemo(() => columns.map((columnProps, index) => {
        const {field} = columnProps;
        if (field && hideColumns[field]) {
            return null;
        }
        return <Column key={index} {...columnProps} />;
    }), [hideColumns, dataTable]);

    /**
     *  thay đổi giá trị checkbox
     * @param field
     */
    const changeHidden = (field: string) => {
        const isHide = tempHideColumns[field];
        if (isHide) {
            delete tempHideColumns[field];
        } else {
            tempHideColumns[field] = true;
        }
        setTempHideColumns({...tempHideColumns});
    }
    /**
     * Lưu giá trị
     */
    const handleConfirm = () => {
        const value = {...tempHideColumns};
        setHideColumns(value);
        LocalStoragePublic.set(LocalStoragePublic.MENU_TABLE, props.tableid, value);
        op.current?.hide();
    }
    const headerColumn = () => {
        return (
            <>
                <span className='datatable-options' onClick={(e) => op.current?.toggle(e)} aria-haspopup>
                    <i className='pi pi-ellipsis-h'></i>
                </span>
                <OverlayPanel ref={op}  id="overlay_panel" breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '550px'}}>
                    <div className="overlaypanel-content-header mb-3">Thêm bớt thông tin</div>
                    <div className="overlaypanel-content-body">
                        { props.columns.map((column :any, key) => {
                            if(column.field) {
                                return <div key={key} className="d-flex w-50 align-items-center mb-2">
                                        <Checkbox inputId={column.field} value={column.field} name={column.header} onChange={() => changeHidden(column.field)} checked={!tempHideColumns[column.field]} />
                                        <label htmlFor={column.field}>{column.header}</label>
                                    </div>
                            }}
                        )}
                    </div>
                    <hr />
                    <div className="overlaypanel-content-footer d-flex justify-content-end">
                        <ControlButton
                            type="button"
                            mode={BUTTON_TYPE.DEFAULT}
                            className="no-border"
                            size="small"
                            label="Đặt lại"
                            property="reset"
                            onClick={() => setTempHideColumns({})}
                            icon="pi pi-undo"
                        />
                        <ControlButton
                            type="button"
                            mode={BUTTON_TYPE.PRIMARY}
                            size="small"
                            onClick={handleConfirm}
                            label="Xác nhận"
                            property="confirm"
                        />
                    </div>
                </OverlayPanel>
            </>
        );
    }

    useImperativeHandle(ref, () => ({
        resetTable() {
            dynamicTableRef.current && dynamicTableRef.current.reset();
        }
    }))

    useEffect(() => {
        const _element = document.querySelector('.p-datatable-scrollable .p-datatable-wrapper');
        const _elementToogle = _element?.querySelector('.togged-info');
        const onScroll = (event: Event) => {
            if (!_elementToogle) return;
            const clientWidth = _element?.clientWidth || 0;
            const scrollWidth = _element?.scrollWidth || 0;
            const scrollLeft = _element?.scrollLeft || 0;
            if ((scrollWidth - clientWidth - 80) <= scrollLeft) {
                !_elementToogle.classList.contains('none-blur') && _elementToogle.classList.add('none-blur');
            } else {
                _elementToogle.classList.remove('none-blur');
            }
        }
        if (_element) {
            setHasScroll(_element?.scrollWidth > _element?.clientWidth);
            _element.addEventListener("scroll", onScroll, false);
            return () => {
                _element.removeEventListener("scroll", onScroll, false);
            }
        }
    }, []);

    return(
        <div className="dynamic-datatable">
            <DataTable lazy
                ref={dynamicTableRef}
                stripedRows
                scrollable
                removableSort
                scrollHeight="none"
                scrollDirection='both'
                value={dataTable?.data}
                totalRecords={dataTable?.recordsTotal || 1}
                first={dataTable?.first || 0}
                rows={dataTable?.draw || 10}
                responsiveLayout="scroll"
                paginator={dataTable?.recordsTotal ? true: false}
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                emptyMessage={translate('common.dataNotFound')}
                {...dataTableProps}
            >
                {...columnComponents}
                <Column header={headerColumn} className={classNames('mxw-2 justify-content-center togged-info', { 'none-blur': !hasScroll })} alignFrozen="right" frozen={true}></Column>
            </DataTable>
        </div>
    );
});

const mapStateToProps = ({ }: IRootState) => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps;
const options = { forwardRef: true };
export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    options as Options
)(DynamicDataTable);

