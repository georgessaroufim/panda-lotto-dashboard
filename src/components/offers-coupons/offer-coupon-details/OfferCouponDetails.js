import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MEDIA_URL, postGetClinicById, postGetComplexClinicById, postGetCouponById, postGetOfferById, postUpSertCoupon, postUpSertOffer, } from '../../../core/api/Api';
import { Box, Container, CardMedia, CardActionArea, CardActions, Grid, Avatar, Typography, Button, Card, CardContent, CardHeader, Divider, TextField } from '@mui/material';
import I18nManager from '../../../core/I18nManager/I18nManager';
import ButtonWithLoading from '../../_components/button-with-loading/ButtonWithLoading';
import { inputValidation } from '../../../core/constants/constants';
import { checkFormErrors } from '../../../core/common-service/CommonService';
import dayjs from 'dayjs'
import LookupSelectView from '../../_components/input-multi-select/lookup-select-view/LookupSelectView';

const OfferCouponDetails = () => {
    let { type, id } = useParams()
    let navigate = useNavigate()
    const mounted = useRef(true)
    const [totalPrice, setTotalPrice] = useState(0)
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formErrors, setFormErrors] = useState({
        titleEn: true,
        titleAr: true,
        startDate: true,
        endDate: true,
        price: true,
        code: true,
    })

    const getDiscountValue = (item) => {
        return (item?.discountAmount ? (item?.discountAmount + ' ' + (I18nManager.isRTL() ? 'ريال' : 'SAR')) : (item?.discountPercentage + '%'))
    }

    const getDiscountAmount = (item) => {
        return (I18nManager.isRTL() ? 'ستوفر' : 'Savings') + ' ' + parseFloat((item?.discountAmount ? item?.discountAmount : (item?.price * (item?.discountPercentage / 100)))) + ' ' + (I18nManager.isRTL() ? 'ريال' : 'SAR')
    }

    const getPriceAfterDiscount = (item) => {
        return parseFloat((item?.discountAmount ? (item?.price - item?.discountAmount) : (item?.price - (item?.price * (item?.discountPercentage / 100))))) + ' ' + (I18nManager.isRTL() ? 'ريال' : 'SAR')
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'titleEn':
                setFormErrors({ ...formErrors, titleEn: value?.length >= 2 && value?.length <= 50 })
                break;
            case 'titleAr':
                setFormErrors({ ...formErrors, titleAr: value?.length >= 2 && value?.length <= 50 })
                break;
            case 'code':
                setFormErrors({ ...formErrors, code: value?.length >= 2 && value?.length <= 50 })
                break;
            case 'price':
                if (parseInt(value) > 0) {
                    if (data?.discountAmount && (parseInt(value) > parseInt(data?.discountAmount))) {
                        setTotalPrice(parseInt(value) - parseInt(data?.discountAmount))
                    } else if (data?.discountPercentage && (parseInt(data?.discountAmount) > 0)) {
                        setTotalPrice(parseInt(value) * (parseInt(data?.discountPercentage) / 100))
                    } else {
                        setTotalPrice(0)
                    }
                }
                setFormErrors({ ...formErrors, price: value > 0 })
                break;
            case 'discountAmount':
                if (parseInt(value) > 0 && parseInt(data?.price) > 0 && parseInt(data?.price) > parseInt(value)) {
                    setTotalPrice(parseInt(data?.price) - parseInt(value))
                } else {
                    setTotalPrice(0)
                }
                break;
            case 'discountPercentage':
                if (parseInt(value) > 0 && parseInt(data?.price) > 0) {
                    setTotalPrice(parseInt(data?.price) * (parseInt(value) / 100))
                } else {
                    setTotalPrice(0)
                }
                break;
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

    const onInputSelectChange = (foreignKey, multiple, d) => (e, item, reason) => {
        e.preventDefault()
        if (multiple) {
            var val = item.map(a => a.id)
            if (val?.[0] == 0) {
                val = data?.lookups?.[d].map(a => a.id)
            }
            if (foreignKey == 'complex_clinic_ids') {
                setLoading(true)
                if (val?.length > 0) {
                    postGetClinicById({ complex_clinic_id: val }).then(res => {
                        if (mounted.current && res?.data?.success) {
                            setLoading(false)
                            const d = { ...data }
                            setData({
                                ...d, clinic_ids: [], doctor_ids: [], lookups: { ...d.lookups, clinics: res.data.success },
                                [foreignKey]: val
                            })
                        }
                    }).catch(e => setLoading(false))
                } else {
                    getOfferCouponById()
                    setData({ ...data, [foreignKey]: val });
                }
            } else if (foreignKey == 'clinic_ids') {
                if (val?.length > 0) {
                    setLoading(true)
                    postGetClinicById({ id: val }).then(res => {
                        if (mounted.current && res?.data?.success) {
                            setLoading(false)
                            const d = { ...data }
                            setData({
                                ...d, doctor_ids: [], lookups: { ...d.lookups, doctors: res.data.success },
                                [foreignKey]: val
                            })
                        }
                    }).catch(e => setLoading(false))
                } else {
                    getOfferCouponById()
                    setData({ ...data, [foreignKey]: val });
                }
            } else {
                setData({ ...data, [foreignKey]: val });
            }
        } else {
            setData({ ...data, [foreignKey]: item?.id });
        }
    }

    const getOfferCouponById = () => {
        if (type == 0) {
            postGetOfferById({ id }).then(res => {
                if (mounted.current && res?.data?.success) {
                    const response = res.data.success
                    setData(response)
                    if (response?.totalPrice > 0) {
                        setTotalPrice(response?.totalPrice)
                    }
                }
            }).catch(e => { })
        } else {
            postGetCouponById({ id }).then(res => {
                if (mounted.current && res?.data?.success) {
                    const response = res.data.success
                    setData(response)
                }
            }).catch(e => { })
        }

    }

    const getOfferPreviewClinic = () => {
        if (data?.complex_clinic_ids?.length > 0) {
            return data?.lookups?.complex_clinics?.find(el => el?.id == data?.complex_clinic_ids?.[0])?.[I18nManager.isRTL() ? "nameAr" : "nameEn"]
        } else if (data?.clinic_ids?.length > 0) {
            return data?.lookups?.clinics?.find(el => el?.id == data?.clinic_ids?.[0])?.[I18nManager.isRTL() ? "nameAr" : "nameEn"]
        }
    }

    const onUploadProfileClick = () => {
        document.getElementById("profileupload").click();
    }

    const onUploadProfileChange = (e) => {
        let file = e.target.files[0]
        if (file.size > 4194304) {
            alert('File size must be less than 4 MB')
        } else {
            setData({ ...data, attachement: file })
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (checkFormErrors(formErrors)) {
            setLoading(true)
            var d = { ...data }
            delete d?.img
            var form_data = new FormData();
            for (var key in d) {
                form_data.append(key, d[key] ?? '');
            }
            if (type == 0) {
                postUpSertOffer(form_data).then(res => {
                    setLoading(false)
                    const response = res?.data?.success
                    if (response) {
                        if (isNaN(id)) {
                            navigate('/offer-details/' + type + '/' + response?.id)
                        } else {
                            setData({
                                ...data,
                                img: response?.img,
                                old_complex_clinic_ids: d.complex_clinic_ids,
                                old_clinic_ids: d.clinic_ids,
                                old_doctor_ids: d.doctor_ids
                            })
                        }
                        setSuccess(true)
                    } else {
                        setSuccess(false)
                    }
                }).catch(e => setLoading(false))
            } else {
                postUpSertCoupon(form_data).then(res => {
                    setLoading(false)
                    const response = res?.data?.success
                    if (response) {
                        if (isNaN(id)) {
                            navigate('/coupon-details/' + type + '/' + response?.id)
                        } else {
                            setData({
                                ...d, img: response?.img,
                                old_complex_clinic_ids: d.complex_clinic_ids,
                                old_clinic_ids: d.clinic_ids,
                                old_doctor_ids: d.doctor_ids
                            })
                        }
                        setSuccess(true)
                    } else {
                        setSuccess(false)
                    }
                }).catch(e => setLoading(false))
            }

        }
    }

    useEffect(() => {
        mounted.current = true
        getOfferCouponById();
        return () => {
            mounted.current = false
        }
    }, [id])

    return (
        <Box component="main" sx={{ flexGrow: 1, }}>
            {(data?.id || isNaN(id)) && <Container maxWidth="lg">
                <Typography sx={{ mb: 3 }} variant="h4">
                    {type == 0 ? (I18nManager.isRTL() ? "تفاصيل العرض" : "Offer Details") : (I18nManager.isRTL() ? "تفاصيل القسيمة" : "Coupon Details")}
                </Typography>
                <Grid container spacing={3}>
                    <Grid item lg={4} md={6} xs={12}>
                        <Card>
                            <CardContent>
                                <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                                    <Avatar src={data?.img ? (MEDIA_URL + data?.img) : null} sx={{ height: 64, mb: 2, width: 64 }} />
                                    <Typography color="textPrimary" gutterBottom variant="h5" sx={{ textAlign: 'center' }}>
                                        {data?.[I18nManager.isRTL() ? "titleAr" : "titleEn"]}
                                    </Typography>
                                    {/* <Typography color="textSecondary" variant="body2" >
                                        {`${user.city} ${user.country}`}
                                    </Typography>
                                    <Typography color="textSecondary" variant="body2" >
                                        {user.timezone}
                                    </Typography> */}
                                </Box>
                            </CardContent>
                            <Divider />
                            <CardActions>
                                <Button color="primary" fullWidth variant="text" onClick={onUploadProfileClick}>
                                    <input type="file" multiple={false} onChange={onUploadProfileChange} accept="image/png, image/jpeg, image/jpg, image/svg+xml" id="profileupload" name="attachment" style={{ display: 'none' }} />
                                    {I18nManager.isRTL() ? "تحميل الصورة" : "Upload picture"}
                                </Button>
                            </CardActions>
                        </Card>
                        {(!isNaN(id) && type == 0) && <CardActionArea sx={{ mt: 2 }}>
                            <CardMedia component="img" height="180"
                                image={data?.img ? (MEDIA_URL + data?.img) : null} alt="offer" />
                            <Box
                                sx={{
                                    position: 'absolute', top: 5, right: 5, width: 60, height: 60,
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center',
                                    borderRadius: '50%', backgroundColor: '#b50303',
                                    '&:hover': { backgroundColor: '#b50303', },
                                }}>
                                <Typography gutterBottom variant="small" component="div" color="text.primary" sx={{ fontSize: 10 }}>
                                    {getDiscountValue(data)} {I18nManager.isRTL() ? 'خصم' : 'disc.'}
                                </Typography>
                            </Box>
                            <Typography gutterBottom variant="span" component="div" color="#101093"
                                sx={{ position: 'absolute', top: 140, p: 1, bgcolor: 'rgba(255,255, 255,0.2)' }}>
                                {getOfferPreviewClinic()}
                            </Typography>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div" color="primary.main">
                                    {data?.[I18nManager.isRTL() ? "titleAr" : "titleEn"]}
                                </Typography>
                                <Typography variant="body1" color="text.primary">
                                    {data?.[I18nManager.isRTL() ? "subTitleAr" : "subTitleEn"]}
                                </Typography>
                                <Typography sx={{ my: 1 }} variant="body2" color="text.secondary">
                                    {data?.[I18nManager.isRTL() ? "descriptionAr" : "descriptionEn"]}
                                </Typography>
                                <Typography variant="body1" color="text.primary" sx={{ mr: 1, display: 'inline', textDecoration: 'line-through' }}>
                                    {data?.price ?? ""}
                                </Typography>
                                <Typography variant="body1" color="error.main" sx={{ mr: 1, display: 'inline', }}>
                                    {data?.price ? getDiscountAmount(data) : ""}
                                </Typography>
                                <Typography variant="body1" color="warning.main" sx={{ fontWeight: 'bold' }}>
                                    {data?.price ? getPriceAfterDiscount(data) : ""}
                                </Typography>
                            </CardContent>
                        </CardActionArea>}
                    </Grid>
                    <Grid item lg={8} md={6} xs={12}>
                        <Card component="form" noValidate onSubmit={onSubmit}>
                            <CardHeader
                                subheader={I18nManager.isRTL() ? "يمكن تعديل المعلومات" : "The information can be edited"}
                                title={I18nManager.isRTL() ? "تفاصيل" : "Details"}
                            />
                            <Divider />
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            error={!formErrors?.titleEn && data?.titleEn !== ''}
                                            helperText={!formErrors?.titleEn && data?.titleEn !== '' ? inputValidation?.user_name?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                            fullWidth
                                            label={I18nManager.isRTL() ? "الاسم" : "Name"}
                                            name="titleEn"
                                            onChange={handleChange}
                                            required
                                            value={data?.titleEn || ""}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            error={!formErrors?.titleAr && data?.titleAr !== ''}
                                            helperText={!formErrors?.titleAr && data?.titleAr !== '' ? inputValidation?.user_name?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                            fullWidth
                                            label={(I18nManager.isRTL() ? "الاسم" : "Name") + " (ar)"}
                                            name="titleAr"
                                            onChange={handleChange}
                                            required
                                            value={data?.titleAr || ""}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label={I18nManager.isRTL() ? "العنوان الفرعي" : "Subtitle"}
                                            name="subTitleEn"
                                            onChange={handleChange}
                                            value={data?.subTitleEn || ""}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label={(I18nManager.isRTL() ? "العنوان الفرعي" : "Subtitle") + " (ar)"}
                                            name="subTitleAr"
                                            onChange={handleChange}
                                            value={data?.subTitleAr || ""}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label={I18nManager.isRTL() ? "وصف" : "Description"}
                                            name="descriptionEn"
                                            onChange={handleChange}
                                            value={data?.descriptionEn || ""}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label={(I18nManager.isRTL() ? "وصف" : "Description") + " (ar)"}
                                            name="descriptionAr"
                                            onChange={handleChange}
                                            value={data?.descriptionAr || ""}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    {type == 0 &&
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                error={!formErrors?.price && data?.price !== ''}
                                                helperText={!formErrors?.price && data?.price !== '' ? inputValidation?.price?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                                fullWidth
                                                label={(I18nManager.isRTL() ? "السعر" : "Price") + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")"}
                                                type="number"
                                                name="price"
                                                required
                                                onChange={handleChange}
                                                value={data?.price || 0}
                                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                            />
                                        </Grid>}
                                    {type == 1 &&
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                error={!formErrors?.code && data?.code !== ''}
                                                helperText={!formErrors?.code && data?.code !== '' ? inputValidation?.coupon_code?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                                fullWidth
                                                label={I18nManager.isRTL() ? "الرمز" : "Code"}
                                                name="code"
                                                required
                                                onChange={handleChange}
                                                value={data?.code || ""}
                                            />
                                        </Grid>
                                    }

                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label={(I18nManager.isRTL() ? "مقدار الخصم" : "Discount Amount") + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")"}
                                            type="number"
                                            name="discountAmount"
                                            required
                                            onChange={handleChange}
                                            value={data?.discountAmount || 0}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label={(I18nManager.isRTL() ? "نسبة الخصم" : "Discount Percentage") + " %"}
                                            type="number"
                                            name="discountPercentage"
                                            required
                                            onChange={handleChange}
                                            value={data?.discountPercentage || 0}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                        />
                                    </Grid>
                                    {type == 0 &&
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                disabled
                                                label={(I18nManager.isRTL() ? "السعر الكلي" : "Total Price") + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")"}
                                                name="totalPrice"
                                                value={totalPrice || 0}
                                            />
                                        </Grid>}
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
                                    {data?.lookups && <>
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='complex_clinics' foreignKey='complex_clinic_ids' l={I18nManager.isRTL() ? "مجمع عيادات" : "Complex Clinics"} multiple={true} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='clinics' foreignKey='clinic_ids' l={I18nManager.isRTL() ? "عيادات" : "Clinics"} multiple={true} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='doctors' foreignKey='doctor_ids' l={I18nManager.isRTL() ? "الأطباء" : "Doctors"} multiple={true} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='order_types' foreignKey='order_type_id' l={I18nManager.isRTL() ? "نوع الطلب" : "Order Types"} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='isActiveLookup' foreignKey='isActive' l={I18nManager.isRTL() ? "مفعل" : "Is Active"} disabled={isNaN(id)} />
                                    </>}
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

export default OfferCouponDetails