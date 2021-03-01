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
  const tracking = {
    "ship_date": "12.12.20",
    "tracking_number": "1234556789",
    "carrier_status_description": "shipped",
    "actual_delivery_date": "2021.01.01",
    "actual_delivery_date": "2021.01.01",
    events: [{
      "occured_at": "12.01.01",
      "city_locality": "Boston",
      "state_province": "MA",
      "postal_code": "12345",
      "description": "Scanned at Boston distribution warehouse"
    }
  ]

  }//useSelector((state) => state.tracking.tracking);
  //const error = useSelector((state) => state.tracking.error);

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
                height: "250px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </div>
          )}
          {/* {!isLoading && error && (
            <div
              style={{
                height: "250px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography className={classes.headerText}>
                Something went wrong ...
              </Typography>
            </div>
          )} */}
          {tracking && (
            <Grid container spacing={5}>
              <Grid item md={6} sm={6} xs={12}>
                <div className={classes.trackingModal}>
                  <Typography className={classes.titleText}>
                    Tracking Information:
                  </Typography>
                  <br />
                  <Typography
                    className={classes.bodyText}
                  >{`Tracking Number: ${tracking["tracking_number"]}`}</Typography>
                  <Typography className={classes.bodyText}>{`Date Shipped: ${
                    tracking["ship_date"]
                      ? format(new Date(tracking["ship_date"]), "MM/dd/yyyy")
                      : "Has not left original location yet."
                  }`}</Typography>
                  <br />
                  <Typography className={classes.bodyText}>
                    {`Carrier Status: ${tracking["carrier_status_description"]}`}
                  </Typography>
                  {tracking["actual_delivery_date"] && (
                    <Typography className={classes.bodyText}>
                      {`Delivered: ${format(
                        new Date(tracking["actual_delivery_date"]),
                        "MM/dd/yyyy"
                      )}`}
                    </Typography>
                  )}
                  {tracking["estimated_delivery_date"] && (
                    <Typography className={classes.bodyText}>
                      {`Projected Delivery: ${format(
                        new Date(tracking["estimated_delivery_date"]),
                        "MM/dd/yyyy"
                      )}`}
                    </Typography>
                  )}
                  {tracking["status_code"] === "EX" &&
                    tracking["exception_description"] && (
                      <Typography className={classes.bodyText}>
                        {`Exception Description: ${tracking["exception_description"]}`}
                      </Typography>
                    )}
                </div>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <div className={classes.trackingModal}>
                  {isEvents ? (
                    <>
                      <Typography className={classes.titleText}>
                        Events:
                      </Typography>
                      <br />
                      {tracking.events && tracking.events.length > 0 ? (
                        tracking.events.map((evt, index) => (
                          <div key={index}>
                            <Typography className={classes.bodyText}>
                              {`Date: ${format(
                                new Date(evt["occurred_at"]),
                                "MM/dd/yyyy"
                              )}`}
                            </Typography>
                            <Typography className={classes.bodyText}>
                              {`Time: ${new Date(
                                evt["occurred_at"]
                              ).toLocaleTimeString()}`}
                            </Typography>
                            {evt["city_locality"] && evt["state_province"] && (
                              <Typography className={classes.bodyText}>
                                {`City/State/Zip: ${evt["city_locality"]} / ${evt["state_province"]} / ${evt["postal_code"]}`}
                              </Typography>
                            )}
                            <Typography
                              className={classes.bodyText}
                            >{`Status: ${evt.description}`}</Typography>
                            <br />
                          </div>
                        ))
                      ) : (
                        <Typography className={classes.bodyText}>
                          Currently there are no tracked events ....
                        </Typography>
                      )}
                      <br />
                      <Button
                        variant="contained"
                        className={classes.largeButton}
                        color="secondary"
                        onClick={() => setEvents(false)}
                      >
                        View Less
                      </Button>
                    </>
                  ) : (
                    <>
                      <Typography className={classes.titleText}>
                        Current Location:
                      </Typography>
                      <br />
                      {tracking.events && tracking.events.length > 0 ? (
                        <>
                          <Typography className={classes.bodyText}>
                            {tracking.events[0]["occurred_at"]}
                            {/* {`Date: ${format(
                              new Date(tracking.events[0]["occurred_at"]),
                              "MM/dd/yyyy"
                            )}`}
                          </Typography>
                          <Typography className={classes.bodyText}>
                            {`Time: ${format(
                              new Date(tracking.events[0]["occurred_at"]),
                              "MM/dd/yyyy"
                            )}`} */}
                          </Typography>
                          {tracking.events[0]["city_locality"] &&
                            tracking.events[0]["state_province"] && (
                              <Typography className={classes.bodyText}>
                                {`City/State/Zip: ${tracking.events[0]["city_locality"]} / ${tracking.events[0]["state_province"]} / ${tracking.events[0]["postal_code"]}`}
                              </Typography>
                            )}
                          <Typography
                            className={classes.bodyText}
                          >{`Status: ${tracking.events[0].description}`}</Typography>
                          <br />
                          {tracking.events.length > 1 && (
                            <Button
                              variant="contained"
                              className={classes.largeButton}
                              color="secondary"
                              onClick={() => setEvents(true)}
                            >
                              View Details
                            </Button>
                          )}
                        </>
                      ) : (
                        <Typography className={classes.bodyText}>
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
