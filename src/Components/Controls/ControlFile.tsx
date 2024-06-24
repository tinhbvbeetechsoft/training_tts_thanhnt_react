/**
 * Hướng dẫn sử dụng component
 * => Công dụng: dùng để lựa chọn các file trên máy đưa vào hệ thống
 * => Thuộc tính:
 * labelKey: giá trị label của input
 * initialValue: giá trị mặc định của file
 * id / property : id or tên thuộc tính của input file
 * multiple: có chấp nhận tải nhiều file lên hay không
 * acceptType:Chấp nhận các loại file (.jpg, .png, .pdf,...)
 * disabled: có bị disable không ? true | false
 */
/** @jsxImportSource @emotion/react */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { connect, Options } from 'react-redux';
import { IControlProps } from '../interface/control-prop';
import { Panel, PanelHeaderTemplateOptions } from 'primereact/panel';
import ControlButton from './ControlButton';
import _ from 'lodash';
import { classNames } from 'primereact/utils';
import { DataScroller } from 'primereact/datascroller';
import { IRootState } from 'src/Services/Reducers';
import { Utils } from 'src/Utils/Utils';
import { FileAttachmentModel } from 'src/Services/Models/FileAttachmentModel';
import { BUTTON_TYPE } from 'src/Enum/enums';
import ErrorMessage from '../ErrorMessage';
import { translate } from 'react-jhipster';
// import saveAs from 'save-as';

type IControlFileProps = StateProps & DispatchProps & IControlProps & {
    multiple?: boolean;
    acceptType?: string;
}

const ControlFile = forwardRef((props: IControlFileProps, ref: any) => {
    const [uploadedFiles, setUploadedFiles] = useState<FileAttachmentModel[]>([]);
    const [value, setValue] = useState(props.initialValue || '');
    const {errors, touched, property, labelKey, initialValue, fieldPath, required, baseService, callbackValueChange,  ...restProps} = props;
    //check control có bị lỗi không?
    const isInvalid = useMemo( (): boolean => {
        return Utils.isFormFieldValid(props?.errors, props?.touched, props.fieldPath || props.property)
    }, [props?.errors, props?.touched]);

    useEffect(() => {
        if (props.disabled || !props.callbackValueChange) {
            return;
        }
        setUploadedFiles(value?.upstreamFile || []);
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, value);
    }, [value]);

    useImperativeHandle(ref, () => ({
    }));

    const openDialogSelectFile = () => {

        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        if (props.acceptType) {
            input.setAttribute('accept', props.acceptType);
        }
        if (props.multiple) {
            input.setAttribute('multiple', 'multiple');
        }
        input.onchange = (evt: any) => {
            if (evt.target && evt.target.files && evt.target.files.length > 0) {
                const listFile = Object.values(evt.target.files);
                for (let index = 0; index < listFile.length; index++) {
                    const item = listFile[index] as FileAttachmentModel;
                    item['fileStorageId'] = Utils.generateUniqueId();
                    uploadedFiles.push(item);
                }
                setUploadedFiles(_.cloneDeep(uploadedFiles));
                setValue({
                    ...value,
                    upstreamFile: uploadedFiles
                });
            }
        };
        input.click();
    };

    const disableUpdate = useMemo(() => {
        return props.disabled || (props.multiple ? false : uploadedFiles.length == 1);
    }, [props.multiple, uploadedFiles]);

    const templateHeader = (options: PanelHeaderTemplateOptions) => {
        const className = `${options.className} `;
        const titleClassName = `${options.titleClassName} pl-1`;

        return (
            <div className={className}>
                <span className={titleClassName}>
                    Danh sách file
                </span>
                <ControlButton
                    mode={BUTTON_TYPE.PRIMARY}
                    disabled={disableUpdate}
                    icon="pi pi-upload"
                    tooltip="Chọn file"
                    tooltipOptions={{ position: 'bottom' }}
                    onClick={openDialogSelectFile}
                />
            </div>
        );
    };

    const downloadFile = (file: FileAttachmentModel) => {

    };

    const removeFile = (file: FileAttachmentModel) => {
        const idx = uploadedFiles.findIndex(e => e.fileStorageId == file.fileStorageId);
        if (idx > -1) {
            const deleteIds = value.deleteIds || [];
            if (uploadedFiles[idx] && uploadedFiles[idx].type == 'stored_file') {
                deleteIds.push(uploadedFiles[idx].fileStorageId);
            }
            uploadedFiles.splice(idx, 1);
            setValue(_.cloneDeep({
                ...value,
                deleteIds: deleteIds
            }));
        }
    };

    const itemTemplate = (file: FileAttachmentModel) => {
        return (<div className={classNames({ 'item-attach d-flex': true })}>
            <div className="file-info flex-fill d-flex flex-column">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{Utils.viewFileSize(file.size)}</span>
            </div>
            <div className="file-action">
                { file.type == 'stored_file' &&
                    <ControlButton
                        mode={BUTTON_TYPE.INFO}
                        icon="pi pi-download"
                        className="p-button-rounded p-button-text"
                        tooltip={`Tải xuống ${file.name}`}
                        tooltipOptions={{ position: 'bottom' }}
                        onClick={(file: any) => downloadFile(file)}
                    />
                }
                <ControlButton
                    mode={BUTTON_TYPE.DANGER}
                    icon="pi pi-times-circle"
                    className="p-button-rounded p-button-text"
                    tooltip={`Xóa ${file.name}`}
                    tooltipOptions={{ position: 'bottom' }}
                    onClick={() => removeFile(file)}
                />
            </div>
        </div>);
    };

    return (
        <>
            {props.labelKey ? <label className={`control-label ${props.required ? 'required' : ''}`} htmlFor={props.property}>{translate(props.labelKey)}</label> : ''}
            <div className='form-control-wrap'>
                <Panel headerTemplate={templateHeader} toggleable className={`${isInvalid ? 'p-invalid' : ''}`}>
                    {uploadedFiles?.length > 0 ? <DataScroller value={uploadedFiles} itemTemplate={itemTemplate} rows={5} inline scrollHeight="250px" />
                        : <>
                            <span className="file-control-nodata">Không có dữ liệu</span>
                        </>}
                </Panel>
                <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath}/>
            </div>
        </>
    );
});

ControlFile.displayName = 'ControlFile';

ControlFile.defaultProps = {
};

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
)(ControlFile);
