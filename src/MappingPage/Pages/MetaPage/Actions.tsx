import React from "react"
import Grid from "@material-ui/core/Grid"
import { useTranslation } from "react-i18next"
import Button from "@material-ui/core/Button"
import { openDialog } from "./CopyDialog"
import { userMessage } from "../../../Common/Components/GlobalSnackbar"
import { toBestdoriFormat } from "../../../MapFormats/bestdori"
import { scope } from "../../../MappingScope/scope"
import { openConfirm } from "./ConfirmDialog"
import { openFile } from "../../../Common/utils"
import { fromBBBv1Format } from "../../../MapFormats/bbbv1"


const Actions = () => {

  const { t } = useTranslation()

  const importBBBv1 = async () => {
    try {
      const content = await openFile("*")
      scope.reset(fromBBBv1Format(content))
      userMessage(t("Import success"), "success")
    } catch (error) {
      if (!error) return
      userMessage(t("Error import"), "error")
      throw error
    }
  }

  const exportBestdori = () => {
    try {
      const content = toBestdoriFormat((scope.map as any).state)
      openDialog(t("Export Bestdori format map"), content)
    } catch (error) {
      openDialog(t("An error occurred during export"), t("" + error))
      userMessage(t("Error export"), "error")
      throw error
    }
  }

  const reset = () => {
    openConfirm(
      t("Are you sure to reset current map?"),
      t("This action can not be reverted. Please make sure you have backed up your map."),
      () => {
        scope.reset()
        userMessage(t("Reset success"), "success")
      })
  }


  return (<>
    <Grid item>
      <Button fullWidth variant="outlined" onClick={importBBBv1}>
        {t("Import bangbangboom format v1 (current map will loss)")}
      </Button>
    </Grid>
    <Grid item>
      <Button fullWidth variant="outlined" onClick={exportBestdori}>
        {t("Export Bestdori format map")}
      </Button>
    </Grid>
    <Grid item>
      <Button fullWidth variant="outlined" onClick={reset}>
        {t("Reset current map")}
      </Button>
    </Grid>
  </>)
}

export default Actions