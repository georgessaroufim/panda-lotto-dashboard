import React, { useState, useContext } from 'react';
import { Avatar, TextField, FormControlLabel, Checkbox, Link, Paper, Box, Grid, Typography, } from '@mui/material'
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import images from '../../core/constants/images';
import { postLogin, setDefaultHeader } from '../../core/api/Api';
import { emailValidation, setCookie, checkFormErrors } from '../../core/common-service/CommonService';
import { inputValidation } from '../../core/constants/constants';
import I18nManager from '../../core/I18nManager/I18nManager';
import { StoreContext } from '../../core/context/StoreContext';
import ButtonWithLoading from '../_components/button-with-loading/ButtonWithLoading';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { setIsLoggedIn, setUser } = useContext(StoreContext)
    let navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [formErrors, setFormErrors] = useState({
        email: false,
        password: false
    })

    const onRememberMeClick = () => {
        setRememberMe(prevState => !prevState)
    }

    const onInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        switch (name) {
            case 'email':
                setFormErrors({ ...formErrors, email: emailValidation(value) })
                setEmail(value)
                break;
            case 'password':
                setFormErrors({ ...formErrors, password: value?.length > 6 })
                setPassword(value)
                break;
            default:
                break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (checkFormErrors(formErrors)) {
            setLoading(true)
            postLogin({ email, password }).then(res => {
                setLoading(false)
                const response = res?.data
                if (response?.success) {
                    const token = response?.success?.token
                    const user = response?.success?.user
                    if (user?.user_type_id !== 1) {
                        setDefaultHeader(token)
                        setIsLoggedIn(true)
                        setUser(user)
                        setSuccess(true)
                        setTimeout(() => {
                            if (rememberMe) {
                                setCookie('token', token)
                            } else {
                                sessionStorage.setItem('token', token)
                            }
                            navigate('/orders')
                        }, 300);
                    } else {
                        setSuccess(false)
                        alert(I18nManager.isRTL() ? "المستخدم غير مسموح به" : "User not allowed")
                    }
                } else {
                    setSuccess(false)
                }
            }).catch(e => setLoading(false))
        }
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: `url(${images.logo})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode == 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {I18nManager.isRTL() ? "تسجيل الدخول" : "Sign in"}
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            onChange={onInputChange}
                            error={!formErrors?.email && email !== ''}
                            helperText={!formErrors?.email && email !== '' ? inputValidation?.email?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                            margin="normal"
                            required
                            fullWidth
                            label={I18nManager.isRTL() ? "الإيميل" : "Email Address"}
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            onChange={onInputChange}
                            error={!formErrors?.password && password !== ''}
                            helperText={!formErrors?.password && password !== '' ? inputValidation?.password?.[I18nManager.isRTL() ? "ar" : "en"] : ""}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label={I18nManager.isRTL() ? "كلمة السر" : "Password"}
                            type="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            onClick={onRememberMeClick}
                            control={<Checkbox value="remember" checked={rememberMe} color="primary" />}
                            label={I18nManager.isRTL() ? "حفظ الدخول" : "Remember me"}
                        />

                        <Box sx={{ mt: 1, position: 'relative' }}>
                            <ButtonWithLoading success={success} loading={loading} text={I18nManager.isRTL() ? "تسجيل الدخول" : "Sign in"} />
                        </Box>
                        {/* <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button> */}
                        {/* <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid> */}

                        <Typography sx={{ mt: 5 }} variant="body2" color="text.secondary" align="center">
                            {(I18nManager.isRTL() ? "حقوق النشر" : "Copyright") + ' ©'}
                            <Link color="inherit" href="https://pandaloto.com/">
                                PandaLoto.com
                            </Link>{' '}
                            {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default Login