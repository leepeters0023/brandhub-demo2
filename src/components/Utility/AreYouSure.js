import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  confirmDeletModal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: "200px",
  }
}));

const AreYouSure = ({
  handleRemove,
  handleModalClose,
  itemNumber,
}) => {
  const classes = useStyles();

  return (
    <>
      <IconButton className={classes.closeButton} onClick={handleModalClose}>
        <CancelIcon fontSize="large" color="secondary" />
      </IconButton>
      <div className={classes.confirmDeletModal}>
        <Typography className={classes.titleText}>
          Are you sure you want to remove this item?
        </Typography>
        <Typography className={classes.titleText}>
          This action cannot be undone.
        </Typography>
        <Button
          variant="contained"
          className={classes.largeButton}
          color="secondary"
          onClick={()=>{
            handleRemove(itemNumber)
          }}
        >
          REMOVE ITEM
        </Button>
      </div>
    </>
  );
};

AreYouSure.propTypes = {
  handleRemove: PropTypes.func.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  itemNumber: PropTypes.string,
};

export default AreYouSure;
