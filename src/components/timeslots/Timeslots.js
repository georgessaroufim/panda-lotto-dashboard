import React, { useEffect, useRef, useState } from 'react';
import { postGetAllTimeslots, postUpSertTimeslot } from '../../core/api/Api';
import I18nManager from '../../core/I18nManager/I18nManager';
import DataTable from '../_components/datatable/DataTable';
import dayjs from 'dayjs'
import TimeslotDeleteByDateDialog from './timeslot-delete-by-date-dialog/TimeslotDeleteByDateDialog';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Timeslots = () => {
    const mounted = useRef(true)
    let navigate = useNavigate()
    const deleteDialogRef = useRef(null)
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)

    const columns = [
        {
            field: 'complex_clinic', headerName: I18nManager.isRTL() ? "مجمع عيادات" : "Complex Clinic",
            renderCell: (params) => (params?.value && params?.value?.[I18nManager.isRTL() ? "nameAr" : "nameEn"])
        },
        {
            field: 'clinic', headerName: I18nManager.isRTL() ? "العيادة" : "Clinic",
            renderCell: (params) => (params?.value && params?.value?.[I18nManager.isRTL() ? "nameAr" : "nameEn"])
        },
        {
            field: 'doctor', headerName: I18nManager.isRTL() ? "الطبيب" : "Doctor",
            renderCell: (params) => (
                params?.value &&
                params?.value?.[I18nManager.isRTL() ? "firstNameAr" : "firstNameEn"] + ' ' + params?.value?.[I18nManager.isRTL() ? "lastNameAr" : "lastNameEn"]
            )
        },
        {
            field: 'service', headerName: I18nManager.isRTL() ? "الخدمة" : "Clinic",
            renderCell: (params) => (params?.value && params?.value?.[I18nManager.isRTL() ? "titleAr" : "titleEn"])
        },
        {
            field: 'offer', headerName: I18nManager.isRTL() ? "العرض" : "Offer",
            renderCell: (params) => (params?.value && params?.value?.[I18nManager.isRTL() ? "titleAr" : "titleEn"])
        },
        {
            field: 'startDate', headerName: I18nManager.isRTL() ? "تاريخ البدء" : "Start Date",
            renderCell: (params) => (params?.value && dayjs(params?.value).format('lll'))
        },
        {
            field: 'endDate', headerName: I18nManager.isRTL() ? "تاريخ الانتهاء" : "End Date",
            renderCell: (params) => (params?.value && dayjs(params?.value).format('lll'))
        },
    ]

    const onDeleteDataTableRows = (data) => {
        setLoading(true)
        deleteDialogRef.current.call_closeDeleteDialog()
        postUpSertTimeslot(data).then(res => {
            setLoading(false)
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setData(data)
            }
        }).catch(e => { if (mounted.current) setLoading(false) })
    }

    const onRowClick = (e) => {
        navigate('/timeslot-details/' + e.id)
    }

    const onCreateButtonClick = (e) => {
        navigate('/timeslot-details/create')
    }

    const getAllTimeslots = (data) => {
        setLoading(true)
        postGetAllTimeslots(data).then(res => {
            setLoading(false)
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setData(data)
            }
        }).catch(e => { if (mounted.current) setLoading(false) })
    }

    const onDeleteDialogAgreePress = ({ filter, selectedDays }) => () => {
        const datatableFilter = JSON.parse(sessionStorage.getItem('datatable-filter'))
        onDeleteDataTableRows({ ...filter, selectedDays, action: 'delete-by-date', ...datatableFilter })
    }

    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        };
    }, []);

    return (
        <div>
            <Button onClick={() => deleteDialogRef.current.call_openDeleteDialog()} color="warning" variant="contained">
                {I18nManager.isRTL() ? "حذف حسب التاريخ" : "Delete By Date"}
            </Button>

            <TimeslotDeleteByDateDialog ref={deleteDialogRef} onDeleteDialogAgreePress={onDeleteDialogAgreePress} />
            <DataTable columns={columns} data={data} loading={loading}
                onPageChangeProp={getAllTimeslots}
                onRowClick={onRowClick}
                onCreateButtonClick={onCreateButtonClick}
                onDeleteDataTableRows={onDeleteDataTableRows}
            />
        </div>
    );
}

export default Timeslots