import React, { useState } from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";

import { useSelector } from "react-redux";

import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  trackingModal: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    width: "100%",
  },
  root: {
    minHeight: "250px",
  },
}));

const TrackingModal = ({ open, handleClose }) => {
  const classes = useStyles();
  const [isEvents, setEvents] = useState(false);

  const isLoading = useSelector((state) => state.tracking.isLoading);
  const tracking = useSelector((state) => state.tracking.tracking);

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={open}
        disableScrollLock
        onClose={() => handleClose(false)}
        fullWidth
        maxWidth="md"
        style={{ zIndex: "15000" }}
      >
        <DialogContent classes={{ root: classes.root }}>
          <IconButton
            className={classes.closeButton}
            onClick={() => handleClose(false)}
          >
            <CancelIcon fontSize="large" color="secondary" />
          </IconButton>
          <br />
          {(isLoading || !tracking) && (
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </div>
          )}
          {!isLoading && tracking && (
            <Grid container spacing={5}>
              <Grid item md={6} sm={6} xs={12}>
                <div className={classes.trackingModal}>
                  <Typography variant="h4">Tracking Information:</Typography>
                  <br />
                  <Typography>{`Tracking Number: ${tracking["tracking_number"]}`}</Typography>
                  <Typography>{`Date Shipped: ${
                    tracking["ship_date"]
                      ? format(new Date(tracking["ship_date"]), "MM/dd/yyyy")
                      : "Has not left original location yet."
                  }`}</Typography>
                  <br />
                  <Typography>
                    {`Carrier Status: ${tracking["carrier_status_description"]}`}
                  </Typography>
                  {tracking["actual_delivery_date"] && (
                    <Typography>
                      {`Delivered: ${format(
                        new Date(tracking["actual_delivery_date"]),
                        "MM/dd/yyyy"
                      )}`}
                    </Typography>
                  )}
                  {tracking["estimated_delivery_date"] && (
                    <Typography>
                      {`Projected Delivery: ${format(
                        new Date(tracking["estimated_delivery_date"]),
                        "MM/dd/yyyy"
                      )}`}
                    </Typography>
                  )}
                  {tracking["status_code"] === "EX" &&
                    tracking["exception_description"] && (
                      <Typography>
                        {`Exception Description: ${tracking["exception_description"]}`}
                      </Typography>
                    )}
                </div>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <div className={classes.trackingModal}>
                  {isEvents ? (
                    <>
                      <Typography variant="h4">Events:</Typography>
                      <br />
                      {tracking.events && tracking.events.length > 0 ? (
                        tracking.events.map((evt, index) => (
                          <div key={index}>
                            <Typography>
                              {`Date: ${format(
                                new Date(evt["occurred_at"]),
                                "MM/dd/yyyy"
                              )}`}
                            </Typography>
                            <Typography>
                              {`Time: ${new Date(
                                evt["occurred_at"]
                              ).toLocaleTimeString()}`}
                            </Typography>
                            {evt["city_locality"] && evt["state_province"] && (
                              <Typography>
                                {`City/State/Zip: ${evt["city_locality"]} / ${evt["state_province"]} / ${evt["postal_code"]}`}
                              </Typography>
                            )}
                            <Typography>{`Status: ${evt.description}`}</Typography>
                            <br />
                          </div>
                        ))
                      ) : (
                        <Typography variant="body2">
                          Currently there are no tracked events ....
                        </Typography>
                      )}
                      <br />
                      <Button
                        variant="contained"
                        onClick={() => setEvents(false)}
                      >
                        View Less
                      </Button>
                    </>
                  ) : (
                    <>
                      <Typography variant="h4">Current Location:</Typography>
                      <br />
                      {tracking.events && tracking.events.length > 0 ? (
                        <div>
                          <Typography>
                            {`Date: ${format(
                              new Date(tracking.events[0]["occurred_at"]),
                              "MM/dd/yyyy"
                            )}`}
                          </Typography>
                          <Typography>
                            {`Time: ${format(
                              new Date(tracking.events[0]["occurred_at"]),
                              "MM/dd/yyyy"
                            )}`}
                          </Typography>
                          {tracking.events[0]["city_locality"] &&
                            tracking.events[0]["state_province"] && (
                              <Typography>
                                {`City/State/Zip: ${tracking.events[0]["city_locality"]} / ${tracking.events[0]["state_province"]} / ${tracking.events[0]["postal_code"]}`}
                              </Typography>
                            )}
                          <Typography>{`Status: ${tracking.events[0].description}`}</Typography>
                          <br />
                          {tracking.events.length > 1 && (
                            <Button
                              variant="contained"
                              onClick={() => setEvents(true)}
                            >
                              View Details
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Typography variant="body2">
                          Currently there are no tracked events ....
                        </Typography>
                      )}
                    </>
                  )}
                </div>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

TrackingModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default React.memo(TrackingModal);
