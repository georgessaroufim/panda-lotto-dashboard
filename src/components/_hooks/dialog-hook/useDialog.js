import React, { useCallback, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const useDialog = ({ title }) => {

    const [isOpen, setIsOpen] = useState(false)

    const open = useCallback(() => {
        setIsOpen(true)
    }, [isOpen])

    const close = useCallback(() => {
        setIsOpen(false)
    }, [isOpen])

    const DialogWrapper = useCallback(({ children, actions }) => (
        <Dialog onClose={close} open={isOpen}>
            {title && <DialogTitle>
                {title}
                <IconButton onClick={close} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500], }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>}
            {children && <DialogContent>{children}</DialogContent>}
            {actions && <DialogActions>{actions}</DialogActions>}
        </Dialog >
    ), [open, close, title])

    return [DialogWrapper, open, close]

}
export default useDialog