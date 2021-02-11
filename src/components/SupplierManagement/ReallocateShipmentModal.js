import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import { fetchUserDistributors } from "../../redux/slices/distributorSlice";
import { fetchAllCompliantStates } from "../../redux/slices/territorySlice";
import { updateShippingParamAddress } from "../../redux/slices/purchaseOrderSlice";

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
    zIndex: "16000",
  },
}));

const ReallocateShipmentModal = ({ paramId, modalOpen, handleClose, poId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [distributor, setDistributor] = useState("");

  const isLoading = useSelector((state) => state.distributors.isLoading);
  const options = useSelector((state) => state.distributors.distributorList);
  const compliantStates = useSelector(
    (state) => state.territories.compliantStateList
  );
  const isStatesLoading = useSelector(
    (state) => state.territories.isStatesLoading
  );

  const loading = open && isLoading;

  const debounce = useRef(null);

  const handleDistributors = (value) => {
    dispatch(updateShippingParamAddress("dist", value.id, paramId, poId));
    handleClose();
  };

  const handleWarehouseClick = (name) => {
    dispatch(updateShippingParamAddress("warehouse", name, paramId, poId));
    handleClose();
  };

  const handleQuery = useCallback(() => {
    clearTimeout(debounce.current);

    debounce.current = setTimeout(() => {
      dispatch(
        fetchUserDistributors(
          distributor,
          null,
          compliantStates.map((st) => st.id).join(",")
        )
      );
    }, 250);
  }, [distributor, compliantStates, dispatch]);

  useEffect(() => {
    if (distributor.length >= 1) {
      handleQuery();
    }
  }, [distributor, handleQuery, dispatch]);

  useEffect(() => {
    dispatch(fetchAllCompliantStates(paramId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {isStatesLoading && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "100px",
                paddingBottom: "100px",
              }}
            >
              <CircularProgress />
            </div>
          )}
          {!isStatesLoading && (
            <>
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
                  onClick={() => handleWarehouseClick("rapid")}
                >
                  SHIP TO RAPID
                </Button>
                <Button
                  className={classes.largeButton}
                  variant="contained"
                  color="secondary"
                  onClick={() => handleWarehouseClick("champion")}
                >
                  SHIP TO CHAMPION
                </Button>
              </div>
              <br />
              <Divider />
              <br />
              <Autocomplete
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
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option, value) =>
                  option.name === value.name
                }
                options={options}
                loading={loading}
                classes={{ popper: classes.popperIndex }}
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

ReallocateShipmentModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  paramId: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  poId: PropTypes.string,
};

export default React.memo(ReallocateShipmentModal);
