import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import { useInput } from "../../hooks/InputHooks";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchStatesByIds,
  clearFilteredStates,
} from "../../redux/slices/territorySlice";
import {
  fetchSingleUser,
  updateUser,
  setUpdateSuccess,
} from "../../redux/slices/userUpdateSlice";

import UserRoleSelect from "./UserRoleSelect";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Popper from "@material-ui/core/Popper";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";

const TopPopper = (props) => <Popper {...props} placement="top" />;

const TerritorySelector = React.memo(
  ({ classes, handleTerritories, territories, selectedTerritories }) => {
    const [currentTerritories, setCurrentTerritories] = useState(
      selectedTerritories
    );

    useEffect(() => {
      if (currentTerritories.length !== selectedTerritories.length) {
        setCurrentTerritories(selectedTerritories);
      }
    }, [currentTerritories, selectedTerritories]);

    return (
      <Autocomplete
        style={{
          maxWidth: "Calc(100% - 47px)",
        }}
        multiple
        fullWidth
        freeSolo
        id="user-territories"
        options={territories}
        getOptionLabel={(option) => option.name}
        onChange={(_evt, value) => handleTerritories(value)}
        classes={{
          popper: classes.popper,
        }}
        value={currentTerritories}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Territory"
            size="small"
          />
        )}
      />
    );
  },
  (prev, next) => {
    return (
      Object.keys(prev.classes).length === Object.keys(next.classes).length &&
      prev.selectedTerritories === next.selectedTerritories
    );
  }
);

