import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import FieldDash from "../components/Dashboard/FieldDash";
import SupplierDash from "../components/Dashboard/SupplierDash";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
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
    backgroundColor: "white",
    width: "100%",
    height: "150px",
    paddingBottom: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column"
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
  landingImage: {
    height: "625px",
    top: "10px",
    right: "73px",
    position: "fixed",
    opacity: ".9",
      [theme.breakpoints.down("md")]: {
        height: "350px",
        right: "0px",
    },
    [theme.breakpoints.down("sm")]: {
      height: "250px",
      right: "0px",
  },
    [theme.breakpoints.down("xs")]: {
        display: "none"
    },
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

const Dashboard = ({ userType, handleFiltersClosed }) => {
  const classes = useStyles();

  const name = useSelector((state) => state.user.firstName);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <img className={classes.landingImage} src={'https://res.cloudinary.com/joshdowns-dev/image/upload/v1609430770/Select/RTA-landing-image-cropped_yztbhc.png'}/>
        <br />
        <br />
        <br />
        <br />
        {userType === "supplier" && (
          <SupplierDash name={name} classes={classes} InfoPopover={InfoPopover} />
        )}
        {userType !== "supplier" && (
          <FieldDash name={name} classes={classes} InfoPopover={InfoPopover} />
        )}
      </Container>
      <br />
    </>
  );
};

Dashboard.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
  userType: PropTypes.string,
};

export default Dashboard;
