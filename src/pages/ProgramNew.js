import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";
import { useInitialFilters } from "../hooks/UtilityHooks";

import {
  startNewProgram,
  resetNewProgram,
} from "../redux/slices/newProgramSlice";

import ItemPreviewModal from "../components/ItemPreview/ItemPreviewModal";
import ProgramDetails from "../components/NewProgram/ProgramDetails";
import AddItems from "../components/NewProgram/AddItems";
import SelectTerritories from "../components/NewProgram/SelectTerritories";
import Review from "../components/NewProgram/Review";
import Complete from "../components/NewProgram/Complete";
import Loading from "../components/Utility/Loading";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const defaultFilters = {
  brand: [],
  itemType: [],
  bu: [],
  program: [],
  sequenceNum: "",
  filterType: "item-all",
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  inputRow: {
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    minWidth: "500px",
    maxWidth: "800px",
  },
  inputField: {
    width: "49%",
  },
  stepperControl: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
  },
  reviewGrid: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    textAlign: "center",
  },
  headerTextLine: {
    display: "flex",
  },
  headerTextLineStart: {
    marginRight: "10px",
  },
}));

const ProgramNew = ({ handleFilterDrawer, filtersOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const steps = [
    "Program Details",
    "Add Items",
    "Select Territories",
    "Review",
    "Complete",
  ];
  const [activeStep, setActiveStep] = useState(0);
  const [previewModal, handlePreviewModal] = useCallback(useState(false));
  const [currentItem, handleCurrentItem] = useCallback(useState({}));

  const itemsLoading = useSelector((state) => state.programs.itemsIsLoading);
  const currentUserRole = useSelector((state) => state.user.role);
  const currentItems = useSelector((state) => state.items.items);
  const inDraft = useSelector((state) => state.newProgram.inDraft);
  const name = useSelector((state) => state.newProgram.name);
  const programItems = useSelector((state) => state.newProgram.items);
  const territories = useSelector((state) => state.newProgram.territories);
  const retainFilters = useSelector((state) => state.filters.retainFilters);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    dispatch(resetNewProgram());
  };

  const handlePreview = (itemNumber) => {
    let item = currentItems.find((item) => item.itemNumber === itemNumber);
    handleCurrentItem(item);
    handlePreviewModal(true);
  };

  const handleModalClose = () => {
    handlePreviewModal(false);
  };

  useInitialFilters(
    "item-all",
    defaultFilters,
    retainFilters,
    dispatch,
    handleFilterDrawer,
    currentUserRole
  );

  useEffect(() => {
    if (!inDraft) {
      dispatch(startNewProgram());
    }
  }, [inDraft, dispatch]);

  if (!inDraft) {
    return <Loading />;
  }

  return (
    <>
      <ItemPreviewModal
        type="program"
        currentItem={currentItem}
        handleClose={handleModalClose}
        previewModal={previewModal}
      />

      <Container className={classes.mainWrapper}>
        <Typography className={classes.titleText}>
          Create New Program
        </Typography>

        <br />
        <br />
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {activeStep === 0 && <ProgramDetails classes={classes} />}
          {activeStep === 1 && (
            <AddItems
              classes={classes}
              itemsLoading={itemsLoading}
              itemList={currentItems}
              handlePreview={handlePreview}
              handleFilterDrawer={handleFilterDrawer}
              filtersOpen={filtersOpen}
            />
          )}
          {activeStep === 2 && <SelectTerritories classes={classes} />}
          {activeStep === 3 && (
            <Review classes={classes} handlePreview={handlePreview} />
          )}
          {activeStep === 4 && <Complete classes={classes} />}

          <br />
          <br />
        </div>
        <div className={classes.stepperControl}>
          <Button
            className={classes.largeButton}
            color="secondary"
            variant="contained"
            onClick={handleBack}
            disabled={activeStep === 0 || activeStep === 4}
            style={{ marginLeft: "24px" }}
          >
            PREVIOUS STEP
          </Button>
          {activeStep < 3 ? (
            <Button
              className={classes.largeButton}
              color="secondary"
              variant="contained"
              onClick={handleNext}
              style={{ marginRight: "24px" }}
              disabled={
                (activeStep === 0 && name.length === 0) ||
                (activeStep === 1 && programItems.length === 0) ||
                (activeStep === 2 && territories.length === 0)
              }
            >
              NEXT STEP
            </Button>
          ) : activeStep < 4 ? (
            <Button
              className={classes.largeButton}
              color="secondary"
              variant="contained"
              onClick={handleNext}
              style={{ marginRight: "24px" }}
            >
              SUBMIT PROGRAM
            </Button>
          ) : (
            <Button
              className={classes.largeButton}
              color="secondary"
              variant="contained"
              onClick={handleReset}
              style={{ marginRight: "24px" }}
            >
              NEW PROGRAM
            </Button>
          )}
        </div>
      </Container>
      <br />
    </>
  );
};

ProgramNew.propTypes = {
  handleFilterDrawer: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
};

export default React.memo(ProgramNew);
