import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import { fetchUserDistributors } from "../../redux/slices/distributorSlice";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Autocomplete from "@material-ui/lab/Autocomplete";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  popperIndex: {
    zIndex: "16000"
  }
}));

const ReallocateShipmentModal = ({ paramId, modalOpen, handleClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [distributor, setDistributor] = useState("");
  const [currentDistributors, setCurrentDistributors] = useState([]);

  const isLoading = useSelector((state) => state.distributors.isLoading);
  const options = useSelector((state) => state.distributors.distributorList);

  const loading = open && isLoading;

  const handleDistributors = (value) => {
    setCurrentDistributors(value);
    //TODO
  };

  useEffect(() => {
    if (distributor.length >= 1) {
      dispatch(fetchUserDistributors(distributor));
    }
  }, [distributor, dispatch]);

  useEffect(() => {
    if (currentDistributors.length > 0) {
      setCurrentDistributors([]);
    }
  }, [currentDistributors]);

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={modalOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        style={{ zIndex: "15000" }}
      >
        <DialogContent>
          <IconButton className={classes.closeButton} onClick={handleClose}>
            <CancelIcon fontSize="large" color="secondary" />
          </IconButton>
          <br />
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Button
              className={classes.largeButton}
              variant="contained"
              color="secondary"
              onClick={() => console.log("TODO")}
            >
              SHIP TO RAPID
            </Button>
            <Button
              className={classes.largeButton}
              variant="contained"
              color="secondary"
              onClick={() => console.log("TODO")}
            >
              SHIP TO CHAMPION
            </Button>
          </div>
          <br />
          <Divider />
          <br />
          <Autocomplete
            multiple
            freeSolo
            renderTags={() => null}
            fullWidth
            disableClearable
            className={classes.queryField}
            id="distributor-auto-complete"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            inputValue={distributor}
            onInputChange={(_evt, value) => setDistributor(value)}
            onChange={(evt, value) => {
              handleDistributors(value);
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            value={currentDistributors}
            classes={{popper: classes.popperIndex}}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Distributors"
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress
                          color="inherit"
                          size={15}
                          style={{ marginRight: "-12px", padding: "12px" }}
                        />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <br />
        </DialogContent>
      </Dialog>
    </div>
  );
};

ReallocateShipmentModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  paramId: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
};

export default React.memo(ReallocateShipmentModal);