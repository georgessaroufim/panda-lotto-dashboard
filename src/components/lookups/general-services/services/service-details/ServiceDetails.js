import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MEDIA_URL, postGetServiceById, postUpSertService, } from '../../../../../core/api/Api';
import { Box, Container, CardActions, Grid, Avatar, Typography, Button, Card, CardContent, CardHeader, Divider, TextField } from '@mui/material';
import I18nManager from '../../../../../core/I18nManager/I18nManager';
import ButtonWithLoading from '../../../../_components/button-with-loading/ButtonWithLoading';
import { inputValidation } from '../../../../../core/constants/constants';
import { checkFormErrors } from '../../../../../core/common-service/CommonService';
import LookupSelectView from '../../../../_components/input-multi-select/lookup-select-view/LookupSelectView';

const ServiceDetails = () => {
    let { type, id } = useParams()
    let navigate = useNavigate()
    const mounted = useRef(true)
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formErrors, setFormErrors] = useState({
        titleEn: true,
        titleAr: true,
        price: true,
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'titleEn':
                setFormErrors({ ...formErrors, titleEn: value?.length >= 2 && value?.length <= 50 })
                break;
            case 'titleAr':
                setFormErrors({ ...formErrors, titleAr: value?.length >= 2 && value?.length <= 50 })
                break;
            case 'price':
                setFormErrors({ ...formErrors, price: value > 0 })
                break;
            default:
                break;
        }
        setData({ ...data, [name]: value });
    };

    const onInputSelectChange = (foreignKey, multiple, d) => (e, item, reason) => {
        e.preventDefault()
        setData({ ...data, [foreignKey]: item?.id });
    }

    const getServiceById = () => {
        postGetServiceById({ id }).then(res => {
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setData(data)
            }
        }).catch(e => { })
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
            d.general_service_id = type
            delete d?.img
            var form_data = new FormData();
            for (var key in d) {
                form_data.append(key, d[key] ?? '');
            }
            postUpSertService(form_data).then(res => {
                setLoading(false)
                const response = res?.data?.success
                if (response) {
                    if (isNaN(id)) {
                        navigate('/service-details/' + type + '/' + response?.id)
                    } else {
                        setData({ ...d, img: response?.img })
                    }
                    setSuccess(true)
                } else {
                    setSuccess(false)
                }
            }).catch(e => setLoading(false))
        }
    }

    useEffect(() => {
        mounted.current = true
        getServiceById();
        return () => {
            mounted.current = false
        }
    }, [id])

    return (
        <Box component="main" sx={{ flexGrow: 1, }}>
            {(data?.id || isNaN(id)) && <Container maxWidth="lg">
                <Typography sx={{ mb: 3 }} variant="h4">
                    {I18nManager.isRTL() ? "تفاصيل الخدمة" : "Service Details"}
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
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            error={!formErrors?.price && data?.price !== ''}
                                            helperText={!formErrors?.price && data?.price !== '' ? inputValidation?.price?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                            fullWidth
                                            required
                                            label={(I18nManager.isRTL() ? "السعر" : "Price") + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")"}
                                            type="number"
                                            name="price"
                                            onChange={handleChange}
                                            value={data?.price || 0}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label={(I18nManager.isRTL() ? "مقدار الخصم" : "Discount Amount") + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")"}
                                            type="number"
                                            name="discountAmount"
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
                                            onChange={handleChange}
                                            value={data?.discountPercentage || 0}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                        />
                                    </Grid>
                                    {data?.lookups && <>
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='general_services' foreignKey='general_service_id' l={I18nManager.isRTL() ? "خدمات عامة" : "General Services"} />
                                    </>}
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

export default ServiceDetails