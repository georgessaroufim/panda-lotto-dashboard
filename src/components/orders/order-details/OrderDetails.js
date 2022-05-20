import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { postGetOrderById, postUpSertOrder, postGetClinicById, postGetDoctorById, postGetServiceById } from '../../../core/api/Api';
import { Box, Container, Grid, TextareaAutosize, Typography, Button, Card, CardContent, CardHeader, Divider, TextField } from '@mui/material';
import I18nManager from '../../../core/I18nManager/I18nManager';
import ButtonWithLoading from '../../_components/button-with-loading/ButtonWithLoading';
import { checkFormErrors, getNumberWithFloat } from '../../../core/common-service/CommonService';
import CreatePatientDialog from './create-patient-dialog/CreatePatientDialog';
import { useTheme } from '@mui/material/styles';
import { inputValidation } from '../../../core/constants/constants';
import dayjs from 'dayjs'
import LookupSelectView from '../../_components/input-multi-select/lookup-select-view/LookupSelectView';

const OrderDetails = () => {
    const theme = useTheme()
    let navigate = useNavigate()
    let { id } = useParams()

    const mounted = useRef(true)
    const createPatientDialogRef = useRef(null)
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formErrors, setFormErrors] = useState({
        startDate: true,
        endDate: true
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'startDate':
                setFormErrors({ ...formErrors, startDate: value?.length > 0 })
                break;
            case 'endDate':
                setFormErrors({ ...formErrors, endDate: value?.length > 0 })
                break;
            default:
                break;
        }
        setData({ ...data, [name]: value });
    };

    const getOrderById = () => {
        postGetOrderById({ id }).then(res => {
            if (mounted.current && res?.data?.success) {
                var response = res.data.success
                if (isNaN(id)) {
                    response.startDate = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss')
                } else {
                    response.startDate = response?.timeslot?.startDate
                    response.endDate = response?.timeslot?.endDate
                }
                setData(response)
            }
        }).catch(e => { })
    }

    const onInputSelectChange = (foreignKey, multiple, d) => (e, item, reason) => {
        e.preventDefault()
        if (foreignKey == 'offer_id') {
            setLoading(true)
            // get clinics by offer id
            postGetClinicById({ offer_id: item?.id }).then(res => {
                setLoading(false)
                if (mounted.current && res?.data?.success) {
                    const response = res.data.success
                    var d = { ...data }
                    if (response?.offer?.totalPrice) {
                        d.price = getNumberWithFloat(response?.offer?.totalPrice, 3)
                    }
                    var lookups = d.lookups
                    if (response?.clinic_id) {
                        lookups.clinics = response?.clinics
                        d.clinic_id = response?.clinic_id
                    }
                    if (response?.doctor_id) {
                        lookups.doctors = response?.doctors
                        d.doctor_id = response?.doctor_id
                    }
                    if (response?.service_id) {
                        lookups.services = response?.services
                        d.service_id = response?.service_id
                    }
                    setData({ ...d, offer_id: item?.id, lookups: { ...d.lookups } })
                }
            }).catch(e => setLoading(false))
        } else if (foreignKey == 'clinic_id') {
            setLoading(true)
            // get doctors by clinic id
            postGetDoctorById({ clinic_id: item?.id }).then(res => {
                setLoading(false)
                if (mounted.current && res?.data?.success) {
                    const response = res.data.success
                    var d = { ...data }
                    var lookups = d.lookups
                    if (response?.doctor_id) {
                        lookups.doctors = response?.doctors
                        d.doctor_id = response?.doctor_id
                    }
                    if (response?.service_id) {
                        lookups.services = response?.services
                        d.service_id = response?.service_id
                    }
                    setData({ ...d, clinic_id: item?.id, lookups: { ...d.lookups } })
                }
            }).catch(e => setLoading(false))
        } else if (foreignKey == 'doctor_id') {
            setLoading(true)
            // get doctors by clinic id
            postGetServiceById({ doctor_id: item?.id }).then(res => {
                setLoading(false)
                if (mounted.current && res?.data?.success) {
                    const response = res.data.success
                    var d = { ...data }
                    var lookups = d.lookups
                    if (response?.service_id) {
                        lookups.services = response?.services
                        d.service_id = response?.service_id
                    }
                    setData({ ...d, doctor_id: item?.id, lookups: { ...d.lookups } })
                }
            }).catch(e => setLoading(false))
        } else {
            setData({ ...data, [foreignKey]: item?.id });
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (checkFormErrors(formErrors)) {
            setLoading(true)
            postUpSertOrder(data).then(res => {
                setLoading(false)
                const response = res?.data?.success
                if (response) {
                    if (isNaN(id)) {
                        navigate('/order-details/' + response?.id)
                    }
                    setSuccess(true)
                } else {
                    setSuccess(false)
                }
            }).catch(e => setLoading(false))
        }
    }

    const onRegisterSuccess = (response) => {
        createPatientDialogRef.current.call_closeDialog();
        var d = { ...data }
        d.patient_id = response?.id
        var lookups = d.lookups
        var patients = lookups.patients
        patients = patients.push(response)
        setData(d);
    }

    useEffect(() => {
        mounted.current = true
        getOrderById();
        return () => {
            mounted.current = false
        }
    }, [id])

    return (
        <Box component="main" sx={{ flexGrow: 1, }}>
            {(data?.id || isNaN(id)) && <Container maxWidth="lg">
                <Typography sx={{ mb: 3 }} variant="h4">
                    {I18nManager.isRTL() ? "تفاصيل الطلب" : "Order Details"}
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card component="form" noValidate onSubmit={onSubmit}>
                            <CardHeader
                                subheader={I18nManager.isRTL() ? "يمكن تعديل المعلومات" : "The information can be edited"}
                                title={I18nManager.isRTL() ? "الطلب" : "Order"}
                            />
                            <Divider />
                            <CardContent>
                                <Grid container spacing={3}>
                                    {data?.lookups && <>
                                        {isNaN(id) &&
                                            <Grid item xs={12}>
                                                <CreatePatientDialog ref={createPatientDialogRef} onRegisterSuccess={onRegisterSuccess} />
                                                <Button onClick={() => createPatientDialogRef.current.call_openDialog()} variant="contained">
                                                    {I18nManager.isRTL() ? "إنشاء حساب للمريض" : "Create Patient"}
                                                </Button>
                                            </Grid>
                                        }
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='receptionists' foreignKey='receptionist_id' l={I18nManager.isRTL() ? "موظفو الاستقبال" : "Receptionists"} required={true} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='patients' foreignKey='patient_id' l={I18nManager.isRTL() ? "المرضى" : "Patients"} required={true} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='offers' foreignKey='offer_id' l={I18nManager.isRTL() ? "العروض" : "Offers"} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='clinics' foreignKey='clinic_id' l={I18nManager.isRTL() ? "العيادات" : "Clinics"} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='doctors' foreignKey='doctor_id' l={I18nManager.isRTL() ? "الأطباء" : "Doctors"} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='services' foreignKey='service_id' l={I18nManager.isRTL() ? "الخدمات" : "Services"} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='coupons' foreignKey='coupon_id' l={I18nManager.isRTL() ? "القسائم" : "Coupons"} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='order_statuses' foreignKey='order_status_id' l={I18nManager.isRTL() ? "حالة الطلب" : "Order Statuses"} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='order_types' foreignKey='order_type_id' l={I18nManager.isRTL() ? "نوع الطلب" : "Order Types"} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='order_sources' foreignKey='order_source_id' l={I18nManager.isRTL() ? "مصدر الطلب" : "Order Sources"} />
                                    </>}
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label={I18nManager.isRTL() ? "السعر" : "Price" + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")"}
                                            name="price"
                                            onChange={handleChange}
                                            value={data?.price || ""}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            error={!formErrors?.startDate && data?.startDate !== ''}
                                            helperText={!formErrors?.startDate && data?.startDate !== '' ? inputValidation?.dateTime?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                            fullWidth
                                            label={I18nManager.isRTL() ? "تاريخ بدء المهلة الزمنية" : "Timeslot Start Date"}
                                            type="datetime-local"
                                            name="startDate"
                                            value={data?.startDate ? dayjs(data?.startDate).format('YYYY-MM-DDTHH:mm:ss') : ""}
                                            onChange={handleChange}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                    {!isNaN(id) &&
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                error={!formErrors?.endDate && data?.endDate !== ''}
                                                helperText={!formErrors?.endDate && data?.endDate !== '' ? inputValidation?.dateTime?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                                fullWidth
                                                label={I18nManager.isRTL() ? "تاريخ انتهاء المهلة الزمنية" : "Timeslot End Date"}
                                                type="datetime-local"
                                                name="endDate"
                                                value={data?.endDate ? dayjs(data?.endDate).format('YYYY-MM-DDTHH:mm:ss') : ""}
                                                onChange={handleChange}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                    }
                                    <Grid item md={6} xs={12}>
                                        <TextareaAutosize
                                            style={{
                                                backgroundColor: 'transparent', width: '100%',
                                                color: theme.palette.text.primary
                                            }}
                                            placeholder={I18nManager.isRTL() ? "ملاحظة" : "Note"}
                                            minRows={4}
                                            name="note"
                                            onChange={handleChange}
                                            value={data?.note || ""}
                                        />
                                    </Grid>
                                    <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='isActiveLookup' foreignKey='isActive' l={I18nManager.isRTL() ? "مفعل" : "Is Active"} disabled={isNaN(id)} />
                                </Grid>
                            </CardContent>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                                <ButtonWithLoading loading={loading} success={success} text={I18nManager.isRTL() ? "حفظ" : "Save"} />
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Container>}
        </Box >
    )
}

export default OrderDetails