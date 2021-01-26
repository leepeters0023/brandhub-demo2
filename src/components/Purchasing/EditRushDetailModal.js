import React from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";
import addDays from "date-fns/addDays";

import { /*useDispatch,*/ useSelector } from "react-redux";

//import { setRushStatus } from "../../redux/slices/patchOrderSlice";
import { formatDate } from "../../utility/utilityFunctions";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

// fallback fields with mock data until ship date and rush dates are on items!!!!

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const EditRushDetailModal = ({ itemId, handleClose }) => {
  const classes = useStyles();
  //const dispatch = useDispatch();

  const currentItem = useSelector((state) =>
    state.orderSet.items.find((item) => item.id === itemId)
  );

  //TODO write date handling function with redux when available

  const handleChanges = () => {
    //TODO add functionality when calls are available
    handleClose(false);
  };

  if (!currentItem) {
    return null;
  }

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={itemId !== false}
        onClose={() => handleClose(false)}
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
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography className={classes.headerText}>
              Standard Ship Date:
            </Typography>
            <br />
            <Typography className={classes.bodyText}>
              {currentItem.standardShip
                ? currentItem.standardShip
                : format(addDays(new Date(), 28), "MM/dd/yyyy")}
            </Typography>
            <br />
            <Typography className={classes.headerText}>
              Requested Ship Date:
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
                id="requested-ship-date"
                label=""
                value={
                  currentItem.requestedShip
                    ? formatDate(currentItem.requestedShip)
                    : format(addDays(new Date(), 28), "MM/dd/yyyy")
                }
                //onChange={(value) => handle this function!}
              />
            </MuiPickersUtilsProvider>
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
                onClick={() => handleChanges()}
                style={{ marginRight: "20px" }}
              >
                USE STANDARD SHIP
              </Button>
              <Button
                className={classes.largeButton}
                variant="contained"
                color="secondary"
                onClick={() => handleChanges()}
                style={{ marginRight: "20px" }}
              >
                UPDATE REQ. SHIP
              </Button>
            </div>
          </div>
          <br />
        </DialogContent>
      </Dialog>
    </div>
  );
};

EditRushDetailModal.propTypes = {
  itemId: PropTypes.any,
  handleClose: PropTypes.func.isRequired,
};

export default React.memo(EditRushDetailModal);
