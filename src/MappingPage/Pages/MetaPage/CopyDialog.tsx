import React from "react"
import Dialog from "@material-ui/core/Dialog"
import { observable } from "mobx"
import { useObserver } from "mobx-react-lite"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import { useTranslation } from "react-i18next"


const dialog = observable({
  open: false,
  content: "",
  title: ""
})

export function openDialog(title: string, content: string) {
  dialog.open = true
  dialog.content = content
  dialog.title = title
}

const CopyDialog = () => {

  const copy = () => {
    navigator.clipboard.writeText(dialog.content)

  }

  const onfocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.select()
  }

  const { t } = useTranslation()

  return useObserver(() =>
    <Dialog open={dialog.open} onClose={() => dialog.open = false}>
      <DialogTitle>{dialog.title}</DialogTitle>
      <DialogContent>
        <TextField autoFocus onFocus={onfocus} fullWidth multiline rowsMax={20} variant="outlined" value={dialog.content} />
      </DialogContent>
      <DialogActions>
        <Button onClick={copy} color="primary">
          {t("Copy")}
        </Button>
        <Button onClick={() => dialog.open = false} color="primary">
          {t("Close")}
        </Button>
      </DialogActions>
    </Dialog >)
}

export default CopyDialog