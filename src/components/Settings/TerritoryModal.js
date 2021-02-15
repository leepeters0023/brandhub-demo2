import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import { useInput } from "../../hooks/InputHooks";
import { useDispatch, useSelector } from "react-redux";

import {
  addNewTerritory,
  updateTerritoryById,
  setUpdateSuccess,
} from "../../redux/slices/territorySlice";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const TopPopper = (props) => <Popper {...props} placement="top" />;

const StateSelector = React.memo(
  ({ classes, handleStates, states, territoryStates }) => {
    const [currentStates, setCurrentStates] = useState(territoryStates);

    useEffect(() => {
      if (currentStates.length !== territoryStates.length) {
        setCurrentStates(territoryStates);
      }
    }, [currentStates, territoryStates]);

    return (
      <Autocomplete
        multiple
        fullWidth
        freeSolo
        id="state-selector"
        options={states}
        getOptionLabel={(option) => option.code}
        onChange={(_evt, value) => handleStates(value)}
        classes={{
          popper: classes.popper,
        }}
        PopperComponent={TopPopper}
        value={currentStates}
        renderInput={(params) => (
          <TextField
            {...params}
            label="State"
            id="state"
            variant="outlined"
            size="small"
            autoComplete="new-password"
            InputProps={{
              ...params.InputProps,
              autoComplete: "new-password",
              "aria-autocomplete": "off",
              spellCheck: "false",
              autoCorrect: "off",
              endAdornment: <>{params.InputProps.endAdornment}</>,
              form: {
                autoComplete: "new-password",
              },
            }}
          />
        )}
      />
    );
  }
);

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  settingsMargin: {
    marginBottom: "15px",
  },
  popper: {
    zIndex: "16000",
  },
  selectedButton: {
    fontWeight: "600",
    fontSize: "1rem",
    textAlign: "center",
    color: "#737373",
  },
}));

const TerritoryModal = ({ open, handleClose, type, id, territoryList }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    value: name,
    bind: bindName,
    setValue: setName,
    reset: resetName,
  } = useInput("");
  const {
    value: code,
    bind: bindCode,
    setValue: setCode,
    reset: resetCode,
  } = useInput("");

  const [terrType, setTerrType] = useCallback(useState("Regional"));
  const [currentStates, setCurrentStates] = useCallback(useState([]));
  const [currentTerritory, setCurrentTerritory] = useCallback(useState(null));
  const [error, setError] = useState(null);

  const stateList = useSelector((state) => state.territories.stateList);
  const isUpdateLoading = useSelector(
    (state) => state.territories.isUpdateLoading
  );
  const updateSuccess = useSelector((state) => state.territories.updateStatus);
  const updateError = useSelector((state) => state.territories.error);

  const handleSubmit = () => {
    if (name.length === 0 || code.length === 0 || currentStates.length === 0) {
      setError("You must complete form before submitting");
    } else {
      if (type === "edit") {
        dispatch(updateTerritoryById(name, currentStates, id));
      } else {
        dispatch(
          addNewTerritory(name, currentStates, code, terrType, territoryList)
        );
      }
    }
  };

  const handleStates = useCallback(
    (value) => {
      setCurrentStates(value);
    },
    [setCurrentStates]
  );

  useEffect(() => {
    if (
      !isUpdateLoading &&
      (type === "edit" || updateSuccess) &&
      (!currentTerritory || currentTerritory.id !== id)
    ) {
      let territory = territoryList.find((terr) => terr.id === id);
      if (territory) {
        setCurrentTerritory(territory);
        setCode(territory.code);
        setCurrentStates(territory.states);
        setName(territory.name);
        setTerrType(territory.type);
      }
    }
  });

  useEffect(() => {
    dispatch(setUpdateSuccess({ updateStatus: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (updateError) {
      setError(updateError);
    }
  }, [updateError]);

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={open}
        onClose={() => {
          resetName();
          resetCode();
          handleClose();
        }}
        fullWidth
        maxWidth="md"
        style={{ zIndex: "15000" }}
        disableScrollLock
      >
        <DialogTitle>
          <Typography className={classes.headerText}>
            {type === "edit" ? `Editing ${name}` : "New Territory"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <IconButton
            className={classes.closeButton}
            onClick={() => {
              resetName();
              resetCode();
              handleClose();
            }}
          >
            <CancelIcon fontSize="large" color="secondary" />
          </IconButton>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              className={classes.headerText}
              style={{ marginBottom: "15px" }}
            >
              Territory Information
            </Typography>
            <br />
            <TextField
              size="small"
              className={classes.settingsMargin}
              variant="outlined"
              color="secondary"
              name="name"
              type="text"
              label="Name"
              {...bindName}
              fullWidth
            />
            <TextField
              size="small"
              className={classes.settingsMargin}
              variant="outlined"
              color="secondary"
              name="code"
              type="text"
              disabled={type === "edit"}
              label="Region / Key Acct. Code"
              {...bindCode}
              fullWidth
            />
            <br />
            <ButtonGroup color="secondary" aria-label="type-select" fullWidth>
              <Button
                disabled={type === "edit"}
                className={
                  terrType === "Regional"
                    ? classes.largeButton
                    : classes.selectedButton
                }
                variant={terrType === "Regional" ? "contained" : "outlined"}
                onClick={() => {
                  setTerrType("Regional");
                }}
              >
                REGIONAL
              </Button>
              <Button
                disabled={type === "edit"}
                className={
                  terrType === "Customer"
                    ? classes.largeButton
                    : classes.selectedButton
                }
                variant={terrType === "Customer" ? "contained" : "outlined"}
                onClick={() => {
                  setTerrType("Customer");
                }}
              >
                KEY ACCOUNT
              </Button>
            </ButtonGroup>
            <br />
            <Typography
              className={classes.headerText}
              style={{ marginBottom: "15px" }}
            >
              Territory State Assignment
            </Typography>
            <br />
            <StateSelector
              classes={classes}
              handleStates={handleStates}
              states={stateList}
              territoryStates={currentStates}
            />
            <br />
            <br />
            <Button
              className={classes.largeButton}
              variant="contained"
              color="secondary"
              id="profile"
              onClick={handleSubmit}
              style={{
                float: "right",
                marginBottom: "20px",
                minWidth: "62px",
              }}
            >
              {isUpdateLoading ? <CircularProgress /> : "SUBMIT"}
            </Button>
            {!isUpdateLoading && error && (
              <Typography
                className={classes.bodyText}
                style={{ color: "#920000" }}
              >
                {error}
              </Typography>
            )}
            {!isUpdateLoading && updateSuccess && (
              <Typography className={classes.bodyText}>
                {type === "edit"
                  ? "Update Successful!"
                  : "New Territory Added Successfully!"}
              </Typography>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

TerritoryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string,
  territoryList: PropTypes.arrayOf(Object),
};

export default React.memo(TerritoryModal);
