import React, { useEffect, useRef, useState } from 'react';
import { postGetAllOrders, postUpSertOrder } from '../../core/api/Api';
import I18nManager from '../../core/I18nManager/I18nManager';
import DataTable from '../_components/datatable/DataTable';
import { Box, Link, Chip, } from '@mui/material';
import { getOrderStatusColor } from '../../core/common-service/CommonService';
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const mounted = useRef(true)
    let navigate = useNavigate()
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const columns = [
        { field: 'id', headerName: 'ID', },
        {
            field: 'patient', headerName: I18nManager.isRTL() ? "المريض" : "Patient",
            renderCell: (params) => (
                params?.value &&
                <Box sx={{ display: 'block' }}>
                    {params?.value?.firstName + ' ' + params?.value?.lastName}
                    <Box component="span" sx={{ display: 'block' }}>
                        <Link href={params?.value?.user?.mobileNumber ? ("tel:" + (params?.value?.user?.countryCode + params?.value?.user?.mobileNumber)) :
                            ("mailto:" + params?.value?.user?.email)}>
                            <b>
                                {("+" + params?.value?.user?.countryCode + params?.value?.user?.mobileNumber)
                                    || params?.value?.user?.email}
                            </b>
                        </Link>
                    </Box>
                </Box>
            )
        },
        {
            field: 'doctor', headerName: I18nManager.isRTL() ? "الطبيب" : "Doctor",
            renderCell: (params) => (
                params?.value &&
                params?.value?.[I18nManager.isRTL() ? "firstNameAr" : "firstNameEn"] + ' ' + params?.value?.[I18nManager.isRTL() ? "lastNameAr" : "lastNameEn"]
            )
        },
        {
            field: 'clinic', headerName: I18nManager.isRTL() ? "العيادة" : "Clinic",
            renderCell: (params) => (
                params?.value &&
                params?.value?.[I18nManager.isRTL() ? "nameAr" : "nameEn"]
            )
        },
        {
            field: 'note', headerName: I18nManager.isRTL() ? "ملاحظة" : "Note",
            renderCell: (params) => params?.value && params?.value
        },
        {
            field: 'offer', headerName: I18nManager.isRTL() ? "العرض" : "Service",
            renderCell: (params) => {
                const getServiceType = () => {
                    const row = params?.row
                    if (row?.offer) {
                        return (I18nManager.isRTL() ? "عرض" : "Offer")
                    } else if (row?.speciality) {
                        return row?.speciality?.[I18nManager.isRTL() ? "titleAr" : "titleEn"]
                    } else {
                        return ''
                    }
                }
                return (
                    getServiceType()
                )
            }
        },
        {
            field: 'order_type', headerName: I18nManager.isRTL() ? "نوع الطلب" : "Order Type",
            renderCell: (params) => (
                params?.value && params?.value?.[I18nManager.isRTL() ? "nameAr" : "nameEn"]
            )
        },
        {
            field: 'price', headerName: I18nManager.isRTL() ? "السعر" : "Price",
            renderCell: (params) => (
                params?.value && params?.value + ' ' + (I18nManager.isRTL() ? "ريال" : "SAR")
            )
        },
        {
            field: 'order_status', headerName: I18nManager.isRTL() ? "الحالة" : "Status",
            renderCell: (params) => {
                const val = params?.value
                return (
                    <Chip label={val?.[I18nManager.isRTL() ? "nameAr" : "nameEn"]} color={getOrderStatusColor(val)} />
                )
            }
        },
        {
            field: 'order_source', headerName: I18nManager.isRTL() ? "مصدر" : "Source",
            renderCell: (params) => (
                params?.value &&
                params?.value?.[I18nManager.isRTL() ? "nameAr" : "nameEn"]
            )
        },
        {
            field: 'created_at', headerName: I18nManager.isRTL() ? "أنشئت في" : "Created At",
            renderCell: (params) => dayjs(new Date(params?.value)).format('lll')
        },
    ]

    const onDeleteDataTableRows = (data) => {
        setLoading(true)
        postUpSertOrder(data).then(res => {
            setLoading(false)
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setData(data)
            }
        }).catch(e => { if (mounted.current) setLoading(false) })
    }

    const onRowClick = (e) => {
        navigate('/order-details/' + e.id)
    }

    const onCreateButtonClick = () => {
        navigate('/order-details/create')
    }

    const getAllOrders = (data) => {
        setLoading(true)
        postGetAllOrders(data).then(res => {
            setLoading(false)
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setData(data)
            }
        }).catch(e => { if (mounted.current) setLoading(false) })
    }

    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        };
    }, []);

    return (
        <DataTable columns={columns} data={data} loading={loading}
            onPageChangeProp={getAllOrders}
            onRowClick={onRowClick}
            onCreateButtonClick={onCreateButtonClick}
            onDeleteDataTableRows={onDeleteDataTableRows} />
    );
}

export default Orders