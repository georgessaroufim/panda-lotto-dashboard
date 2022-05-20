import React, { useEffect, useRef, useState } from 'react';
import { MEDIA_URL, postGetAllPatients, postUpSertPatient } from '../../core/api/Api';
import I18nManager from '../../core/I18nManager/I18nManager';
import DataTable from '../_components/datatable/DataTable';
import { Avatar } from '@mui/material';
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';

const Patients = () => {
    const mounted = useRef(true)
    let navigate = useNavigate()
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)

    const columns = [
        {
            field: 'img', headerName: I18nManager.isRTL() ? "الصورة" : "Avatar",
            renderCell: (params) => (
                <Avatar alt={params?.row?.firstName?.toString()} src={params?.value ? (MEDIA_URL + params?.value) : null} />
            )
        },
        { field: 'firstName', headerName: I18nManager.isRTL() ? "الاسم" : "Name", },
        { field: 'lastName', headerName: I18nManager.isRTL() ? "الكنية" : "Last Name", },
        {
            field: 'created_at', headerName: I18nManager.isRTL() ? "أنشئت في" : "Created At",
            renderCell: (params) => dayjs(new Date(params?.value)).format('lll')
        },
    ]

    const onDeleteDataTableRows = (data) => {
        setLoading(true)
        postUpSertPatient(data).then(res => {
            setLoading(false)
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setData(data)
            }
        }).catch(e => { if (mounted.current) setLoading(false) })
    }

    const onRowClick = (e) => {
        navigate('/patient-details/' + e.id)
    }

    const onCreateButtonClick = () => {
        navigate('/patient-details/create')
    }

    const getAllPatients = (data) => {
        setLoading(true)
        postGetAllPatients(data).then(res => {
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
            onPageChangeProp={getAllPatients}
            onRowClick={onRowClick}
            onCreateButtonClick={onCreateButtonClick}
            onDeleteDataTableRows={onDeleteDataTableRows}
        />
    );
}

export default Patients