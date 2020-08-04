import React, { useState } from "react";

import GalloLogo from "../assets/gallologo.png";

import Container from "@material-ui/core/Container";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  stepperControl: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
  },
}));

const Coupons = () => {
  const classes = useStyles();

  const steps = [
    "Coupon Parameters",
    "Coupon Details",
    "Coupon Proof",
    "Barcode Details",
    "Complete",
  ];

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            Coupons
          </Typography>
        </div>
        <br />
        <Divider className={classes.pageBreak} />
        <br />
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <br />

        <br />
        <div className={classes.stepperControl}>
          <Button
            className={classes.largeButton}
            color="secondary"
            variant="contained"
            onClick={handleBack}
            disabled={activeStep === 0}
            style={{marginLeft: "24px"}}
          >
            PREVIOUS STEP
          </Button>
          {activeStep < 4 ? (
            <Button
              className={classes.largeButton}
              color="secondary"
              variant="contained"
              onClick={handleNext}
              style={{marginRight: "24px"}}
            >
              NEXT STEP
            </Button>
          ) : activeStep < 5 ? (
            <Button
              className={classes.largeButton}
              color="secondary"
              variant="contained"
              onClick={handleNext}
              style={{marginRight: "24px"}}
            >
              SUBMIT COUPON
            </Button>
          ) : (
            <Button
              className={classes.largeButton}
              color="secondary"
              variant="contained"
              onClick={handleReset}
              style={{marginRight: "24px"}}
            >
              NEW COUPON
            </Button>
          )}
        </div>
      </Container>
      <br />
    </>
  );
};

export default Coupons;
