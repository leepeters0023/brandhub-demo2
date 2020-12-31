import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

const FieldDash = ({ classes, name, InfoPopover }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const currentQuotesOpen = anchorEl
    ? anchorEl.id === "current-quote-parent"
    : false;
  const quoteHistoryOpen = anchorEl
    ? anchorEl.id === "quote-history-parent"
    : false;
  const currentPOsOpen = anchorEl ? anchorEl.id === "current-po-parent" : false;
  const poHistoryOpen = anchorEl ? anchorEl.id === "po-history-parent" : false;

  return (
    <Grid container spacing={6} justify="center" style={{ width: "80%" }}>
    <div style={{ paddingLeft: "24px", width: "100%", textAlign: "left" }}>
    <Typography className={classes.titleText}>
      {`Welcome back ${name}!`}
    </Typography>
    </div>
      <Grid
        item
        md={3}
        sm={6}
        xs={12}
        component={Link}
        to="/purchasing/rfqHistory/current"
      >
        <div className={classes.dashboardGridItem}>
          <Paper className={classes.dashPaper}>
            <div
              id="current-quote-parent"
              className={classes.innerPaper}
              aria-owns={currentQuotesOpen ? "current-quotes" : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <Typography className={classes.titleText}>
                Current Quotes
              </Typography>
            </div>
          </Paper>
        </div>
        <InfoPopover
          id={"current-quotes"}
          info={"New and Pending Quotes"}
          classes={classes}
          open={currentQuotesOpen}
          anchorEl={anchorEl}
          handlePopoverClose={handlePopoverClose}
        />
      </Grid>
      <Grid
        item
        md={3}
        sm={6}
        xs={12}
        component={Link}
        to="/purchasing/rfqHistory/all"
      >
        <div className={classes.dashboardGridItem}>
          <Paper className={classes.dashPaper}>
            <div
              id="quote-history-parent"
              className={classes.innerPaper}
              aria-owns={quoteHistoryOpen ? "quote-history" : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <Typography className={classes.titleText}>
                Quote History
              </Typography>
            </div>
          </Paper>
        </div>
        <InfoPopover
          id={"quote-history"}
          info={"All Quotes"}
          classes={classes}
          open={quoteHistoryOpen}
          anchorEl={anchorEl}
          handlePopoverClose={handlePopoverClose}
        />
      </Grid>
      <Grid
        item
        md={3}
        sm={6}
        xs={12}
        component={Link}
        to="/purchasing/poHistory#current"
      >
        <div className={classes.dashboardGridItem}>
          <Paper className={classes.dashPaper}>
            <div
              id="current-po-parent"
              className={classes.innerPaper}
              aria-owns={currentPOsOpen ? "current-po" : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <Typography className={classes.titleText}>
                Current Purchase Orders
              </Typography>
            </div>
          </Paper>
        </div>
        <InfoPopover
          id={"current-po"}
          info={"New and Pending Purchase Orders"}
          classes={classes}
          open={currentPOsOpen}
          anchorEl={anchorEl}
          handlePopoverClose={handlePopoverClose}
        />
      </Grid>
      <Grid
        item
        md={3}
        sm={6}
        xs={12}
        component={Link}
        to="/purchasing/poHistory#all"
      >
        <div className={classes.dashboardGridItem}>
          <Paper className={classes.dashPaper}>
            <div
              id="po-history-parent"
              className={classes.innerPaper}
              aria-owns={poHistoryOpen ? "po-history" : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <Typography className={classes.titleText}>
                Purchase Order History
              </Typography>
            </div>
          </Paper>
        </div>
        <InfoPopover
          id={"pre-order"}
          info={"All Purchase Orders"}
          classes={classes}
          open={poHistoryOpen}
          anchorEl={anchorEl}
          handlePopoverClose={handlePopoverClose}
        />
      </Grid>
    </Grid>
  );
};

FieldDash.propTypes = {
  classes: PropTypes.object.isRequired,
  InfoPopover: PropTypes.func.isRequired,
};

export default FieldDash;
