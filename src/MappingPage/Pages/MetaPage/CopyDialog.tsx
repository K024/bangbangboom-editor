import React from "react"
import Dialog from "@material-ui/core/Dialog"
import { observable, action } from "mobx"
import { useObserver } from "mobx-react-lite"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import { useTranslation } from "react-i18next"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  paper: { width: "calc(60vw + 200px)" }
}))

const dialog = observable({
  open: false,
  content: "",
  title: ""
})

export const openDialog = action(function (title: string, content: string) {
  dialog.open = true
  dialog.content = content
  dialog.title = title
})

const copy = () => {
  navigator.clipboard.writeText(dialog.content)
}

const onfocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
  e.target.select()
}

const CopyDialog = () => {

  const cn = useStyles()
  const { t } = useTranslation()

  return useObserver(() =>
    <Dialog open={dialog.open} onClose={() => dialog.open = false} classes={{ paper: cn.paper }}>
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