const StateSelector = React.memo(
  ({ classes, handleStates, filteredStates, loading, selectedStates }) => {
    const [currentStates, setCurrentStates] = useState(selectedStates);

    useEffect(() => {
      if (currentStates.length !== selectedStates.length) {
        setCurrentStates(selectedStates);
      }
    }, [currentStates, selectedStates]);

    return (
      <Autocomplete
        multiple
        fullWidth
        freeSolo
        id="st-by-territory-selector"
        options={filteredStates}
        disabled={filteredStates.length === 0}
        loading={loading}
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
            id="st-by-territory"
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
  completeRow: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

const EditUserModal = ({ modal, handleModalClose, currentUserId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { value: name, bind: bindName, setValue: setName } = useInput("");
  const { value: email, bind: bindEmail, setValue: setEmail } = useInput("");

  const [currentTerritories, setCurrentTerritories] = useCallback(useState([]));
  const [currentStates, setCurrentStates] = useCallback(useState([]));
  const [role, setRole] = useState("read-only");
  const [checkboxState, setCheckboxState] = useState({
    retail: false,
    onPremise: false,
  });
  const [error, setError] = useState(null);

  const territories = useSelector((state) => state.territories.territoryList);
  const filteredStates = useSelector(
    (state) => state.territories.filteredStateList
  );
  const isLoading = useSelector((state) => state.territories.isLoading);
  const isStatesLoading = useSelector(
    (state) => state.territories.isStatesLoading
  );
  const isUserLoading = useSelector((state) => state.userUpdate.isUserLoading);
  const isUpdateLoading = useSelector(
    (state) => state.userUpdate.isUpdateLoading
  );
  const updateSuccess = useSelector((state) => state.userUpdate.updateSuccess);
  const currentUser = useSelector((state) => state.userUpdate.currentUser);
  const userId = useSelector((state) => state.userUpdate.currentUser.id);
  const updateError = useSelector((state) => state.userUpdate.error);

  const handleTerritories = useCallback(
    (value) => {
      setCurrentTerritories(value);
      if (value.length > 0) {
        dispatch(fetchStatesByIds(value.map((terr) => terr.id)));
      } else {
        dispatch(clearFilteredStates());
        setCurrentStates([]);
      }
    },
    [setCurrentTerritories, dispatch, setCurrentStates]
  );

  const handleStates = useCallback(
    (value) => {
      setCurrentStates(value);
    },
    [setCurrentStates]
  );

  const handleAllTerritories = () => {
    setCurrentTerritories([...territories]);
    dispatch(fetchStatesByIds(territories.map((terr) => terr.id)));
  };

  const handleAllStates = () => {
    setCurrentStates(filteredStates);
  };

  const handleCheckBox = (event) => {
    setCheckboxState({
      ...checkboxState,
      [event.target.name]: event.target.checked,
    });
  };

  const handleFormSubmit = (evt) => {
    evt.preventDefault();
    if (currentTerritories.length === 0 || currentStates.length === 0) {
      setError(
        "You must assign a user to at least one territory and one state"
      );
    } else {
      setError(null);
      const userData = {
        id: currentUser.id,
        role: role,
        name: name,
        email: email,
        isOnPremise: checkboxState.onPremise,
        isRetail: checkboxState.retail,
        states: currentStates.map((state) => state.id),
        territories: currentTerritories.map((terr) => terr.id),
      };
      dispatch(updateUser(userData));
    }
  };

  useEffect(() => {
    if (!userId || currentUserId !== userId) {
      dispatch(fetchSingleUser(currentUserId));
    }
  }, [userId, currentUserId, dispatch]);

  useEffect(() => {
    if (userId && currentUser.email !== email) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setCurrentTerritories(currentUser.territories);
      setCurrentStates(currentUser.states);
      setRole(currentUser.role);
      let checkState = {
        retail: currentUser.isRetail,
        onPremise: currentUser.isOnPremise,
      };
      setCheckboxState(checkState);
      if (currentUser.territories.length > 0) {
        dispatch(
          fetchStatesByIds(currentUser.territories.map((terr) => terr.id))
        );
      }
    }
  }, [
    userId,
    currentUser.email,
    setName,
    setEmail,
    email,
    setCurrentTerritories,
    setCurrentStates,
    currentUser.states,
    currentUser.territories,
    currentUser.name,
    currentUser.isOnPremise,
    currentUser.isRetail,
    currentUser.role,
    dispatch,
  ]);

  useEffect(() => {
    dispatch(clearFilteredStates());
    dispatch(setUpdateSuccess({ updateStatus: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (updateError && error !== updateError) {
      setError(updateError);
    }
  }, [error, updateError, setError]);

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={modal}
        onClose={handleModalClose}
        fullWidth
        maxWidth="md"
        style={{ zIndex: "15000" }}
        disableScrollLock
      >
        <DialogTitle>
          <Typography className={classes.headerText}>
            {`User Id: ${currentUserId}`}
          </Typography>
        </DialogTitle>
        {isLoading || isUserLoading ? (
          <DialogContent>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60vh",
              }}
            >
              <CircularProgress />
            </div>
          </DialogContent>
        ) : (
          <DialogContent>
            <IconButton
              className={classes.closeButton}
              onClick={() => {
                handleModalClose(false);
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
                User Information
              </Typography>
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
                name="email"
                type="text"
                label="Email"
                {...bindEmail}
                fullWidth
              />
              <br />
              <Typography
                className={classes.headerText}
                style={{ marginBottom: "15px" }}
              >
                User Role
              </Typography>
              <UserRoleSelect role={role} setRole={setRole} />
              <br />
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxState.retail}
                      onChange={handleCheckBox}
                      name="retail"
                    />
                  }
                  label="Retail"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxState.onPremise}
                      onChange={handleCheckBox}
                      name="onPremise"
                    />
                  }
                  label="On Premise"
                />
              </FormGroup>
              <br />
              <Typography
                className={classes.headerText}
                style={{ marginBottom: "15px" }}
              >
                Region / Key Acct. Assignment
              </Typography>
              <div className={classes.completeRow}>
                <TerritorySelector
                  classes={classes}
                  handleTerritories={handleTerritories}
                  territories={territories}
                  selectedTerritories={currentTerritories}
                />
                <Tooltip
                  PopperProps={{ style: { zIndex: "16000" } }}
                  title="Assign All"
                >
                  <IconButton onClick={handleAllTerritories}>
                    <AddToPhotosIcon color="secondary" />
                  </IconButton>
                </Tooltip>
              </div>
              <br />
              <Typography
                className={classes.headerText}
                style={{ marginBottom: "15px" }}
              >
                State Assignment
              </Typography>
              <div className={classes.completeRow}>
                <StateSelector
                  classes={classes}
                  handleStates={handleStates}
                  filteredStates={filteredStates}
                  isLoading={isStatesLoading}
                  selectedStates={currentStates}
                />
                <Tooltip
                  PopperProps={{ style: { zIndex: "16000" } }}
                  title="Assign All"
                >
                  <span>
                    <IconButton
                      disabled={currentTerritories.length === 0}
                      onClick={handleAllStates}
                    >
                      <AddToPhotosIcon color="secondary" />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
              <br />
              <br />
              <Button
                className={classes.largeButton}
                variant="contained"
                color="secondary"
                id="profile"
                onClick={handleFormSubmit}
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
                  Update Successful!
                </Typography>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

EditUserModal.propTypes = {
  handleModalClose: PropTypes.func.isRequired,
  currentUserId: PropTypes.string,
  modal: PropTypes.bool.isRequired,
};

export default EditUserModal;
