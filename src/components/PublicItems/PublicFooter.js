import React from "react";
import Logo from "../../assets/RTA_Logo_Stacked.png";

import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  bottomBar: {
    top: "auto",
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "85px",
  },
  logo: {
    filter: "brightness(0%)",
    height: "60px",
    width: "auto",
  },
}));

const PublicFooter = () => {
  const classes = useStyles();
  return (
    <AppBar position="fixed" color="primary" className={classes.bottomBar}>
      <img className={classes.logo} alt={"Ready to Activate"} src={Logo} />
    </AppBar>
  );
};

export default React.memo(PublicFooter);
