import React, { useState } from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";
import isBefore from "date-fns/isBefore";
import { formatDate } from "../../utility/utilityFunctions";

import { useDispatch } from "react-redux";

import { setSetDate, setRush } from "../../redux/slices/patchOrderSlice";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const UpdateRushStatusModal = ({ item, open, handleClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [currentDate, setCurrentDate] = useState(item.inMarketDate);

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
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
              {`Update Required Ship Date for Item #${item.itemNumber}`}
            </Typography>
            <br />
            <Typography className={classes.bodyText}>
              {`Standard Delivery Date: ${format(
                formatDate(new Date(item.standardDeliveryDate)),
                "MM/dd/yyyy"
              )}`}
            </Typography>
            <br />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                fullWidth
                color="secondary"
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id={`${item.id}-req-date-update`}
                label="Required Delivery Date"
                value={format(formatDate(currentDate), "MM/dd/yyyy")}
                onChange={(value) => {
                  dispatch(setSetDate(item.id, new Date(value)));
                  setCurrentDate(value);
                  if (
                    isBefore(
                      new Date(value),
                      new Date(item.standardDeliveryDate)
                    )
                  ) {
                    dispatch(setRush(item.id, true));
                  } else {
                    dispatch(setRush(item.id, false));
                  }
                }}
                PopoverProps={{
                  style: { zIndex: "16000" },
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
          <br />
        </DialogContent>
      </Dialog>
    </div>
  );
};

UpdateRushStatusModal.propTypes = {
  item: PropTypes.object,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default React.memo(UpdateRushStatusModal);
