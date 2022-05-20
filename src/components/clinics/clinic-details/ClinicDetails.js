import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MEDIA_URL, postGetClinicById, postUpSertClinic, postRegister } from '../../../core/api/Api';
import { Box, Container, CardActions, Grid, Avatar, Typography, Button, Card, CardContent, CardHeader, Divider, TextField } from '@mui/material';
import I18nManager from '../../../core/I18nManager/I18nManager';
import ButtonWithLoading from '../../_components/button-with-loading/ButtonWithLoading';
import { inputValidation } from '../../../core/constants/constants';
import { checkFormErrors, emailValidation, getPhoneNumberDetails, removeWhiteSpaceFromString } from '../../../core/common-service/CommonService';
import LookupSelectView from '../../_components/input-multi-select/lookup-select-view/LookupSelectView';

const ClinicDetails = () => {
    let { id } = useParams()
    let navigate = useNavigate()
    const mounted = useRef(true)
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formErrors, setFormErrors] = useState({
        nameEn: true,
        nameAr: true,
        email: true,
        mobileNumber: true,
        password: true,
        confirmPassword: true
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'nameEn':
                setFormErrors({ ...formErrors, nameEn: value?.length >= 2 && value?.length <= 50 })
                break;
            case 'nameAr':
                setFormErrors({ ...formErrors, nameAr: value?.length >= 2 && value?.length <= 50 })
                break;
            case 'email':
                setFormErrors({ ...formErrors, email: emailValidation(value), mobileNumber: true })
                break;
            case 'mobileNumber':
                const phoneDetails = getPhoneNumberDetails(value)
                if (phoneDetails) {
                    setFormErrors({ ...formErrors, mobileNumber: phoneDetails.isValid ?? true })
                    if (phoneDetails.isValid) {
                        setFormErrors({ ...formErrors, mobileNumber: true, email: true })
                        setData({ ...data, mobileNumber: phoneDetails.format, countryCode: phoneDetails.countryCode });
                    } else {
                        setData({ ...data, [name]: value });
                    }
                }
                break;
            case 'password':
                setFormErrors({ ...formErrors, password: value?.length > 7 })
                break;
            case 'confirmPassword':
                setFormErrors({ ...formErrors, confirmPassword: (value?.length > 7) && (value == data?.password) })
                break;
            default:
                break;
        }
        if (name !== 'mobileNumber') {
            setData({ ...data, [name]: value });
        }
    };

    const getClinicById = () => {
        postGetClinicById({ id }).then(res => {
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
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
            d.user_type_id = 3
            if (data?.mobileNumber) {
                d.mobileNumber = removeWhiteSpaceFromString(data?.mobileNumber?.replace('+' + data?.countryCode, ''))
            } else {
                delete d?.countryCode
                delete d?.mobileNumber
            }
            var form_data = new FormData();
            for (var key in d) {
                form_data.append(key, d[key] ?? '');
            }
            if (isNaN(id)) {
                postRegister(form_data).then(res => {
                    setLoading(false)
                    const response = res?.data?.success
                    if (response) {
                        if (isNaN(id)) {
                            navigate('/clinic-details/' + response?.id)
                        } else {
                            setData({ ...d, img: response?.img })
                        }
                        setSuccess(true)
                    } else {
                        setSuccess(false)
                    }
                }).catch(e => setLoading(false))
            } else {
                postUpSertClinic(form_data).then(res => {
                    setLoading(false)
                    const response = res?.data?.success
                    if (response) {
                        setSuccess(true)
                        setData({
                            ...d,
                            img: response?.img,
                            old_doctor_ids: d.doctor_ids
                        })
                    } else {
                        setSuccess(false)
                    }
                }).catch(e => setLoading(false))
            }
        }
    }

    useEffect(() => {
        mounted.current = true
        getClinicById();
        return () => {
            mounted.current = false
        }
    }, [id])

    return (
        <Box component="main" sx={{ flexGrow: 1, }}>
            {(data?.id || isNaN(id)) && <Container maxWidth="lg">
                <Typography sx={{ mb: 3 }} variant="h4">
                    {I18nManager.isRTL() ? "تفاصيل العيادة" : "Clinic Details"}
                </Typography>
                <Grid container spacing={3}>
                    <Grid item lg={4} md={6} xs={12}>
                        <Card>
                            <CardContent>
                                <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                                    <Avatar src={data?.img ? (MEDIA_URL + data?.img) : null} sx={{ height: 64, mb: 2, width: 64 }} />
                                    <Typography color="textPrimary" gutterBottom variant="h5" sx={{ textAlign: 'center' }}>
                                        {data?.[I18nManager.isRTL() ? "nameAr" : "nameEn"]}
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
                                title={I18nManager.isRTL() ? "الملف الشخصي" : "Profile"}
                            />
                            <Divider />
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            error={!formErrors?.nameEn && data?.nameEn !== ''}
                                            helperText={!formErrors?.nameEn && data?.nameEn !== '' ? inputValidation?.user_name?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                            fullWidth
                                            label={I18nManager.isRTL() ? "الاسم" : "Name"}
                                            name="nameEn"
                                            onChange={handleChange}
                                            required
                                            value={data?.nameEn || ""}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            error={!formErrors?.nameAr && data?.nameAr !== ''}
                                            helperText={!formErrors?.nameAr && data?.nameAr !== '' ? inputValidation?.user_name?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                            fullWidth
                                            label={(I18nManager.isRTL() ? "الاسم" : "Name") + " (ar)"}
                                            name="nameAr"
                                            onChange={handleChange}
                                            required
                                            value={data?.nameAr || ""}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            error={!formErrors?.email && data?.email !== ''}
                                            helperText={!formErrors?.email && data?.email !== '' ? inputValidation?.email?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                            disabled={!isNaN(id)}
                                            fullWidth
                                            required
                                            label={I18nManager.isRTL() ? "الإيميل" : "Email Address"}
                                            name="email"
                                            onChange={handleChange}
                                            value={(isNaN(id) ? data?.email : data?.user?.email) || ""}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            error={!formErrors?.mobileNumber && data?.mobileNumber !== ''}
                                            helperText={!formErrors?.mobileNumber && data?.mobileNumber !== '' ? inputValidation?.mobileNo?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                            disabled={!isNaN(id)}
                                            fullWidth
                                            label={I18nManager.isRTL() ? "رقم الهاتف" : "Mobile Number"}
                                            name="mobileNumber"
                                            onChange={handleChange}
                                            value={isNaN(id) ? data?.mobileNumber : (data?.user?.mobileNumber ? ("+" + data?.user?.countryCode + data?.user?.mobileNumber) : "")}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    {isNaN(id) && <>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                error={!formErrors?.password && data?.password !== ''}
                                                helperText={!formErrors?.password && data?.password !== '' ? inputValidation?.password?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                                disabled={!isNaN(id)}
                                                fullWidth
                                                required
                                                type="password"
                                                label={I18nManager.isRTL() ? "كلمه السر" : "Password"}
                                                name="password"
                                                onChange={handleChange}
                                                value={data?.password}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                error={!formErrors?.confirmPassword && data?.confirmPassword !== ''}
                                                helperText={!formErrors?.confirmPassword && data?.confirmPassword !== '' ? inputValidation?.password?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                                disabled={!isNaN(id)}
                                                fullWidth
                                                required
                                                type="password"
                                                label={I18nManager.isRTL() ? "تأكيد كلمة المرور" : "Confirm Password"}
                                                name="confirmPassword"
                                                onChange={handleChange}
                                                value={data?.confirmPassword}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </>}
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            maxRows={4}
                                            label={I18nManager.isRTL() ? "السيرة الذاتية" : "Bio"}
                                            name="bioEn"
                                            onChange={handleChange}
                                            value={data?.bioEn || ""}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            maxRows={4}
                                            label={(I18nManager.isRTL() ? "السيرة الذاتية" : "Bio") + " (ar)"}
                                            name="bioAr"
                                            onChange={handleChange}
                                            value={data?.bioAr || ""}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    {data?.lookups && <>
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='complex_clinics' foreignKey='complex_clinic_id' l={I18nManager.isRTL() ? "مجمع عيادات" : "Complex Clinics"} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='doctors' foreignKey='doctor_ids' l={I18nManager.isRTL() ? "الأطباء" : "Doctors"} multiple={true} />
                                    </>}
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label={(I18nManager.isRTL() ? "عمولة" : "Commission") + " %"}
                                            type="number"
                                            name="commission"
                                            onChange={handleChange}
                                            value={data?.commission || 0}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
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

export default ClinicDetails