import React, { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { fetchUserDistributors } from "../../redux/slices/distributorSlice";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  distSelection: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
}));

const DistributorSelection = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [distributor, setDistributor] = useState("");
  const [currentDistributors, setCurrentDistributors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const isLoading = useSelector((state) => state.distributors.isLoading);
  const options = useSelector((state) => state.distributors.distributorList);
  const currentOrders = useSelector((state) => state.orderSet.orders);
  const favoriteLists = useSelector((state) => state.user.favoriteDistributors);

  const loading = open && isLoading;

  const handleDistributors = (value) => {
    setCurrentDistributors(value);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (distributor.length >= 1) {
      dispatch(fetchUserDistributors(distributor));
    }
  }, [distributor, dispatch]);

  useEffect(() => {
    if (currentOrders.length !== currentDistributors.length) {
      let mappedDistributors = currentOrders.map((ord) => ({
        id: ord.distributorId,
        type: "distributor",
        zip: ord.distributorZip,
        "street-address-1": ord.distributorAddressOne,
        "street-address-2": ord.distributorAddressTwo,
        city: ord.distributorCity,
        state: ord.distributorState,
        name: ord.distributorName,
        "is-active": true,
        country: "USA",
      }));
      setCurrentDistributors(mappedDistributors);
    }
  }, [currentOrders, currentDistributors.length]);

  return (
    <div className={classes.distSelection}>
      <Autocomplete
        multiple
        freeSolo
        renderTags={() => null}
        fullWidth
        className={classes.queryField}
        id="distributor-auto-complete"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={distributor}
        onInputChange={(_evt, value) => setDistributor(value)}
        onChange={(_evt, value) => {
          handleDistributors(value);
        }}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={currentDistributors}
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
                    <CircularProgress color="inherit" size={15} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <Button
        fullWidth
        className={classes.largeButton}
        color="secondary"
        variant="contained"
        disabled={favoriteLists.length === 0}
        aria-controls="favorite-dist-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {favoriteLists.length > 0 ? "USE FAVORITES" : "NO FAVORITES SET"}
      </Button>
      {favoriteLists.length > 0 && (
        <Menu
          id="favorite-dist-menu"
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          style={{marginTop: "10px", width: "100%"}}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {favoriteLists.map((fav, index) => {
            if (index !== favoriteLists.length - 1) {
              return [
                <MenuItem key={fav.id} onClick={handleClose}>
                  <ListItemText primary={fav.name} />
                </MenuItem>,
                <Divider />,
              ];
            } else {
              return (
                <MenuItem key={fav.id} onClick={handleClose}>
                  <ListItemText primary={fav.name} />
                </MenuItem>
              );
            }
          })}
        </Menu>
      )}
    </div>
  );
};

export default React.memo(DistributorSelection);
