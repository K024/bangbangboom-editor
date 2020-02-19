import React from 'react'
import clsx from 'clsx'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'
import { orange, lightGreen, red, lightBlue } from '@material-ui/core/colors'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import WarningIcon from '@material-ui/icons/Warning'
import { makeStyles } from '@material-ui/core/styles'
import { observable } from 'mobx'
import { useObserver } from 'mobx-react-lite'

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
}

const Message = observable({
  message: "",
  open: false,
  type: "info" as keyof typeof variantIcon,
})

const useStyles = makeStyles(theme => ({
  success: { backgroundColor: lightGreen[700], },
  error: { backgroundColor: red[600], },
  info: { backgroundColor: lightBlue[600], },
  warning: { backgroundColor: orange[700], },
  icon: { fontSize: 20, },
  iconVariant: { opacity: 0.9, marginRight: theme.spacing(1), },
  message: { display: 'flex', alignItems: 'center', },
}))

export function userMessage(message: string, type = "info" as keyof typeof variantIcon) {
  Message.message = message
  Message.type = type
  Message.open = true
}

const handleClose = (event: any, reason?: string) => {
  if (reason === 'clickaway') return
  Message.open = false
}

export default () => {

  const cn = useStyles()
  const Icon = variantIcon[Message.type]

  return useObserver(() => (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={Message.open}
      autoHideDuration={5000}
      onClose={handleClose}
      key={Message.message + Message.type}
    >
      <SnackbarContent
        className={cn[Message.type]}
        message={
          <span className={cn.message}>
            <Icon className={clsx(cn.icon, cn.iconVariant)} />
            {Message.message}
          </span>
        }
        action={[
          <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon className={cn.icon} />
          </IconButton>,
        ]}
      />
    </Snackbar>
  ))
}
