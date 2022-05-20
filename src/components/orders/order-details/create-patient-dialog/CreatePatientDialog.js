
import React, { forwardRef, useState, useImperativeHandle } from 'react'
import { Grid, Box, TextField } from '@mui/material';
import { inputValidation } from '../../../../core/constants/constants';
import I18nManager from '../../../../core/I18nManager/I18nManager';
import { checkFormErrors, getPhoneNumberDetails, removeWhiteSpaceFromString, fullNameValidation } from '../../../../core/common-service/CommonService';
import ButtonWithLoading from '../../../_components/button-with-loading/ButtonWithLoading';
import { postRegister } from '../../../../core/api/Api';
import useDialog from '../../../_hooks/dialog-hook/useDialog';

const CreatePatientDialog = forwardRef(({ onRegisterSuccess }, ref) => {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formErrors, setFormErrors] = useState({
        fullName: true,
        mobileNumber: true,
        password: true,
        confirmPassword: true
    })

    const [DialogPopup, openDialog, closeDialog] = useDialog({
        title: I18nManager.isRTL() ? "إنشاء حساب للمريض" : "Create Patient"
    })

    useImperativeHandle(ref, () => ({
        call_openDialog() {
            openDialog()
        },
        call_closeDialog() {
            closeDialog()
        },
    }), [])

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'fullName':
                setFormErrors({ ...formErrors, fullName: fullNameValidation(value) })
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

    const onSubmit = (e) => {
        e.preventDefault();
        if (checkFormErrors(formErrors)) {
            setLoading(true)
            var d = { ...data }
            d.user_type_id = 1
            d.firstName = d.fullName.split(' ')[0]
            d.lastName = d.fullName.replace(d.fullName.split(' ')[0], "")
            if (data?.mobileNumber) {
                d.mobileNumber = removeWhiteSpaceFromString(data?.mobileNumber?.replace('+' + data?.countryCode, ''))
            } else {
                delete d?.countryCode
                delete d?.mobileNumber
            }
            postRegister({ ...d, action: 'create-patient-for-order' }).then(res => {
                setLoading(false)
                const response = res?.data?.success
                if (response) {
                    onRegisterSuccess(response)
                    setSuccess(true)
                } else {
                    setSuccess(false)
                }
            }).catch(e => setLoading(false))

        }
    }

    return (
        <DialogPopup children={
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        error={!formErrors?.fullName && data?.fullName !== ''}
                        helperText={!formErrors?.fullName && data?.fullName !== '' ? inputValidation?.fullName?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                        fullWidth
                        label={I18nManager.isRTL() ? "الاسم الكامل" : "Full Name"}
                        name="fullName"
                        onChange={handleChange}
                        required
                        value={data?.fullName || ""}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        error={!formErrors?.mobileNumber && data?.mobileNumber !== ''}
                        helperText={!formErrors?.mobileNumber && data?.mobileNumber !== '' ? inputValidation?.mobileNo?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                        fullWidth
                        required
                        label={I18nManager.isRTL() ? "رقم الهاتف" : "Mobile Number"}
                        name="mobileNumber"
                        onChange={handleChange}
                        value={data?.mobileNumber || ""}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        error={!formErrors?.password && data?.password !== ''}
                        helperText={!formErrors?.password && data?.password !== '' ? inputValidation?.password?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
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
                <Grid item xs={12}>
                    <TextField
                        error={!formErrors?.confirmPassword && data?.confirmPassword !== ''}
                        helperText={!formErrors?.confirmPassword && data?.confirmPassword !== '' ? inputValidation?.password?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                        fullWidth
                        type="password"
                        required
                        label={I18nManager.isRTL() ? "تأكيد كلمة المرور" : "Confirm Password"}
                        name="confirmPassword"
                        onChange={handleChange}
                        value={data?.confirmPassword}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <ButtonWithLoading onClick={onSubmit} loading={loading} success={success} text={I18nManager.isRTL() ? "حفظ" : "Save"} />
                    </Box>
                </Grid>
            </Grid>
        } />
    )
})

export default CreatePatientDialog