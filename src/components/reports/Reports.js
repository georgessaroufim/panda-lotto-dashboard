import React, { useState, useEffect, useRef } from 'react';
import { Grid, Box, TextField, Button } from '@mui/material';
import OrderCardStatistic from './orders-card-statistic/OrderCardStatistic';
import I18nManager from '../../core/I18nManager/I18nManager';
import { postGetOrdersStatistic, postGetOrdersStatisticById } from '../../core/api/Api';
import { getNumberWithFloat } from '../../core/common-service/CommonService';
import OrdersPieChartStatistic from './orders-pie-chart-statistic/OrdersPieChartStatistic';
import dayjs from 'dayjs'
import OrdersComposedChartStatistic from './orders-composed-chart-statistic/OrdersComposedChartStatistic';
import LookupSelectView from '../_components/input-multi-select/lookup-select-view/LookupSelectView';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Reports = () => {
    const mounted = useRef(true)
    const [ordersStatistic, setOrdersStatistic] = useState({})
    const [ordersServiceStatistic, setOrdersServiceStatistic] = useState({})
    const [ordersClinicStatistic, setOrdersClinicStatistic] = useState({})
    const [filter, setFilter] = useState({
        startDate: dayjs(new Date()).subtract(1, 'month').format('YYYY-MM-DD'),
        endDate: dayjs(new Date()).add(1, 'day').format('YYYY-MM-DD'),
    })

    const getOrdersStatistic = () => {
        postGetOrdersStatistic({ ...filter }).then(res => {
            if (mounted.current && res?.data?.success) {
                const response = res.data.success
                setOrdersStatistic(response)
                setOrdersServiceStatistic({ ...ordersServiceStatistic, lookups: response?.lookups })
                setOrdersClinicStatistic({ ...ordersClinicStatistic, lookups: response?.lookups })
            }
        }).catch(e => { })
    }

    const getOrdersStatisticById = (obj) => {
        postGetOrdersStatisticById(obj).then(res => {
            if (mounted.current && res?.data?.success) {
                const response = res.data.success
                if (obj?.service_id) {
                    setOrdersServiceStatistic({ ...ordersServiceStatistic, ...response })
                } else if (obj?.clinic_id) {
                    setOrdersClinicStatistic({ ...ordersClinicStatistic, ...response })
                }
            }
        }).catch(e => { })
    }

    const onInputSelectChange = (foreignKey, multiple, d) => (e, item, reason) => {
        e.preventDefault()
        if (item?.id) {
            getOrdersStatisticById({ [foreignKey]: item?.id })
        }
        if (foreignKey == 'service_id') {
            setOrdersServiceStatistic({ ...ordersServiceStatistic, [foreignKey]: item?.id });
        } else if (foreignKey == 'clinic_id') {
            setOrdersClinicStatistic({ ...ordersClinicStatistic, [foreignKey]: item?.id });
        }
    }

    const sectionBoxStyle = {
        p: 1, border: '1px solid',
        borderRadius: 2,
        borderColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
    }

    const onStartDateChange = (value) => {
        if (new Date(filter.endDate) > new Date(value)) {
            setFilter({ ...filter, startDate: value })
        }
    };
    const onEndDateChange = (value) => {
        if (new Date(value) > new Date(filter.startDate)) {
            setFilter({ ...filter, endDate: value })
        }
    };

    useEffect(() => {
        mounted.current = true
        getOrdersStatistic()
        return () => {
            mounted.current = false
        };
    }, []);

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item xs={12} sx={{ display: 'flex' }}>
                    <DatePicker
                        label={I18nManager.isRTL() ? "تاريخ البدء" : "Start Date"}
                        value={new Date(filter.startDate)}
                        onChange={onStartDateChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <Box sx={{ mx: 1 }}>
                        <DatePicker
                            label={I18nManager.isRTL() ? "تاريخ الانتهاء" : "End Date"}
                            value={new Date(filter.endDate)}
                            onChange={onEndDateChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Box>
                    <Button onClick={getOrdersStatistic} variant="contained">{I18nManager.isRTL() ? "بحث" : "Search"}</Button>
                </Grid>
                <Grid item md={3} xs={6}>
                    <OrderCardStatistic title={I18nManager.isRTL() ? "مجموع الطلبات" : "Total Orders"}
                        bgcolor="text.secondary" buttonText={ordersStatistic?.total_orders?.count ?? "-"} />
                </Grid>
                <Grid item md={3} xs={6}>
                    <OrderCardStatistic title={I18nManager.isRTL() ? "الطلبات المكتملة" : "Completed Orders"}
                        bgcolor="success.main" buttonText={(getNumberWithFloat((((ordersStatistic?.completed_orders?.count / ordersStatistic?.total_orders?.count) * 100) || 0)) + "%") + " " + ("[" + ordersStatistic?.completed_orders?.count + "/" + ordersStatistic?.total_orders?.count + "]")} />
                </Grid>
                <Grid item md={3} xs={6}>
                    <OrderCardStatistic title={I18nManager.isRTL() ? "الطلبات المعلقة" : "Pending Orders"}
                        bgcolor="primary.main" buttonText={(getNumberWithFloat((((ordersStatistic?.pending_orders?.count / ordersStatistic?.total_orders?.count) * 100) || 0)) + "%") + " " + ("[" + ordersStatistic?.pending_orders?.count + "/" + ordersStatistic?.total_orders?.count + "]")} />
                </Grid>
                <Grid item md={3} xs={6}>
                    <OrderCardStatistic title={I18nManager.isRTL() ? "الطلبات المغلقة" : "Canceled Orders"}
                        bgcolor="error.main" buttonText={(getNumberWithFloat((((ordersStatistic?.canceled_orders?.count / ordersStatistic?.total_orders?.count) * 100) || 0)) + "%") + " " + ("[" + ordersStatistic?.canceled_orders?.count + "/" + ordersStatistic?.total_orders?.count + "]")} />
                </Grid>
                <Grid item md={3} xs={6}>
                    <OrderCardStatistic title={I18nManager.isRTL() ? "إجمالي الإيرادات المتوقعة" : "EXP. Total Revenue"}
                        bgcolor="text.secondary" buttonText={getNumberWithFloat(ordersStatistic?.total_orders?.sum) + " " + (I18nManager.isRTL() ? "ريال" : "SAR")} />
                </Grid>
                <Grid item md={3} xs={6}>
                    <OrderCardStatistic title={I18nManager.isRTL() ? "متوسط./مجموع الطلبات المكتملة" : "AVG./Total Completed Revenue"}
                        bgcolor="success.main" buttonText={("A: " + getNumberWithFloat(((ordersStatistic?.completed_orders?.sum / ordersStatistic?.completed_orders?.count) || 0))) + (" T: " + getNumberWithFloat(ordersStatistic?.completed_orders?.sum)) + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")"} />
                </Grid>
                <Grid item md={3} xs={6}>
                    <OrderCardStatistic title={I18nManager.isRTL() ? "متوسط./مجموع الطلبات المعلقة" : "AVG./Total Pending Revenue"}
                        bgcolor="primary.main" buttonText={("A: " + getNumberWithFloat(((ordersStatistic?.pending_orders?.sum / ordersStatistic?.pending_orders?.count) || 0))) + (" T: " + getNumberWithFloat(ordersStatistic?.pending_orders?.sum)) + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")"} />
                </Grid>
                <Grid item md={3} xs={6}>
                    <OrderCardStatistic title={I18nManager.isRTL() ? "متوسط./مجموع الطلبات المغلقة" : "AVG./Total Canceled Revenue"}
                        bgcolor="error.main" buttonText={("A: " + getNumberWithFloat(((ordersStatistic?.canceled_orders?.sum / ordersStatistic?.canceled_orders?.count) || 0))) + (" T: " + getNumberWithFloat(ordersStatistic?.canceled_orders?.sum)) + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")"} />
                </Grid>
            </Grid>
            <Box sx={{ my: 2, ...sectionBoxStyle }}>
                <LookupSelectView onInputSelectChange={onInputSelectChange} data={ordersServiceStatistic} d='services' foreignKey='service_id' l={I18nManager.isRTL() ? "الخدمات" : "Services"} />
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item md={3} xs={6}>
                        <OrderCardStatistic title={I18nManager.isRTL() ? "إجمالي الإيرادات المتوقعة" : "EXP. Total Revenue"}
                            bgcolor="text.secondary" buttonText={ordersServiceStatistic?.total_orders ? (getNumberWithFloat(ordersServiceStatistic?.total_orders?.sum) + " " + (I18nManager.isRTL() ? "ريال" : "SAR")) : "-"} />
                    </Grid>
                    <Grid item md={3} xs={6}>
                        <OrderCardStatistic title={I18nManager.isRTL() ? "متوسط./مجموع الطلبات المكتملة" : "AVG./Total Completed Revenue"}
                            bgcolor="success.main" buttonText={ordersServiceStatistic?.completed_orders ? (("A: " + getNumberWithFloat(((ordersServiceStatistic?.completed_orders?.sum / ordersServiceStatistic?.completed_orders?.count) || 0))) + (" T: " + getNumberWithFloat(ordersServiceStatistic?.completed_orders?.sum)) + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")") : "-"} />
                    </Grid>
                    <Grid item md={3} xs={6}>
                        <OrderCardStatistic title={I18nManager.isRTL() ? "متوسط./مجموع الطلبات المعلقة" : "AVG./Total Pending Revenue"}
                            bgcolor="primary.main" buttonText={ordersServiceStatistic?.pending_orders ? (("A: " + getNumberWithFloat(((ordersServiceStatistic?.pending_orders?.sum / ordersServiceStatistic?.pending_orders?.count) || 0))) + (" T: " + getNumberWithFloat(ordersServiceStatistic?.pending_orders?.sum)) + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")") : "-"} />
                    </Grid>
                    <Grid item md={3} xs={6}>
                        <OrderCardStatistic title={I18nManager.isRTL() ? "متوسط./مجموع الطلبات المغلقة" : "AVG./Total Canceled Revenue"}
                            bgcolor="error.main" buttonText={ordersServiceStatistic?.canceled_orders ? (("A: " + getNumberWithFloat(((ordersServiceStatistic?.canceled_orders?.sum / ordersServiceStatistic?.canceled_orders?.count) || 0))) + (" T: " + getNumberWithFloat(ordersServiceStatistic?.canceled_orders?.sum)) + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")") : "-"} />
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ ...sectionBoxStyle }}>
                <LookupSelectView onInputSelectChange={onInputSelectChange} data={ordersServiceStatistic} d='clinics' foreignKey='clinic_id' l={I18nManager.isRTL() ? "العيادات" : "Clinics"} />
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item md={3} xs={6}>
                        <OrderCardStatistic title={I18nManager.isRTL() ? "إجمالي الإيرادات المتوقعة" : "EXP. Total Revenue"}
                            bgcolor="text.secondary" buttonText={ordersClinicStatistic?.total_orders ? (getNumberWithFloat(ordersClinicStatistic?.total_orders?.sum) + " " + (I18nManager.isRTL() ? "ريال" : "SAR")) : "-"} />
                    </Grid>
                    <Grid item md={3} xs={6}>
                        <OrderCardStatistic title={I18nManager.isRTL() ? "متوسط./مجموع الطلبات المكتملة" : "AVG./Total Completed Revenue"}
                            bgcolor="success.main" buttonText={ordersClinicStatistic?.completed_orders ? (("A: " + getNumberWithFloat(((ordersClinicStatistic?.completed_orders?.sum / ordersClinicStatistic?.completed_orders?.count) || 0))) + (" T: " + getNumberWithFloat(ordersClinicStatistic?.completed_orders?.sum)) + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")") : "-"} />
                    </Grid>
                    <Grid item md={3} xs={6}>
                        <OrderCardStatistic title={I18nManager.isRTL() ? "متوسط./مجموع الطلبات المعلقة" : "AVG./Total Pending Revenue"}
                            bgcolor="primary.main" buttonText={ordersClinicStatistic?.pending_orders ? (("A: " + getNumberWithFloat(((ordersClinicStatistic?.pending_orders?.sum / ordersClinicStatistic?.pending_orders?.count) || 0))) + (" T: " + getNumberWithFloat(ordersClinicStatistic?.pending_orders?.sum)) + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")") : "-"} />
                    </Grid>
                    <Grid item md={3} xs={6}>
                        <OrderCardStatistic title={I18nManager.isRTL() ? "متوسط./مجموع الطلبات المغلقة" : "AVG./Total Canceled Revenue"}
                            bgcolor="error.main" buttonText={ordersClinicStatistic?.canceled_orders ? (("A: " + getNumberWithFloat(((ordersClinicStatistic?.canceled_orders?.sum / ordersClinicStatistic?.canceled_orders?.count) || 0))) + (" T: " + getNumberWithFloat(ordersClinicStatistic?.canceled_orders?.sum)) + " (" + (I18nManager.isRTL() ? "ريال" : "SAR") + ")") : "-"} />
                    </Grid>
                </Grid>
            </Box>
            <Grid container spacing={3}>
                <Grid item md={4} xs={6}>
                    {ordersStatistic?.orders_by_status && <OrdersPieChartStatistic title={I18nManager.isRTL() ? "الطلبات حسب الحالة" : "Orders By Status"} data={ordersStatistic?.orders_by_status} />}
                </Grid>
                <Grid item md={4} xs={6}>
                    {ordersStatistic?.orders_by_clinic && <OrdersPieChartStatistic title={I18nManager.isRTL() ? "الطلبات حسب العيادة" : "Orders By Clinic"} data={ordersStatistic?.orders_by_clinic} />}
                </Grid>
                <Grid item md={4} xs={6}>
                    {ordersStatistic?.orders_by_source && <OrdersPieChartStatistic title={I18nManager.isRTL() ? "الطلبات حسب المصدر" : "Orders By Source"} data={ordersStatistic?.orders_by_source} />}
                </Grid>
                <Grid item md={6} xs={12}>
                    {ordersStatistic?.orders_by_receptionist_acquisition_rate && <OrdersComposedChartStatistic title={I18nManager.isRTL() ? "الطلبات حسب المصدر" : "Orders By Source"} data={ordersStatistic?.orders_by_receptionist_acquisition_rate} />}
                </Grid>
            </Grid>
        </Box>
    );
}
export default Reports
