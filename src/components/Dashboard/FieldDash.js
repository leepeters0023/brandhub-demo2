import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";



const FieldDash = ({ classes, InfoPopover }) => {
  
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const preOrderOpen = anchorEl ? anchorEl.id === "pre-order-parent" : false;
  const inStockOpen = anchorEl ? anchorEl.id === "in-stock-parent" : false;
  const onDemandOpen = anchorEl ? anchorEl.id === "on-demand-parent" : false;
  const historyOpen = anchorEl ? anchorEl.id === "history-parent" : false;
  const cardData = [
    {
      titleText: "Q1 Ordering",
      ariaOwnsState: preOrderOpen,
      ariaOwnsText: "pre-order",
      id: "pre-order-parent",
      link: "/programs",
      info: "Place your Quarter One Pre-Order. Orders are placed in groups based on programs and distributors that are availiable within your assigned Regions and Key Accounts",
    },
    {
      titleText: "Q1 Ordering",
      ariaOwnsState: preOrderOpen,
      ariaOwnsText: "pre-order",
      id: "pre-order-parent",
      link: "/programs",
      info: "Place your Quarter One Pre-Order. Orders are placed in groups based on programs and distributors that are availiable within your assigned Regions and Key Accounts",
    },
    {
      titleText: "Q1 Ordering",
      ariaOwnsState: preOrderOpen,
      ariaOwnsText: "pre-order",
      id: "pre-order-parent",
      link: "/programs",
      info: "Place your Quarter One Pre-Order. Orders are placed in groups based on programs and distributors that are availiable within your assigned Regions and Key Accounts",
    },
    {
      titleText: "Q1 Ordering",
      ariaOwnsState: preOrderOpen,
      ariaOwnsText: "pre-order",
      id: "pre-order-parent",
      link: "/programs",
      info: "Place your Quarter One Pre-Order. Orders are placed in groups based on programs and distributors that are availiable within your assigned Regions and Key Accounts",
    },
  ]
  return (
    <Grid container spacing={6} justify="center" style={{ width: "80%" }}>
      {cardData.map((data) => (
        <Grid item md={3} sm={6} xs={12} component={Link} to={data.link}>
          <div className={classes.dashboardGridItem}>
            <Paper className={classes.dashPaper}>
              <div
                id={data.id}
                className={classes.innerPaper}
                aria-owns={data.ariaOwnsState ? data.ariaOwnsText : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
              >
                <Typography className={classes.titleText}>{data.titleText}</Typography>
              </div>
            </Paper>
          </div>
          <InfoPopover
            id={data.id}
            info={data.info}
            classes={classes}
            open={data.ariaOwnsState}
            anchorEl={anchorEl}
            handlePopoverClose={handlePopoverClose}
          />
        </Grid>

      ))}
      {/* <Grid item md={3} sm={6} xs={12} component={Link} to="/programs">
        <div className={classes.dashboardGridItem}>
          <Paper className={classes.dashPaper}>
            <div
              id="pre-order-parent"
              className={classes.innerPaper}
              aria-owns={preOrderOpen ? "pre-order" : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <Typography className={classes.titleText}>Q1 Ordering</Typography>
            </div>
          </Paper>
        </div>
        <InfoPopover
          id={"pre-order"}
          info={
            "Place your Quarter One Pre-Order. Orders are placed in groups based on programs and distributors that are availiable within your assigned Regions and Key Accounts"
          }
          classes={classes}
          open={preOrderOpen}
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
        to="/orders/items/inStock"
      >
        <div className={classes.dashboardGridItem}>
          <Paper className={classes.dashPaper}>
            <div
              id="in-stock-parent"
              className={classes.innerPaper}
              aria-owns={inStockOpen ? "in-stock" : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <Typography className={classes.titleText}>
                Place In-Stock Order
              </Typography>
            </div>
          </Paper>
        </div>
        <InfoPopover
          id={"in-stock"}
          info={
            "Place orders for items that are currently available in our inventory"
          }
          classes={classes}
          open={inStockOpen}
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
        to="/orders/items/onDemand"
      >
        <div className={classes.dashboardGridItem}>
          <Paper className={classes.dashPaper}>
            <div
              id="on-demand-parent"
              className={classes.innerPaper}
              aria-owns={onDemandOpen ? "on-demand" : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <Typography className={classes.titleText}>
                Place On-Demand Order
              </Typography>
            </div>
          </Paper>
        </div>
        <InfoPopover
          id={"on-demand"}
          info={
            "Place orders for items that will need to be produced for your order"
          }
          classes={classes}
          open={onDemandOpen}
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
        to="/orders/history/group/byOrder"
      >
        <div className={classes.dashboardGridItem}>
          <Paper className={classes.dashPaper}>
            <div
              id="history-parent"
              className={classes.innerPaper}
              aria-owns={historyOpen ? "order-history" : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <Typography className={classes.titleText}>
                Order History
              </Typography>
            </div>
          </Paper>
        </div>
        <InfoPopover
          id={"order-history"}
          info={
            "View order history grouped by item or order & get tracking information"
          }
          classes={classes}
          open={historyOpen}
          anchorEl={anchorEl}
          handlePopoverClose={handlePopoverClose}
        />
      </Grid> */}
    </Grid>
  );
};

FieldDash.propTypes = {
  classes: PropTypes.object.isRequired,
  InfoPopover: PropTypes.func.isRequired,
};

export default FieldDash;
