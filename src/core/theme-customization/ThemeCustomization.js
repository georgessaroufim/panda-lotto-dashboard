import React, { Suspense } from 'react';
import { Backdrop, CssBaseline, CircularProgress, } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import { getCookie } from '../common-service/CommonService';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const ThemeCustomization = ({ children }) => {
    const dir = getCookie('dir')

    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(
        () => createTheme({
            palette: {
                primary: {
                    main: "#ffd433"
                },
                mode: prefersDarkMode ? 'dark' : 'light',
            },
            direction: 'ltr'
        }),
        [prefersDarkMode, dir],
    );
    return (
        <Suspense fallback={
            <Backdrop
                open={true}
                sx={{
                    backgroundColor: '#000', color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 10
                }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        }>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                {theme.direction !== 'rtl' ?
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        {children}
                    </ThemeProvider>
                    :
                    <CacheProvider value={cacheRtl}>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            {children}
                        </ThemeProvider>
                    </CacheProvider>}
            </LocalizationProvider>
        </Suspense>
    );
}

export default ThemeCustomization