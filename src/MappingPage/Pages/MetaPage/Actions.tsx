import React from "react"
import Grid from "@material-ui/core/Grid"
import { useTranslation } from "react-i18next"
import Button from "@material-ui/core/Button"
import { openDialog } from "./CopyDialog"
import { userMessage } from "../../../Common/Components/GlobalSnackbar"
import { toBestdoriFormat } from "../../../MapFormats/bestdori"
import { scope } from "../../../MappingScope/scope"
import { openConfirm } from "./ConfirmDialog"
import { openFile, downLoadFile } from "../../../Common/utils"
import { fromBBBv1Format } from "../../../MapFormats/bbbv1"
import { EditMap } from "../../../MappingScope/EditMap"


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

  const exportEditorMap = () => {
    const content = EditMap.toJsonString(scope.map as any)
    downLoadFile(content)
  }

  const importEditorMap = async () => {
    try {
      const content = await openFile("*")
      scope.reset(EditMap.fromJson(content))
      userMessage(t("Import success"), "success")
    } catch (error) {
      if (!error) return
      userMessage(t("Error import"), "error")
      throw error
    }
  }

  return (
    <Grid style={{margin: "20px 0"}} item container direction="column" spacing={2}>
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
        <Button fullWidth variant="outlined" onClick={exportEditorMap}>
          {t("Download editor format map")}
        </Button>
      </Grid>
      <Grid item>
        <Button fullWidth variant="outlined" onClick={importEditorMap}>
          {t("Import editor format map (current map will loss)")}
        </Button>
      </Grid>
      <Grid item>
        <Button fullWidth variant="outlined" onClick={reset}>
          {t("Reset current map")}
        </Button>
      </Grid>
    </Grid>)
}

export default Actions