import React from "react";
import { Link } from "@reach/router";
import Logo from "../assets/RTA_Logo_Stacked.png";

import Container from "@material-ui/core/Container";
import ImageWrapper from "../components/Utility/ImageWrapper";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  logo: {
    height: "58px",
    width: "auto",
    marginLeft: "25px",
    float: "left",
    zIndex: "1",
},
header: {
  zIndex: "1",
  display: "flex", 
  flexDirection: "row", 
  alignContent: "center", 
  width: "100%", 
  justifyContent: "space-between", 
  marginTop: "20px"
},
footer: {
  zIndex: "1",
  position: "fixed",
  display: "flex", 
  flexDirection: "row", 
  alignContent: "center", 
  width: "100%", 
  justifyContent: "space-between", 
  marginTop: "20px",
  bottom: "0"
},
image: {
  position: "absolute",
  width: "100%",
  height: "auto",
  margin: 0,
  opacity: ".5",
  top: "0",
  left: "0",
  overflow: "hidden"
},
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
        <Button style={{zIndex: "1"}} component={Link} to="/login">
                LOG IN
              </Button>
      
        </div>
        <div
          style={{
            height: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden"
          }}
        >
         <ImageWrapper
          imgUrl={'https://images.unsplash.com/photo-1585803085621-7eea6581caec?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80'}
          alt={"guy-drinking-wine"}
          imgClass={classes.image}
          />
        </div>
        <div className={classes.footer}>
          Copyright brandHub 2021
        </div>
      </Container>
    </>
  );
};

export default Landing;
