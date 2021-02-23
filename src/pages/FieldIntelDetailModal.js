import React from "react";
import PropTypes from "prop-types";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

import CancelIcon from "@material-ui/icons/Cancel";

const programImgs = ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1607024522/Select/Group_9_1_c6xqda.png"]

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  previewGrid: {
    display: "flex",
    justifyContent: "space-around",
  },
  dialogGrid: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  largeImageWrapper: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "fit-content",
  },
  largeImage: {
    width: "100%",
    height: "auto",
  },
  itemTitle: {
    display: "flex",
    alignItems: "center",
  },
  itemNumber: {
    marginLeft: "5px",
  },
  dividerBox: {
    width: "75px",
    height: "5px",
    margin: "10px 0",
  },
}));

const FieldIntelDetailModal = (props) => {
  const classes = useStyles();
  const {
    handleClose,
    previewModal,
  } = props;

  const handleModalClose = () => {
    handleClose();
  };

  const handleOneSheetSave = () => {
    alert("Program Sheet Saved")
  };

  return (
    <>
      <div className={classes.relativeContainer}>
        <Dialog
          open={previewModal}
          onClose={handleModalClose}
          disableScrollLock
          fullWidth
          maxWidth="lg"
          style={{ zIndex: "15000" }}
        >
          <IconButton
            className={classes.closeButton}
            onClick={() => {
              handleModalClose();
            }}
          >
            <CancelIcon fontSize="large" color="secondary" />
          </IconButton>
          <DialogContent>
            <div>
              <Tooltip 
              title="Download" 
              aria-label="download"
              PopperProps={{
               style: { zIndex: "16000" },
              }}
                >
                <IconButton>
                  <GetAppIcon color="inherit"
                    onClick={(e) => { e.stopPropagation(); handleOneSheetSave() }} />
                </IconButton>
              </Tooltip>
            </div>
            {programImgs.map((item, i) => <img style={{ width: "100%", height: "auto" }} src={item} key={i} />)}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

FieldIntelDetailModal.propTypes = {
  type: PropTypes.string,
  currentItem: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default FieldIntelDetailModal;
