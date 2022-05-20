import React from 'react'
import { Button, CircularProgress } from '@mui/material'
import { green } from '@mui/material/colors';

const ButtonWithLoading = ({ loading, success, text, onClick }) => {

    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };

    return (
        <Button type="submit" variant="contained" sx={buttonSx} onClick={onClick} disabled={loading}>
            {text}
            {loading && (
                <CircularProgress
                    size={24}
                    sx={{ color: green[500], position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px', }}
                />
            )}
        </Button>
    )
}

export default ButtonWithLoading