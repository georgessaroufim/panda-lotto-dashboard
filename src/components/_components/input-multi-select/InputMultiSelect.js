import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
const InputMultiSelect = ({ activeEl, options, value, onChange, getOptionLabel, label, disabled, multiple = false, required = false }) => {
    return (
        <Autocomplete
            multiple={multiple}
            disabled={disabled}
            clearOnEscape
            options={
                // options.length > 1    ==> to not keep 'All' if all options are selected
                // activeEl?.length == 0 ==> to not keep 'All' if one option is selected
                (multiple && options?.length > 1 && activeEl?.length == 0) ?
                    [{ nameEn: 'All', nameAr: 'الكل', id: 0 }, ...options] :
                    [...options]
            }
            limitTags={5}
            getOptionLabel={getOptionLabel}
            value={value}
            onChange={onChange}
            disableCloseOnSelect={multiple}
            filterSelectedOptions
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder={label}
                    required={required}
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                    }}
                />
            )}
        />
    )
}

export default React.memo(InputMultiSelect)