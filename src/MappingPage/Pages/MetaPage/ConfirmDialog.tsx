import React from "react"
import Dialog from "@material-ui/core/Dialog"
import { observable } from "mobx"
import { useObserver } from "mobx-react-lite"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import { useTranslation } from "react-i18next"
import DialogContentText from "@material-ui/core/DialogContentText"


const dialog = observable({
  open: false,
  title: "",
  content: "",
  confirm: () => { }
})

export function openConfirm(title: string, content: string, confirm: () => void) {
  dialog.open = true
  dialog.content = content
  dialog.title = title
  dialog.confirm = confirm
}

const ConfirmDialog = () => {

  const { t } = useTranslation()

  return useObserver(() =>
    <Dialog open={dialog.open} onClose={() => dialog.open = false}>
      <DialogTitle>{dialog.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialog.content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dialog.open = false} color="primary" autoFocus>
          {t("Cancel")}
        </Button>
        <Button onClick={() => { dialog.confirm(); dialog.open = false }} color="secondary">
          {t("Reset")}
        </Button>
      </DialogActions>
    </Dialog >)
}

export default ConfirmDialog