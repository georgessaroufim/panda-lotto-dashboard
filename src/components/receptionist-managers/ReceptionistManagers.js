import React, { useEffect, useRef, useState } from 'react';
import { MEDIA_URL, postGetAllReceptionistManagers, postUpSertReceptionistManager } from '../../core/api/Api';
import I18nManager from '../../core/I18nManager/I18nManager';
import DataTable from '../_components/datatable/DataTable';
import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ReceptionistManagers = () => {
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
        { field: 'firstNameAr', headerName: (I18nManager.isRTL() ? "الاسم" : "Name") + ' (ar)', },
        { field: 'lastNameAr', headerName: (I18nManager.isRTL() ? "الكنية" : "Last Name") + ' (ar)', },
        { field: 'firstNameEn', headerName: I18nManager.isRTL() ? "الاسم" : "Name", },
        { field: 'lastNameEn', headerName: I18nManager.isRTL() ? "الكنية" : "Last Name", },
    ]

    const onDeleteDataTableRows = (data) => {
        setLoading(true)
        postUpSertReceptionistManager(data).then(res => {
            setLoading(false)
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setData(data)
            }
        }).catch(e => { if (mounted.current) setLoading(false) })
    }

    const onRowClick = (e) => {
        navigate('/receptionist-manager-details/' + e.id)
    }

    const onCreateButtonClick = () => {
        navigate('/receptionist-manager-details/create')
    }

    const getAllReceptionistManagers = (data) => {
        setLoading(true)
        postGetAllReceptionistManagers(data).then(res => {
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
            onPageChangeProp={getAllReceptionistManagers}
            onRowClick={onRowClick}
            onCreateButtonClick={onCreateButtonClick}
            onDeleteDataTableRows={onDeleteDataTableRows}
        />
    );
}

export default ReceptionistManagers