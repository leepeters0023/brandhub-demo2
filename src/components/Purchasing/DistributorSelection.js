import React, { useState, useCallback, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { fetchUserDistributors } from "../../redux/slices/distributorSlice";
import {
  createSingleOrder,
  createMultipleOrders,
  createAllOrders,
} from "../../redux/slices/orderSetSlice";

import CustomAddressModal from "./CustomAddressModal";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";

const typeMap = {
  "in-stock": "In Stock",
  "on-demand": "On Demand",
  "pre-order": "Pre Order",
};

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
  const [isModalOpen, setModalOpen] = useCallback(useState(false));
  const [distributor, setDistributor] = useState("");
  const [currentDistributors, setCurrentDistributors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const isLoading = useSelector((state) => state.distributors.isLoading);
  const isOrderLoading = useSelector((state) => state.orderSet.isOrderLoading);
  const options = useSelector((state) => state.distributors.distributorList);
  const orderSetId = useSelector((state) => state.orderSet.orderId);
  const territoryId = useSelector((state) => state.user.currentTerritory);
  const orderType = useSelector((state) => state.orderSet.type);
  const favoriteLists = useSelector(
    (state) => state.distributors.favoriteDistributors
  );

  const loading = open && isLoading;

  const handleDistributors = (value) => {
    setCurrentDistributors(value);
    dispatch(createSingleOrder(orderSetId, value[0].id, orderType));
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddFavorites = (id) => {
    let currentList = favoriteLists.find((list) => list.id === id);
    let idArray = currentList.distributors.map((dist) => dist.id);
    dispatch(createMultipleOrders(idArray, orderSetId, orderType));
  };

  const handleAddAll = () => {
    dispatch(createAllOrders(territoryId, orderSetId, orderType));
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
    <div className={classes.distSelection}>
      <CustomAddressModal
        orderSetId={orderSetId}
        orderType={typeMap[orderType]}
        open={isModalOpen}
        handleClose={setModalOpen}
      />
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Autocomplete
          multiple
          freeSolo
          style={{
            maxWidth: "Calc(100% - 47px)",
          }}
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

        {isOrderLoading && <CircularProgress size={35} />}
        {!isOrderLoading && (
          <Tooltip title={"Add All Distributors"}>
            <IconButton edge="end" onClick={handleAddAll}>
              <AddToPhotosIcon color="inherit" fontSize="large" />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
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

        <Tooltip title={"Add Custom Address"}>
          <IconButton edge="end" onClick={() => setModalOpen(true)}>
            <AddCircleIcon color="inherit" fontSize="large" />
          </IconButton>
        </Tooltip>
      </div>
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
          style={{ marginTop: "10px", width: "100%" }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {favoriteLists.map((fav, index) => {
            if (index !== favoriteLists.length - 1) {
              return [
                <MenuItem
                  key={fav.id}
                  onClick={() => {
                    handleClose();
                    handleAddFavorites(fav.id);
                  }}
                >
                  <ListItemText primary={fav.name} />
                </MenuItem>,
                <Divider />,
              ];
            } else {
              return (
                <MenuItem
                  key={fav.id}
                  onClick={() => {
                    handleClose();
                    handleAddFavorites(fav.id);
                  }}
                >
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
