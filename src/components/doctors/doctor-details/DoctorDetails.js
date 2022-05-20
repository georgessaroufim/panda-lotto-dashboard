import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MEDIA_URL, postGetDoctorById, postUpSertDoctor, postRegister } from '../../../core/api/Api';
import { Box, Container, CardActions, Grid, Avatar, Typography, Button, Card, CardContent, CardHeader, Divider, TextField } from '@mui/material';
import I18nManager from '../../../core/I18nManager/I18nManager';
import ButtonWithLoading from '../../_components/button-with-loading/ButtonWithLoading';
import { inputValidation } from '../../../core/constants/constants';
import { checkFormErrors, emailValidation, getPhoneNumberDetails, removeWhiteSpaceFromString } from '../../../core/common-service/CommonService';
import LookupSelectView from '../../_components/input-multi-select/lookup-select-view/LookupSelectView';

const DoctorDetails = () => {
    let { id } = useParams()
    let navigate = useNavigate()

    const mounted = useRef(true)
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formErrors, setFormErrors] = useState({
        firstNameEn: true,
        firstNameAr: true,
        lastNameEn: true,
        lastNameAr: true,
        email: true,
        mobileNumber: true,
        password: true,
        confirmPassword: true
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'firstNameEn':
                setFormErrors({ ...formErrors, firstNameEn: value?.length >= 2 && value?.length <= 50 })
                break;
            case 'firstNameAr':
                setFormErrors({ ...formErrors, firstNameAr: value?.length >= 2 && value?.length <= 50 })
                break;
            case 'lastNameEn':
                setFormErrors({ ...formErrors, lastNameEn: value?.length >= 2 && value?.length <= 50 })
                break;
            case 'lastNameAr':
                setFormErrors({ ...formErrors, lastNameAr: value?.length >= 2 && value?.length <= 50 })
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

    const getDoctorById = () => {
        postGetDoctorById({ id }).then(res => {
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
            d.user_type_id = 2
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
                            navigate('/doctor-details/' + response?.id)
                        } else {
                            setData({ ...d, img: response?.img })
                        }
                        setSuccess(true)
                    } else {
                        setSuccess(false)
                    }
                }).catch(e => setLoading(false))
            } else {
                postUpSertDoctor(form_data).then(res => {
                    setLoading(false)
                    const response = res?.data?.success
                    if (response) {
                        setData({
                            ...data,
                            img: response?.img,
                            old_clinic_ids: d.clinic_ids,
                            old_service_ids: d.service_ids
                        })
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
        getDoctorById();
        return () => {
            mounted.current = false
        }
    }, [id])

    return (
        <Box component="main" sx={{ flexGrow: 1, }}>
            {(data?.id || isNaN(id)) && <Container maxWidth="lg">
                <Typography sx={{ mb: 3 }} variant="h4">
                    {I18nManager.isRTL() ? "تفاصيل الطبيب" : "Doctor Details"}
                </Typography>
                <Grid container spacing={3}>
                    <Grid item lg={4} md={6} xs={12}>
                        <Card>
                            <CardContent>
                                <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                                    <Avatar src={data?.img ? (MEDIA_URL + data?.img) : null} sx={{ height: 64, mb: 2, width: 64 }} />
                                    <Typography color="textPrimary" gutterBottom variant="h5" sx={{ textAlign: 'center' }}>
                                        {data?.[I18nManager.isRTL() ? "firstNameAr" : "firstNameEn"]} {data?.[I18nManager.isRTL() ? "lastNameAr" : "lastNameEn"]}
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
                                            error={!formErrors?.firstNameEn && data?.firstNameEn !== ''}
                                            helperText={!formErrors?.firstNameEn && data?.firstNameEn !== '' ? inputValidation?.user_name?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                            fullWidth
                                            label={I18nManager.isRTL() ? "الاسم الأول" : "First Name"}
                                            name="firstNameEn"
                                            onChange={handleChange}
                                            required
                                            value={data?.firstNameEn || ""}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            error={!formErrors?.firstNameAr && data?.firstNameAr !== ''}
                                            helperText={!formErrors?.firstNameAr && data?.firstNameAr !== '' ? inputValidation?.user_name?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                            fullWidth
                                            label={(I18nManager.isRTL() ? "الاسم الأول" : "First Name") + " (ar)"}
                                            name="firstNameAr"
                                            onChange={handleChange}
                                            required
                                            value={data?.firstNameAr || ""}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            error={!formErrors?.lastNameEn && data?.lastNameEn !== ''}
                                            helperText={!formErrors?.lastNameEn && data?.lastNameEn !== '' ? inputValidation?.user_name?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                            fullWidth
                                            label={I18nManager.isRTL() ? "الكنية" : "Last Name"}
                                            name="lastNameEn"
                                            onChange={handleChange}
                                            required
                                            value={data?.lastNameEn || ""}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            error={!formErrors?.lastNameAr && data?.lastNameAr !== ''}
                                            helperText={!formErrors?.lastNameAr && data?.lastNameAr !== '' ? inputValidation?.user_name?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                                            fullWidth
                                            label={(I18nManager.isRTL() ? "الكنية" : "Last Name") + " (ar)"}
                                            name="lastNameAr"
                                            onChange={handleChange}
                                            required
                                            value={data?.lastNameAr || ""}
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
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='genders' foreignKey='gender_id' l={I18nManager.isRTL() ? "الجنس" : "Genders"} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='occupations' foreignKey='occupation_id' l={I18nManager.isRTL() ? "المهن" : "Occupations"} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='education_levels' foreignKey='education_level_id' l={I18nManager.isRTL() ? "مستويات التعليم" : "Education Levels"} />
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='clinics' foreignKey='clinic_ids' l={I18nManager.isRTL() ? "عيادات" : "Clinics"} multiple={true} />
                                        {/* <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='general_services' foreignKey='gender_id' l={I18nManager.isRTL() ? "خدمات عامة" : "General Services"} /> */}
                                        <LookupSelectView onInputSelectChange={onInputSelectChange} data={data} d='services' foreignKey='service_ids' l={I18nManager.isRTL() ? "خدمات" : "Services"} multiple={true} />
                                    </>}
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label={I18nManager.isRTL() ? "سنوات الخبرة" : "Years of Exp."}
                                            type="number"
                                            name="yearsOfExperience"
                                            onChange={handleChange}
                                            value={data?.yearsOfExperience || 0}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label={(I18nManager.isRTL() ? "رسوم في الموقع" : "Onsite Fee") + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")"}
                                            type="number"
                                            name="onsiteFee"
                                            onChange={handleChange}
                                            value={data?.onsiteFee || 0}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label={(I18nManager.isRTL() ? "رسوم اونلاين" : "Online Fee") + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")"}
                                            type="number"
                                            name="onlineFee"
                                            onChange={handleChange}
                                            value={data?.onlineFee || 0}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label={(I18nManager.isRTL() ? "رسوم العيادة" : "Onclinic Fee") + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")"}
                                            type="number"
                                            name="onclinicFee"
                                            onChange={handleChange}
                                            value={data?.onclinicFee || 0}
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

export default DoctorDetails