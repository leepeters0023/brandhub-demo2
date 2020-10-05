import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "@reach/router";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  dashboardGridItem: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dashPaper: {
    backgroundColor: "whitesmoke",
    width: "100%",
    paddingBottom: "100%",
    position: "relative",
  },
  innerPaper: {
    position: "absolute",
    width: "Calc(100% - 50px)",
    height: "Calc(100% - 50px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "25px",
  },
  popover: {
    pointerEvents: "none",
    margin: "20px 25px 0 0",
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const InfoPopover = ({
  id,
  info,
  classes,
  open,
  anchorEl,
  handlePopoverClose,
}) => {
  return (
    <>
      <Popover
        id={id}
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={handlePopoverClose}
        marginThreshold={25}
        disableRestoreFocus
      >
        <Typography className={classes.bodyText}>{info}</Typography>
      </Popover>
    </>
  );
};

const Dashboard = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const name = useSelector((state) => state.user.firstName);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const preOrderOpen = anchorEl ? anchorEl.id === "pre-order-parent" : false;
  const inStockOpen = anchorEl ? anchorEl.id === "in-stock-parent" : false;
  const onDemandOpen = anchorEl ? anchorEl.id === "on-demand-parent" : false;
  const couponOpen = anchorEl ? anchorEl.id === "coupon-parent" : false;

  //const [currentRole, setCurrentRole] = useState(undefined)

  //const role = useSelector(state => state.user.role)

  // useEffect(()=>{
  //   if (role.length > 0) {
  //     setCurrentRole(role)
  //   }
  // }, [role])

  return (
    <>
      <Container
        className={classes.mainWrapper}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%", textAlign: "center" }}>
          <Typography className={classes.titleText}>
            {`Welcome back ${name}!`}
          </Typography>
        </div>
        <br />
        <br />
        <br />
        <Grid container spacing={6} justify="center" style={{ width: "95%" }}>
          <Grid item md={3} sm={6} xs={12} component={Link} to="/programs">
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
                  <Typography className={classes.titleText}>
                    Q1 Ordering
                  </Typography>
                </div>
              </Paper>
            </div>
            <InfoPopover
              id={"pre-order"}
              info={
                "Place your Quarter One Pre-Order. Orders are placed in groups based on programs and distributors that are availiable within your assigned Regions and Key Accounts."
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
              id={"pre-order"}
              info={"Place orders for items that will need to be produced for your order."}
              classes={classes}
              open={onDemandOpen}
              anchorEl={anchorEl}
              handlePopoverClose={handlePopoverClose}
            />
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <div className={classes.dashboardGridItem}>
              <Paper className={classes.dashPaper}>
              <div
                  id="coupon-parent"
                  className={classes.innerPaper}
                  aria-owns={onDemandOpen ? "coupon" : undefined}
                  aria-haspopup="true"
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                >
                  <Typography className={classes.titleText}>Coupons</Typography>
                </div>
              </Paper>
            </div>
            <InfoPopover
              id={"pre-order"}
              info={"Create new coupons, or edit existing coupons"}
              classes={classes}
              open={couponOpen}
              anchorEl={anchorEl}
              handlePopoverClose={handlePopoverClose}
            />
          </Grid>
        </Grid>

        {/* {currentRole === "field1" && <DashboardFieldOne name={name} />}
          {currentRole === "field2" && <DashboardFieldOne name={name} />}
          {currentRole === "super" && <DashboardFieldOne name={name} />}
          {currentRole === "compliance" && <DashboardFieldOne name={name} />} */}
      </Container>
      <br />
    </>
  );
};

export default Dashboard;
