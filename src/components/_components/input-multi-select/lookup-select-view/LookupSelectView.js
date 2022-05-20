import React from 'react'
import { Grid } from "@mui/material";
import InputMultiSelect from '../InputMultiSelect';
import I18nManager from '../../../../core/I18nManager/I18nManager';

const LookupSelectView = ({ onInputSelectChange, data, d, foreignKey, l, multiple = false, required = false, disabled = false }) => {
    const isActiveArr = [{ id: 1, nameEn: 'Yes', nameAr: 'نعم' }, { id: 0, nameEn: 'No', nameAr: 'كلا' }]
    var activeEl = null
    if (multiple) {
        const arr = (data?.[foreignKey])
        activeEl = data?.lookups?.[d]?.filter(f => arr?.some(item => item == f?.id));
        // activeEl = data?.lookups?.[d]?.filter(el => el.id == data?.[foreignKey])
    } else if (foreignKey == 'isActive') {
        activeEl = isActiveArr?.find(el => el.id == data?.[foreignKey])
    } else {
        activeEl = data?.lookups?.[d]?.find(el => el.id == data?.[foreignKey])
    }
    return (
        <Grid item md={6} xs={12}>
            <InputMultiSelect
                activeEl={activeEl}
                label={l}
                disabled={disabled}
                multiple={multiple}
                required={required}
                onChange={onInputSelectChange(foreignKey, multiple, d)}
                options={(d == 'isActiveLookup' ? isActiveArr : (data?.lookups?.[d] || [])) || []}
                value={activeEl}
                getOptionLabel={(option) =>
                    (option?.firstName ? (option?.firstName + " " + option?.lastName) : undefined) ||
                    (option?.[I18nManager.isRTL() ? "nameAr" : "nameEn"]) ||
                    (option?.[I18nManager.isRTL() ? "titleAr" : "titleEn"]) ||
                    (option?.firstNameAr ? (option?.[I18nManager.isRTL() ? "firstNameAr" : "firstNameEn"] + " " + option?.[I18nManager.isRTL() ? "lastNameAr" : "lastNameEn"]) : undefined) ||
                    (option?.startDate ? option?.startDate : undefined)
                }
            />
        </Grid>
    )
}

export default LookupSelectView