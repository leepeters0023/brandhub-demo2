import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import FieldDash from "../components/Dashboard/FieldDash";
import SupplierDash from "../components/Dashboard/SupplierDash";
import ComplianceDash from "../components/Dashboard/ComplianceDash";

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
    flexDirection: "column",
    alignItems: "center",
    "&:hover": {
      transition: "all .3s ease-in-out",
      transform: "scale(1.1)",
    },
  },
  innerPaper: {
    position: "absolute",
    width: "Calc(100% - 50px)",
    height: "Calc(100% - 50px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  popover: {
    pointerEvents: "none",
    margin: "20px 25px 0 0",
  },
  paper: {
    padding: theme.spacing(1),
  },
  icon: {
    height: "30%",
    width: "auto",
  },
  divider: {
    width: "100%",
    marginTop: "10px",
    marginBottom: "50px",
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
        disableScrollLock
      >
        <Typography className={classes.bodyText}>{info}</Typography>
      </Popover>
    </>
  );
};

const Dashboard = ({ userType, handleFiltersClosed, currentMonth }) => {
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
        <br />
        <br />
        <br />
        <br />
        {userType === "supplier" && (
          <SupplierDash
            name={name}
            classes={classes}
            InfoPopover={InfoPopover}
          />
        )}
        {userType === "compliance" && (
          <ComplianceDash
            name={name}
            classes={classes}
            InfoPopover={InfoPopover}
          />
        )}
        {userType !== "supplier" && userType !== "compliance" && (
          <FieldDash
            name={name}
            classes={classes}
            InfoPopover={InfoPopover}
            currentMonth={currentMonth}
          />
        )}
      </Container>
      <br />
      <br />
    </>
  );
};

Dashboard.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
  userType: PropTypes.string,
  currentMonth: PropTypes.number,
};

export default Dashboard;
