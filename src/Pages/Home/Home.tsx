import { Panel } from 'primereact/panel';
import { useFormik } from 'formik';
import _ from 'lodash';
import { connect } from 'react-redux';
import ControlText from 'src/Components/Controls/ControlText';
import { IRootState } from 'src/Services/Reducers';
import * as yup from 'yup';
import ControlNumber from 'src/Components/Controls/ControlNumber';
import ControlDate from 'src/Components/Controls/ControlDate';
import ControlRadio from 'src/Components/Controls/ControlRadio';
import ControlSwitch from 'src/Components/Controls/ControlSwitch';
import ControlButton from 'src/Components/Controls/ControlButton';
import ControlTextarea from 'src/Components/Controls/ControlTextarea';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import ControlDialog from 'src/Components/Controls/ControlDialog';
type IHomeProps = StateProps & DispatchProps & {
}

const Home = (props: IHomeProps) => {
    let { partyOrganizationId }: any = useParams();
    const formRef = useRef<any>(null);
    const {values, errors, touched, setValues, setFieldValue, handleSubmit,} = useFormik({
        initialValues: {
            controlText: '',
            code: '',
            orgId: 148842
        },
        onSubmit: (data: any) => {
            console.log(">>> data: ", data);
        },
        validationSchema: yup.object().shape({
            controlText: yup.string().required(),
            controlNumber: yup.number().required(),
            controlDropdown: yup.mixed().required(),
            controlMultiSelect: yup.mixed().required(),
            controlDate: yup.date().required(),
            controlDataPicker: yup.mixed().required(),
            partyOrgSelector: yup.mixed().required(),
            controlOrg: yup.mixed().required(),
            controlTextarea: yup.mixed().required(),
            controlRadio: yup.mixed().required(),
            controlSwitch: yup.mixed().required(),
            orgId: yup.mixed().required(),
        }),
    });

    useEffect(() => {
        console.log(">>>> values: ", values);
    }, [values])

    const onChange = async (fieldName: string, evt: any, value: any) => {
        await setFieldValue(fieldName, value ?? null);
    };
    return (
        <>
            <Panel header="Form control">
                <form id="partyOrgSearch" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-3 col-md-3 col-sm-12">
                            <ControlText
                                labelKey='id'
                                property='controlText'
                                errors={errors}
                                touched={touched}
                                required={true}
                                initialValue={_.get(values, 'controlText')}
                                callbackValueChange={onChange}
                            />
                        </div>
                        <div className="col-3 col-md-3 col-sm-12">
                            <ControlNumber
                                labelKey='id'
                                property='controlNumber'
                                errors={errors}
                                touched={touched}
                                required={true}
                                initialValue={_.get(values, 'controlNumber')}
                                callbackValueChange={onChange}
                            />
                        </div>
                        
                    </div>
                    <div className="row">
                        <div className="col-3 col-md-3 col-sm-12">
                            <ControlDate
                                labelKey='dateFrom'
                                property='controlDate'
                                required={true}
                                errors={errors}
                                dateFormat='dd/mm/yy'
                                showTime={true}
                                className='aaaa'
                                touched={touched}
                                initialValue={_.get(values, 'controlDate')}
                                callbackValueChange={onChange}
                            />
                        </div>
                            
                    </div>
                    <div className="row">
                        <div className="col-3 col-md-3 col-sm-12">
                            <ControlTextarea
                                labelKey='id'
                                property='controlTextarea'
                                errors={errors}
                                touched={touched}
                                required={true}
                                initialValue={_.get(values, 'controlTextarea')}
                                callbackValueChange={onChange}
                            />
                        </div>
                        <div className="col-3 col-md-3 col-sm-12">
                            <ControlRadio
                                labelKey='radio'
                                property='controlRadio'
                                errors={errors}
                                touched={touched}
                                optionlabel="name"
                                optionvalue="id"
                                datasource={[
                                    {
                                        id: 1,
                                        name: "Male"
                                    },
                                    {
                                        id: 2,
                                        name: "Female"
                                    },
                                    {
                                        id: 3,
                                        name: "Other"
                                    }
                                ]}
                                initialValue={_.get(values, 'controlRadio')}
                                callbackValueChange={onChange}
                            />
                        </div>
                        <div className="col-3 col-md-3 col-sm-12">
                            <ControlSwitch
                                labelKey='Switch'
                                property='controlSwitch'
                                errors={errors}
                                touched={touched}
                                initialValue={_.get(values, 'controlSwitch')}
                                callbackValueChange={onChange}
                            />
                        </div>
                        
                    </div>
                    <div className="row btn-group" style={{ padding: '1.5rem 0' }}>
                        <div className="col-12 col-md-12 col-sm-12">
                            <ControlButton
                                type="submit"
                                mode="primary"
                                size="small"
                                label="Tìm kiếm nâng cao"
                                property="search"
                                icon="pi pi-search"
                                autoFocus
                            />
                            <ControlButton
                                type="submit"
                                mode="warning"
                                size="small"
                                label="Tìm kiếm nâng cao"
                                property="search"
                                icon="pi pi-search"
                            />
                            <ControlButton
                                type="submit"
                                mode="danger"
                                size="small"
                                label="Tìm kiếm nâng cao"
                                property="search"
                                icon="pi pi-search"
                            />
                            <ControlButton
                                type="submit"
                                mode="info"
                                size="small"
                                label="Tìm kiếm nâng cao"
                                property="search"
                                icon="pi pi-search"
                            />
                            <ControlButton
                                type="submit"
                                mode="success"
                                size="small"
                                label="Tìm kiếm nâng cao"
                                property="search"
                                icon="pi pi-search"
                            />
                        </div>
                        <div className="col-12 col-md-12 col-sm-12" style={{ marginTop: '12px' }}>
                            <ControlButton
                                type="submit"
                                mode="primary"
                                size="small"
                                label="Tìm kiếm nâng cao"
                                property="search"
                                icon="pi pi-search"
                                onClick={() => { formRef.current && formRef.current.show() }}
                                outline={true}
                            />
                            <ControlButton
                                type="submit"
                                mode="warning"
                                size="small"
                                label="Tìm kiếm nâng cao"
                                property="search"
                                icon="pi pi-search"
                                outline={true}
                            />
                            <ControlButton
                                type="submit"
                                mode="danger"
                                size="small"
                                label="Tìm kiếm nâng cao"
                                property="search"
                                icon="pi pi-search"
                                outline={true}
                            />
                            <ControlButton
                                type="submit"
                                mode="info"
                                size="small"
                                label="Tìm kiếm nâng cao"
                                property="search"
                                icon="pi pi-search"
                                outline={true}
                            />
                            <ControlButton
                                type="submit"
                                mode="success"
                                size="small"
                                label="Tìm kiếm nâng cao"
                                property="search"
                                icon="pi pi-search"
                                outline={true}
                            />
                        </div>
                    </div>
                </form>
            </Panel>
            <ControlDialog ref={formRef} onHide={ () => {} }>
                <form>
                    <div className="row">
                        <div className="col-6 col-md-6 col-sm-12">
                            <ControlText
                                labelKey='partyOrg.code'
                                property='code'
                                errors={errors}
                                touched={touched}
                                required={true}
                                initialValue={_.get(values, 'code')}
                                callbackValueChange={onChange}
                            />
                        </div>
                        <div className="col-6 col-md-6 col-sm-12">
                            <ControlText
                                labelKey='partyOrg.organizationId'
                                property='name'
                                errors={errors}
                                touched={touched}
                                required={true}
                                initialValue={_.get(values, 'name')}
                                callbackValueChange={onChange}
                            />
                        </div>
                    </div>
                </form>
            </ControlDialog>
        </>
    );
};


const mapStateToProps = ({ }: IRootState) => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
