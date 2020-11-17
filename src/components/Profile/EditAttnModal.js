import React from "react";
import PropTypes from "prop-types";

import { useInput } from "../../hooks/InputHooks";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const EditAttnModal = ({
  id,
  attention,
  dist,
  handleEdit,
  editOpen,
  handleClose,
}) => {
  const classes = useStyles();

  const { value: attn, bind: bindAttn } = useInput(attention);

  if (!id) {
    return null;
  }

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={editOpen}
        onClose={() => handleClose(false)}
        fullWidth
        maxWidth="md"
        style={{ zIndex: "15000" }}
      >
        <DialogContent>
          <IconButton className={classes.closeButton} onClick={handleClose}>
            <CancelIcon fontSize="large" color="secondary" />
          </IconButton>
          <br />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography className={classes.headerText}>
              {`Editing Attention Line for ${dist}`}
            </Typography>
            <br />
            <TextField
              fullWidth
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="attn"
              type="text"
              label="Attention"
              {...bindAttn}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                className={classes.largeButton}
                variant="contained"
                color="secondary"
                onClick={() => {
                  handleEdit(id, attn);
                  handleClose(false);
                }}
              >
                SAVE DETAILS
              </Button>
            </div>
          </div>
          <br />
        </DialogContent>
      </Dialog>
    </div>
  );
};

EditAttnModal.propTypes = {
  id: PropTypes.string,
  attention: PropTypes.string,
  dist: PropTypes.string,
  handleEdit: PropTypes.func.isRequired,
  editOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default EditAttnModal;
