import React, { useEffect, useRef, useState } from 'react';
import { postGetAllCoupons, postGetAllOffers, postUpSertCoupon, postUpSertOffer } from '../../core/api/Api';
import I18nManager from '../../core/I18nManager/I18nManager';
import DataTable from '../_components/datatable/DataTable';
import { FormControl, Button, InputLabel, Box, Select, MenuItem } from '@mui/material';
import OrderingTransferListDialog from '../_components/ordering-transfer-list-dialog/OrderingTransferListDialog';
import { useNavigate } from 'react-router-dom';

const OffersCoupons = () => {
    let navigate = useNavigate()
    const menuList = [
        { title: I18nManager.isRTL() ? "عروض" : "Offers", value: 0, },
        { title: I18nManager.isRTL() ? "كوبونات" : "Coupons", value: 1, }
    ]

    const mounted = useRef(true)
    const reorderOffersDialogRef = useRef(null)
    const [data, setData] = useState([]);
    const [reorderData, setReorderData] = useState([])
    const [paginationPropData, setPaginationPropData] = useState({})
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState(menuList[0].value);

    const columns = [
        { field: 'titleAr', headerName: (I18nManager.isRTL() ? "الاسم" : "Name") + ' (ar)' },
        { field: 'titleEn', headerName: I18nManager.isRTL() ? "الاسم" : "Name" },
        {
            field: 'price', headerName: I18nManager.isRTL() ? "السعر" : "Price",
            renderCell: (params) => params?.value + ' ' + (I18nManager.isRTL() ? "ريال" : "SAR")
        },
        {
            field: 'discountAmount', headerName: I18nManager.isRTL() ? "خصم المبلغ" : "Amount disc.",
            renderCell: (params) => params?.value + ' ' + (I18nManager.isRTL() ? "ريال" : "SAR")
        },
        {
            field: 'discountPercentage', headerName: I18nManager.isRTL() ? "نسبة الخصم" : "Percentage disc.",
            renderCell: (params) => params?.value + '%'
        },
        {
            field: 'totalPrice', headerName: I18nManager.isRTL() ? "السعر الكلي" : "Total Price",
            renderCell: (params) => params?.value + ' ' + (I18nManager.isRTL() ? "ريال" : "SAR")
        },
    ]

    const onReorderClick = () => {
        if (value == 0) {
            getAllOffers({ ...paginationPropData, action: 'reorder' })
        } else {
            getAllCoupons({ ...paginationPropData, action: 'reorder' })
        }
    }

    const onAgreeClick = (e) => {
        setLoading(true)
        reorderOffersDialogRef.current.call_closeReorderDialog()
        const tmp_data = e.map(item => { return item.id })
        postUpSertOffer({ data: tmp_data, action: 'reorder' }).then(res => {
            setLoading(false)
        }).catch(e => setLoading(false))
    }

    const getAllOffers = (data) => {
        setLoading(true)
        postGetAllOffers(data).then(res => {
            setLoading(false)
            if (mounted.current && res?.data?.success && value == 0) {
                const response = res.data.success
                if (data?.action == 'reorder') {
                    reorderOffersDialogRef.current.call_openReorderDialog()
                    setReorderData(response)
                } else {
                    setData(response)
                }
            }
        }).catch(e => { if (mounted.current) setLoading(false) })
    }

    const getAllCoupons = (data) => {
        setLoading(true)
        postGetAllCoupons(data).then(res => {
            setLoading(false)
            if (mounted.current && res?.data?.success && value == 1) {
                const response = res.data.success
                if (data?.action == 'reorder') {
                    setReorderData(response)
                    reorderOffersDialogRef.current.call_openReorderDialog()
                } else {
                    setData(response)
                }
            }
        }).catch(e => { if (mounted.current) setLoading(false) })
    }

    const onPageChangeProp = (data) => {
        setPaginationPropData(data)
        if (value == 0) {
            getAllOffers(data)
        } else {
            getAllCoupons(data)
        }
    }

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const onDeleteDataTableRows = (data) => {
        setLoading(true)
        if (value == 0) {
            postUpSertOffer(data).then(res => {
                setLoading(false)
                if (mounted.current && res?.data?.success) {
                    const data = res.data.success
                    setData(data)
                }
            }).catch(e => { if (mounted.current) setLoading(false) })
        } else {
            postUpSertCoupon(data).then(res => {
                setLoading(false)
                if (mounted.current && res?.data?.success) {
                    getAllCoupons(data.data)
                }
            }).catch(e => { if (mounted.current) setLoading(false) })
        }

    }

    const onRowClick = (e) => {
        if (value == 0) {
            navigate('/offer-details/' + value + '/' + e.id)
        } else {
            navigate('/coupon-details/' + value + '/' + e.id)
        }
    }

    const onCreateButtonClick = () => {
        if (value == 0) {
            navigate('/offer-details/' + value + '/create')
        } else {
            navigate('/coupon-details/' + value + '/create')
        }
    }

    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        };
    }, []);

    useEffect(() => {
        if (paginationPropData && Object.keys(paginationPropData).length > 0) {
            if (value == 0) {
                getAllOffers(paginationPropData)
            } else {
                getAllCoupons(paginationPropData)
            }
        }
    }, [value]);

    return (
        <Box sx={{ width: '100%' }}>

            <OrderingTransferListDialog ref={reorderOffersDialogRef} data={reorderData}
                onAgreeClick={onAgreeClick}
                onDisagreeClick={() => reorderOffersDialogRef.current.call_closeReorderDialog()} />

            <Box sx={{ mb: 3, display: 'flex' }}>
                <FormControl fullWidth sx={{ maxWidth: 300, mr: 1 }}>
                    <InputLabel>{I18nManager.isRTL() ? "اختار" : "Select"}</InputLabel>
                    <Select
                        fullWidth
                        value={value}
                        label={I18nManager.isRTL() ? "اختار" : "Select"}
                        onChange={handleChange}
                    >
                        {menuList.map((item, index) => (
                            <MenuItem key={index} value={item?.value}>{item?.title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {value == 0 && <Button onClick={onReorderClick} color="secondary" variant="contained">{I18nManager.isRTL() ? "إعادة ترتيب" : "Reorder"}</Button>}
            </Box>
            <DataTable columns={columns} data={data} loading={loading}
                onPageChangeProp={onPageChangeProp}
                onRowClick={onRowClick}
                onCreateButtonClick={onCreateButtonClick}
                onDeleteDataTableRows={onDeleteDataTableRows}
            />
        </Box>
    );
}

export default OffersCoupons