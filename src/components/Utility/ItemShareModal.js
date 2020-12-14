import React, { useRef, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Snackbar from "@material-ui/core/Snackbar";
import Fade from "@material-ui/core/Fade";
import MuiAlert from "@material-ui/lab/Alert";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  shareItemModal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: "200px",
    textAlign: "center",
  },
  alertColor: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.secondary.dark
  }
}));

const FadeTransition = (props) => <Fade {...props} timeout={{enter: 250, exit: 1000}} />

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />

const ItemShareModal = ({ modalOpen, handleClose, shareLink}) => {
  const classes = useStyles();
  const copyRef = useRef(null);
  const [open, setOpen] = useCallback(useState(false))

  const handleCopy = (evt) => {
    setOpen(true);
    copyRef.current.firstChild.select();
    document.execCommand("copy")
    evt.target.focus();
  }

  useEffect(() => {
    let timeOut;
    if (open) {
      timeOut = setTimeout(()=>{setOpen(false)}, 1000)
    }
    return ()=>{clearTimeout(timeOut)}
  }, [setOpen, open])

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={modalOpen}
        disableScrollLock
        onClose={() => handleClose(false)}
        fullWidth
        maxWidth="sm"
        style={{zIndex: "15000"}}
      >
        <DialogContent>
        <IconButton className={classes.closeButton} onClick={() => handleClose(false)}>
            <CancelIcon fontSize="large" color="secondary" />
          </IconButton>
          <br />
          <div className={classes.shareItemModal}>
            <Typography className={classes.headerText}>
              Share Link:
            </Typography>
            <InputBase
              className={classes.bodyText}
              id="share-link"
              value={shareLink}
              inputProps={{ "aria-label": "naked", style:{textAlign: "center"} }}
              style={{
                readonly: "readonly",
              }}
              fullWidth
              ref={copyRef}
            />
            <Button
              className={classes.largeButton}
              variant="contained"
              color="secondary"
              onClick={handleCopy}
            >COPY LINK</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left"}}
        open={open}
        TransitionComponent={FadeTransition}
        style={{zIndex: "16000"}}
      >
        <Alert severity="info" classes={{filledInfo: classes.alertColor}}>
          Copied to Clipboard!
        </Alert>
      </Snackbar>
    </div>
  )
}

ItemShareModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  shareLink: PropTypes.string
}

export default ItemShareModal;