import React from 'react'
import { Grid, Typography } from '@mui/material'
import I18nManager from '../../../core/I18nManager/I18nManager'

const ComingSoon = () => {
    return (
        <Grid
            container
            display="flex"
            minHeight="80vh"
            minWidth="100%"
            spacing={0}
            alignItems="center"
            justifyContent="center"
        >
            <Typography>
                {I18nManager.isRTL() ? "قريبا" : "Coming Soon"}...
            </Typography>
        </Grid>
    )
}
export default ComingSoon