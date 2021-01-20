import React from "react";
import { Link } from "@reach/router";
import Logo from "../assets/RTA_Logo_Stacked.png";

import Container from "@material-ui/core/Container";
import ImageWrapper from "../components/Utility/ImageWrapper";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  logo: {
    height: "58px",
    width: "auto",
    marginLeft: "50px",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    position: "fixed",
    zIndex: "1",
    width: "100%",
    justifyContent: "space-between",
    marginTop: "50px",
  },
  footer: {
    zIndex: "1",
    position: "fixed",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginBottom: "50px",
    bottom: "0"
  },
  image: {
    minHeight: "100vh",
    minWidth: "1024px",
    width: "100%",
    height: "auto",
    position: "fixed",
    top: "0",
    left: "0",
    opacity: ".5",
    transform: "scale(1.12)",
  },
  loginButton: {
    fontWeight: "600",
    fontSize: "1rem",
    textAlign: "center",
    color: "black",
    zIndex: "1",
    marginRight: "75px",
    border: "solid black .5px",
    width: "150px",
  }
}));

const Landing = () => {
  const classes = useStyles();

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.header}>
          <ImageWrapper
            imgUrl={Logo}
            alt={"Logo"}
            imgClass={classes.logo}
            id={"logo"}
          />
          <Button className={classes.loginButton} component={Link} to="/login">
            LOG IN
           </Button>
        </div>
        <div
          style={{
            height: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ImageWrapper
            imgUrl={'https://images.unsplash.com/photo-1585803085621-7eea6581caec?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80'}
            alt={"guy-drinking-wine"}
            imgClass={classes.image}
            id={"landing-splash"}
          />
        </div>
        <div className={classes.footer}>
          <Typography className={classes.headerText} style={{ marginRight: "75px"}} variant="h5">
            &#169; brandHub 2021
          </Typography>
        </div>
      </Container>
    </>
  );
};

export default Landing;
