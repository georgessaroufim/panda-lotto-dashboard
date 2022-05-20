import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { postGetOccupationById, postUpSertOccupation } from '../../../../core/api/Api';
import { Box, Container, Grid, Typography, Card, CardContent, CardHeader, Divider, TextField } from '@mui/material';
import I18nManager from '../../../../core/I18nManager/I18nManager';
import ButtonWithLoading from '../../../_components/button-with-loading/ButtonWithLoading';
import { inputValidation } from '../../../../core/constants/constants';
import { checkFormErrors } from '../../../../core/common-service/CommonService';
import LookupSelectView from '../../../_components/input-multi-select/lookup-select-view/LookupSelectView';

const OccupationDetails = () => {
    let { id } = useParams()
    let navigate = useNavigate()
    const mounted = useRef(true)
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formErrors, setFormErrors] = useState({
        nameEn: true,
        nameAr: true,
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
            default:
                break;
        }
        setData({ ...data, [name]: value });
    };

    const onInputSelectChange = (foreignKey, multiple, d) => (e, item, reason) => {
        e.preventDefault()
        setData({ ...data, [foreignKey]: item?.id });
    }

    const getOccupationById = () => {
        postGetOccupationById({ id }).then(res => {
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setData(data)
            }
        }).catch(e => { })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (checkFormErrors(formErrors)) {
            setLoading(true)
            postUpSertOccupation(data).then(res => {
                setLoading(false)
                const response = res?.data?.success
                if (response) {
                    if (isNaN(id)) {
                        navigate('/occupation-details/' + response?.id)
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
        getOccupationById();
        return () => {
            mounted.current = false
        }
    }, [id])

    return (
        <Box component="main" sx={{ flexGrow: 1, }}>
            {(data?.id || isNaN(id)) && <Container maxWidth="lg">
                <Typography sx={{ mb: 3 }} variant="h4">
                    {I18nManager.isRTL() ? "تفاصيل المهن" : "Occupation Details"}
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
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

export default OccupationDetails