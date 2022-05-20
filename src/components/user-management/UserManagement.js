import React, { useEffect, useRef, useState } from 'react';
import { postGetAllUserTypes, postGetUsersByUserTypeId } from '../../core/api/Api';
import I18nManager from '../../core/I18nManager/I18nManager';
import DataTable from '../_components/datatable/DataTable';
import { FormControl, InputLabel, Box, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
    let navigate = useNavigate()
    var paginationPropData = {}

    const mounted = useRef(true)
    const [menuList, setMenuList] = useState([])
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState(1);

    const patient_columns = [
        { field: 'firstName', headerName: I18nManager.isRTL() ? "الاسم" : "Name", },
        { field: 'lastName', headerName: I18nManager.isRTL() ? "الكنية" : "Last Name", },
    ]

    const doctor_columns = [
        { field: 'firstNameAr', headerName: (I18nManager.isRTL() ? "الاسم" : "Name") + ' (ar)', },
        { field: 'lastNameAr', headerName: (I18nManager.isRTL() ? "الكنية" : "Last Name") + ' (ar)', },
        { field: 'firstNameEn', headerName: I18nManager.isRTL() ? "الاسم" : "Name", },
        { field: 'lastNameEn', headerName: I18nManager.isRTL() ? "الكنية" : "Last Name", },
    ]

    const clinic_columns = [
        { field: 'nameAr', headerName: (I18nManager.isRTL() ? "الاسم" : "Name") + ' (ar)', },
        { field: 'nameEn', headerName: I18nManager.isRTL() ? "الاسم" : "Name", },
    ]
    const complex_clinic_columns = [
        { field: 'nameAr', headerName: (I18nManager.isRTL() ? "الاسم" : "Name") + ' (ar)', },
        { field: 'nameEn', headerName: I18nManager.isRTL() ? "الاسم" : "Name", },
    ]

    const getUsersByUserTypeId = (data) => {
        setLoading(true)
        postGetUsersByUserTypeId({ ...data, user_type_id: value }).then(res => {
            setLoading(false)
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setData(data)
            }
        }).catch(e => { if (mounted.current) setLoading(false) })
    }

    const onPageChangeProp = (data) => {
        paginationPropData = data
        getUsersByUserTypeId(data)
    }

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const onRowClick = (e) => {
        switch (value) {
            case 1:
                navigate('/patient-details/' + e.id)
                break;
            case 2:
                navigate('/doctor-details/' + e.id)
                break;
            case 3:
                navigate('/clinic-details/' + e.id)
                break;
            case 4:
                navigate('/complex-clinic-details/' + e.id)
                break;
            case 5:
                navigate('/receptionist-details/' + e.id)
                break;
            case 6:
                navigate('/receptionist-manager-details/' + e.id)
                break;
            case 7:
                navigate('/administrator-details/' + e.id)
                break;
            default:
                break;
        }
    }

    const getTableColumns = () => {
        switch (value) {
            case 1:
                return patient_columns;
            case 2:
            case 5:
            case 6:
            case 7:
                return doctor_columns;
            case 3:
                return clinic_columns;
            case 4:
                return complex_clinic_columns;
            default:
                break;
        }
    }

    const onCreateButtonClick = () => {
        switch (value) {
            case 1:
                navigate('/patient-details/create')
                break;
            case 2:
                navigate('/doctor-details/create')
                break;
            case 3:
                navigate('/clinic-details/create')
                break;
            case 4:
                navigate('/complex-clinic-details/create')
                break;
            case 5:
                navigate('/receptionist-details/create')
                break;
            case 6:
                navigate('/receptionist-manager-details/create')
                break;
            default:
                break;
        }
    }

    const getAllUserTypes = () => {
        postGetAllUserTypes().then(res => {
            if (mounted.current && res?.data?.success) {
                const data = res.data.success
                setMenuList(data)
            }
        }).catch(e => { })
    }

    useEffect(() => {
        mounted.current = true
        getAllUserTypes()
        return () => {
            mounted.current = false
        };
    }, []);

    useEffect(() => {
        if (paginationPropData) {
            getUsersByUserTypeId(paginationPropData)
        }
    }, [value]);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 3, maxWidth: 300, borderBottom: 1, borderColor: 'divider' }}>
                <FormControl fullWidth>
                    <InputLabel>{I18nManager.isRTL() ? "اختار" : "Select"}</InputLabel>
                    <Select
                        value={value}
                        label={I18nManager.isRTL() ? "اختار" : "Select"}
                        onChange={handleChange}
                    >
                        {menuList.map((item, index) => (
                            <MenuItem key={index} value={item?.id}>{item?.[I18nManager.isRTL() ? "nameAr" : "nameEn"]}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <DataTable columns={getTableColumns()} data={data} loading={loading}
                onPageChangeProp={onPageChangeProp} onRowClick={onRowClick} onCreateButtonClick={onCreateButtonClick} />
        </Box>
    );
}

export default UserManagement