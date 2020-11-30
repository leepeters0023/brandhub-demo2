import React, { useState } from "react";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";

import { useDispatch } from "react-redux";

import { setSelectedPOItems } from "../../redux/slices/purchaseOrderSlice";
//import { addToDraftPO } from "../../redux/slices/purchaseOrderHistorySlice";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

const AddToPOMenu = ({ classes, draftPOs, isLoading, itemSelected }) => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    console.log(event.currentTarget);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        className={classes.largeButton}
        variant="contained"
        color="secondary"
        aria-controls="draft-purchase-orders"
        aria-haspopup="true"
        disabled={isLoading || !itemSelected || draftPOs.length === 0}
        style={{ marginRight: "20px" }}
        onClick={handleClick}
      >
        ADD TO DRAFT PO
      </Button>
      {draftPOs.length > 0 && !isLoading && (
        <Menu
          id="draft-purchase-orders"
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
          {[...new Set(draftPOs.map(po => `${po.poNum}-${po.supplier}`))].map((name, index) => {
            if (index !== [...new Set(draftPOs.map(po => po.poNum))].length - 1) {
              return [
                <MenuItem
                  key={index}
                  onClick={() => {
                    handleClose();
                    dispatch(setSelectedPOItems({ selectedItems: []}))
                    navigate(`/purchasing/purchaseOrder#${name.split("-")[0]}`);
                    //todo
                    //dispatch(addToDraftPO(name.split("-")[0]))
                  }}
                >
                  <ListItemText primary={`PO #${name}`} />
                </MenuItem>,
                <Divider />,
              ];
            } else {
              return (
                <MenuItem
                  key={index}
                  onClick={() => {
                    handleClose();
                    navigate(`/purchasing/purchaseOrder#${name.split("-")[0]}`);
                    dispatch(setSelectedPOItems({ selectedItems: []}))
                    //todo
                    //dispatch(addToDraftPO(name.split("-")[0]))
                  }}
                >
                  <ListItemText primary={`PO #${name}`} />
                </MenuItem>
              );
            }
          })}
        </Menu>
      )}
    </>
  );
};

AddToPOMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  draftPOs: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  itemSelected: PropTypes.bool.isRequired,
};

export default React.memo(AddToPOMenu);
