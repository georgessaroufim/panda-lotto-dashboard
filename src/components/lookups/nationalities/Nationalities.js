import React, { useEffect, useRef, useState } from 'react';
import { MEDIA_URL, postGetAllNationalities, postUpSertNationality } from '../../../core/api/Api';
import I18nManager from '../../../core/I18nManager/I18nManager';
import DataTable from '../../_components/datatable/DataTable';
import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Nationalities = () => {
    const mounted = useRef(true)
    let navigate = useNavigate()
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)

    const columns = [
        {
            field: 'img', headerName: I18nManager.isRTL() ? "الصورة" : "Avatar",
            renderCell: (params) => (
                <Avatar alt={params?.row?.[I18nManager.isRTL() ? "nameAr" : "nameEn"]?.toString()} src={params?.value ? (MEDIA_URL + params?.value) : null} />
            )
        },
        { field: 'nameAr', headerName: (I18nManager.isRTL() ? "الاسم" : "Name") + ' (ar)', },
        { field: 'nameEn', headerName: I18nManager.isRTL() ? "الاسم" : "Name", },
    ]

    const getAllNationalities = (data) => {
        setLoading(true)
        postGetAllNationalities(data).then(res => {
            setLoading(false)
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setData(data)
            }
        }).catch(e => { if (mounted.current) setLoading(false) })
    }

    const onDeleteDataTableRows = (data) => {
        setLoading(true)
        postUpSertNationality(data).then(res => {
            setLoading(false)
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setData(data)
            }
        }).catch(e => { if (mounted.current) setLoading(false) })
    }

    const onRowClick = (e) => {
        navigate('/nationality-details/' + e.id)
    }

    const onCreateButtonClick = () => {
        navigate('/nationality-details/create')
    }

    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        };
    }, []);

    return (
        <DataTable columns={columns} data={data} loading={loading}
            onPageChangeProp={getAllNationalities}
            onRowClick={onRowClick}
            onCreateButtonClick={onCreateButtonClick}
            onDeleteDataTableRows={onDeleteDataTableRows}
        />
    );
}

export default Nationalities