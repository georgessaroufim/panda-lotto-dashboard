import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Snackbar, Alert, AlertTitle } from '@mui/material'
import I18nManager from '../../../core/I18nManager/I18nManager'

const RequestErrorMessage = () => {

    const [errors, setErrors] = useState([])
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("error")

    const handleClose = (event, reason) => {
        if (reason == 'clickaway') {
            return;
        }
        setOpen(false);
    };

    useEffect(() => {
        axios.interceptors.response.use(res => {
            try {
                if (res?.request?.responseURL) {
                    if (res?.request?.responseURL.includes("upSert")) {
                        setSeverity("success")
                        setOpen(true)
                    }
                }
            } catch (error) {
                setOpen(false)
            }
            return res
        }, error => {
            try {
                // const code = error.response.status
                var response = error.response.data.error
                // for (const [key, value] of Object.entries(response)) {
                // console.log(`${key}: ${JSON.stringify(value)}`);
                // }
                // if (!Array.isArray(response)) {
                //     response = [response]
                // }
                setSeverity("error")
                setOpen(true)
                setErrors(Object.entries(response).map((e) => ([e[0]] + ": " + e[1])))
            } catch (error) {
                setErrors([])
                setOpen(false)
            }
        })
    }, [])

    return (
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ maxWidth: 500 }}>
                <AlertTitle>{severity == 'success' ? (I18nManager.isRTL() ? "نجاح" : "Success") : (I18nManager.isRTL() ? "خطأ" : "Error")}</AlertTitle>
                {severity == 'error' && errors.map((item, index) => (
                    <p key={index}>{(index + 1) + "- "} {item}</p>
                ))}
            </Alert>
        </Snackbar >
    )
}

export default RequestErrorMessage