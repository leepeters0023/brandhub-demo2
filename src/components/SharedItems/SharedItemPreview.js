import React from "react";
import PropTypes from "prop-types";
import { formatMoney } from "../../utility/utilityFunctions";

import ImageWrapper from "../Utility/ImageWrapper";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

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
    margin: "25px 0",
  },
  largeImage: {
    maxHeight: "500px",
    objectFit: "contain",
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

const SharedItemPreview = ({ open, handleClose, item }) => {
  const classes = useStyles();

  if (!item) {
    return null;
  }

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={open}
        onClose={handleClose}
        disableScrollLock
        fullWidth
        maxWidth="lg"
        style={{ zIndex: "15000" }}
      >
        <IconButton className={classes.closeButton} onClick={handleClose}>
          <CancelIcon fontSize="large" color="secondary" />
        </IconButton>
        <DialogContent>
          <Grid container spacing={5} className={classes.dialogGrid}>
            <Grid item className={classes.previewGrid} md={7} xs={12}>
              <div className={classes.largeImageWrapper}>
                <ImageWrapper
                  imgUrl={item.imgUrlLg}
                  alt={`${item.brand} ${item.itemType}`}
                  imgClass={classes.largeImage}
                  id={item.id}
                />
              </div>
            </Grid>
            <Grid item className={classes.detailGrid} md={5} xs={12}>
              <Typography variant="body1" color="textSecondary">
                {`#${item.sequenceNum}`}
              </Typography>
              <Typography className={classes.headerText}>
                {`Brand(s):  ${item.brand}`}
              </Typography>
              <Typography className={classes.headerText}>
                {`Program:  ${item.program} Winter 2021`}
              </Typography>
              <Typography className={classes.headerText}>
                {`Item Type:  ${item.itemType}`}
              </Typography>
              <Typography className={classes.headerText}>
                {`Item Description:  ${item.itemDescription}`}
              </Typography>
              <br />
              <Box bgcolor="primary.main" className={classes.dividerBox} />
              <br />
              <Typography className={classes.headerText}>
                {`Est. Cost: ${formatMoney(item.estCost, false)}`}
              </Typography>
              <br />
              <Typography variant="body1" color="textSecondary">
                {`Pack Size: ${item.packSize}`}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {`In Market: ${item.inMarketDate}`}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};

SharedItemPreview.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  item: PropTypes.object,
};

export default SharedItemPreview;
