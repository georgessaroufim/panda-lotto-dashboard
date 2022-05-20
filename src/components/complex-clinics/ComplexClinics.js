import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postGetAllComplexClinics, postUpSertComplexClinic } from '../../core/api/Api';
import I18nManager from '../../core/I18nManager/I18nManager';
import DataTable from '../_components/datatable/DataTable';

const ComplexClinics = () => {
    let navigate = useNavigate()
    const mounted = useRef(true)
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)

    const columns = [
        { field: 'nameAr', headerName: (I18nManager.isRTL() ? "الاسم" : "Name") + ' (ar)', },
        { field: 'nameEn', headerName: I18nManager.isRTL() ? "الاسم" : "Name", },
    ]

    const getAllComplexClinics = (data) => {
        setLoading(true)
        postGetAllComplexClinics(data).then(res => {
            setLoading(false)
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setData(data)
            }
        }).catch(e => { if (mounted.current) setLoading(false) })
    }

    const onDeleteDataTableRows = (data) => {
        setLoading(true)
        postUpSertComplexClinic(data).then(res => {
            setLoading(false)
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setData(data)
            }
        }).catch(e => { if (mounted.current) setLoading(false) })
    }

    const onRowClick = (e) => {
        navigate('/complex-clinic-details/' + e.id)
    }

    const onCreateButtonClick = () => {
        navigate('/complex-clinic-details/create')
    }

    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        };
    }, []);

    return (
        <DataTable columns={columns} data={data} loading={loading}
            onPageChangeProp={getAllComplexClinics}
            onRowClick={onRowClick}
            onCreateButtonClick={onCreateButtonClick}
            onDeleteDataTableRows={onDeleteDataTableRows}
        />
    );
}

export default ComplexClinics