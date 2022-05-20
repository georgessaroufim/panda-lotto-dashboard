
import React, { useEffect, useRef, useState } from 'react';
import { postGetAllServices, postUpSertService } from '../../../../core/api/Api';
import { useNavigate, useParams } from 'react-router-dom'
import I18nManager from '../../../../core/I18nManager/I18nManager';
import DataTable from '../../../_components/datatable/DataTable';

const Services = () => {
    let { type, id } = useParams()
    let navigate = useNavigate()
    const mounted = useRef(true)
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)

    const columns = [
        { field: 'titleAr', headerName: (I18nManager.isRTL() ? "الاسم" : "Name") + ' (ar)', },
        { field: 'titleEn', headerName: I18nManager.isRTL() ? "الاسم" : "Name", },
        {
            field: 'price', headerName: I18nManager.isRTL() ? "السعر" : "Price",
            renderCell: (params) => params?.value + ' ' + (I18nManager.isRTL() ? "ريال" : "SAR")
        },
    ]

    const getAllServices = (data) => {
        setLoading(true)
        postGetAllServices({ ...data, general_service_id: id }).then(res => {
            setLoading(false)
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setData(data)
            }
        }).catch(e => { if (mounted.current) setLoading(false) })
    }

    const onDeleteDataTableRows = (data) => {
        setLoading(true)
        postUpSertService(data).then(res => {
            setLoading(false)
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setData(data)
            }
        }).catch(e => { if (mounted.current) setLoading(false) })
    }

    const onRowClick = (e) => {
        navigate('/service-details/' + type + '/' + e.id)
    }

    const onCreateButtonClick = () => {
        navigate('/service-details/' + type + '/create')
    }

    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        };
    }, []);

    return (
        <DataTable columns={columns} data={data} loading={loading}
            onPageChangeProp={getAllServices}
            onRowClick={onRowClick}
            onCreateButtonClick={onCreateButtonClick}
            onDeleteDataTableRows={onDeleteDataTableRows}
        />
    );
}

export default Services