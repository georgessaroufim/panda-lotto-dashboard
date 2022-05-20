import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postGetAllInsurances, postUpSertInsurance } from '../../../core/api/Api';
import I18nManager from '../../../core/I18nManager/I18nManager';
import DataTable from '../../_components/datatable/DataTable';

const Insurances = () => {
    const mounted = useRef(true)
    let navigate = useNavigate()
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)

    const columns = [
        { field: 'nameAr', headerName: (I18nManager.isRTL() ? "الاسم" : "Name") + ' (ar)', },
        { field: 'nameEn', headerName: I18nManager.isRTL() ? "الاسم" : "Name", },
    ]

    const getAllInsurances = (data) => {
        setLoading(true)
        postGetAllInsurances(data).then(res => {
            setLoading(false)
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setData(data)
            }
        }).catch(e => { if (mounted.current) setLoading(false) })
    }

    const onDeleteDataTableRows = (data) => {
        setLoading(true)
        postUpSertInsurance(data).then(res => {
            setLoading(false)
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setData(data)
            }
        }).catch(e => { if (mounted.current) setLoading(false) })
    }

    const onRowClick = (e) => {
        navigate('/insurance-details/' + e.id)
    }

    const onCreateButtonClick = () => {
        navigate('/insurance-details/create')
    }

    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        };
    }, []);

    return (
        <DataTable columns={columns} data={data} loading={loading}
            onPageChangeProp={getAllInsurances}
            onRowClick={onRowClick}
            onCreateButtonClick={onCreateButtonClick}
            onDeleteDataTableRows={onDeleteDataTableRows}
        />
    );
}

export default Insurances