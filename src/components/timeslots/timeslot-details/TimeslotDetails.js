import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { postGetTimeslotById, postUpSertTimeslot } from '../../../core/api/Api';
import { Box, Container, Grid, ToggleButton, ToggleButtonGroup, Typography, Card, CardContent, CardHeader, Divider, TextField } from '@mui/material';
import I18nManager from '../../../core/I18nManager/I18nManager';
import ButtonWithLoading from '../../_components/button-with-loading/ButtonWithLoading';
import { daysOfTheWeek, inputValidation } from '../../../core/constants/constants';
import { checkFormErrors } from '../../../core/common-service/CommonService';
import dayjs from 'dayjs'
import LookupSelectView from '../../_components/input-multi-select/lookup-select-view/LookupSelectView';

const TimeslotDetails = () => {
    let { id } = useParams()
    let navigate = useNavigate()

    const mounted = useRef(true)
    const [data, setData] = useState({});
    const [selectedDays, setSelectedDays] = useState([]);
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formErrors, setFormErrors] = useState({
        startDate: true,
        endDate: true,
    })

    const handleDaysOfTheWeek = (event, days) => {
        if (days.length) {
            setSelectedDays(days);
        }
    };

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

    const getTimeslotById = () => {
        postGetTimeslotById({ id }).then(res => {
            if (mounted.current && res?.data?.success) {
                var data = res.data.success
                if (!data?.minInterval) {
                    data.minInterval = 0
                }
                if (!data?.hrInterval) {
                    data.hrInterval = 0
                }
                setData(data)
            }
        }).catch(e => { })
    }

    const onInputSelectChange = (foreignKey, multiple, d) => (e, item, reason) => {
        e.preventDefault()
        if (multiple) {
            var val = item.map(a => a.id)
            if (val?.[0] == 0) {
                val = data?.lookups?.[d].map(a => a.id)
            }
            setData({ ...data, [foreignKey]: val });
        } else {
            setData({ ...data, [foreignKey]: item?.id });
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (checkFormErrors(formErrors)) {
            data.selectedDays = selectedDays
            setLoading(true)
            postUpSertTimeslot(data).then(res => {
                setLoading(false)
                const response = res?.data?.success
                if (response) {
                    navigate('/timeslots')
                    setSuccess(true)
                } else {
                    setSuccess(false)
                }
            }).catch(e => setLoading(false))
        }
    }

    useEffect(() => {
        mounted.current = true
        getTimeslotById();
        return () => {
            mounted.current = false
        }
    }, [id])

    return (
        <Box component="main" sx={{ flexGrow: 1, }}>
            {(data?.id || isNaN(id)) && <Container maxWidth="lg">
                <Typography sx={{ mb: 3 }} variant="h4">
                    {I18nManager.isRTL() ? "تفاصيل-الموعد" : "Timeslot Details"}
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card component="form" noValidate onSubmit={onSubmit}>
                            <CardHeader
                                subheader={I18nManager.isRTL() ? "يمكن تعديل المعلومات" : "The information can be edited"}
                                title={I18nManager.isRTL() ? "التفاصيل" : "Details"}
                            />
                            <Divider />
                            <CardContent>
                                <Grid container spacing={3}>
                                    {isNaN(id) && <>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                label={I18nManager.isRTL() ? "فاصل الساعات" : "Hour Interval"}
                                                type="number"
                                                required
                                                name="hrInterval"
                                                onChange={handleChange}
                                                value={data?.hrInterval || 0}
                                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                required
                                                label={I18nManager.isRTL() ? "فاصل الدقائق" : "Minute Interval"}
                                                type="number"
                                                name="minInterval"
                                                onChange={handleChange}
                                                value={data?.minInterval || 0}
                                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                            />
                                        </Grid>
                                    </>}
                                    {data?.lookups && <>
                                        {/* Added isNan(id) condition because on create => multiple is true and on edit multiple is false */}
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='complex_clinics' foreignKey={'complex_clinic_id' + (isNaN(id) ? 's' : '')} l={I18nManager.isRTL() ? "مجمع عيادات" : "Complex Clinics"} multiple={isNaN(id)} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='clinics' foreignKey={'clinic_id' + (isNaN(id) ? 's' : '')} l={I18nManager.isRTL() ? "عيادات" : "Clinics"} multiple={isNaN(id)} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='doctors' foreignKey={'doctor_id' + (isNaN(id) ? 's' : '')} l={I18nManager.isRTL() ? "الأطباء" : "Doctors"} multiple={isNaN(id)} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='services' foreignKey={'service_id' + (isNaN(id) ? 's' : '')} l={I18nManager.isRTL() ? "خدمات" : "Services"} multiple={isNaN(id)} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='offers' foreignKey={'offer_id' + (isNaN(id) ? 's' : '')} l={I18nManager.isRTL() ? "العروض" : "Offers"} multiple={isNaN(id)} />
                                    </>}
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            disabled
                                            fullWidth
                                            label={I18nManager.isRTL() ? "محجوز" : "Is Booked"}
                                            name="isBooked"
                                            onChange={handleChange}
                                            value={Boolean(data?.isBooked)}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ToggleButtonGroup
                                            value={selectedDays}
                                            onChange={handleDaysOfTheWeek}>
                                            {daysOfTheWeek.map((item, index) => (
                                                <ToggleButton key={index} value={index} aria-label={item.title}>
                                                    {item.title}
                                                </ToggleButton>
                                            ))}
                                        </ToggleButtonGroup>
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            error={!formErrors?.startDate && data?.startDate !== ''}
                                            helperText={!formErrors?.startDate && data?.startDate !== '' ? inputValidation?.dateTime?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                            fullWidth
                                            required
                                            label={I18nManager.isRTL() ? "تاريخ البدء" : "Start Date"}
                                            type="datetime-local"
                                            name="startDate"
                                            value={data?.startDate ? dayjs(data?.startDate).format('YYYY-MM-DDTHH:mm:ss') : ""}
                                            onChange={handleChange}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            error={!formErrors?.endDate && data?.endDate !== ''}
                                            helperText={!formErrors?.endDate && data?.endDate !== '' ? inputValidation?.dateTime?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                            fullWidth
                                            required
                                            label={I18nManager.isRTL() ? "تاريخ الانتهاء" : "End Date"}
                                            type="datetime-local"
                                            name="endDate"
                                            value={data?.endDate ? dayjs(data?.endDate).format('YYYY-MM-DDTHH:mm:ss') : ""}
                                            onChange={handleChange}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
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

export default TimeslotDetails