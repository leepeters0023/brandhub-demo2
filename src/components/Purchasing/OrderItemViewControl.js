import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";
import { addInStockItem } from "../../redux/slices/inStockOrderSlice";
import { addOnDemandItem } from "../../redux/slices/onDemandOrderSlice";

import OrderInStockTableView from "./OrderItemTableView";
import OrderPreGridView from "./OrderItemGridView";
import OrderConfirmation from "../Utility/OrderConfirmation";

import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import { makeStyles } from "@material-ui/core/styles"

//mockdata
import items from "../../assets/mockdata/Items";

let currentItems = items.map((item) => ({...item, stock: Math.floor(Math.random() * 10 + 1) * 5}))

const useStyles = makeStyles((theme) => ({
  ...theme.global
}))

const OrderItemViewControl = (props) => {
  const { type, currentView, handlePreview, currentProgram } = props;
  const dispatch = useDispatch();
  const classes = useStyles();

  const [itemAddedModal, handleItemAddedModal] = useCallback(useState(false));
  const [currentItemAdded, setCurrentItemAdded] = useCallback(useState(null))

  const handleAddItem = useCallback((item, qty) => {
    let newItem = {
      itemNumber: item.itemNumber,
      brand: item.brand,
      itemType: item.itemType,
      price: item.price,
      qty: item.qty,
      imgUrl: item.imgUrl,
      complianceStatus: "pending",
      totalItems: qty,
      estTotal: qty * item.price
    }

    setCurrentItemAdded(newItem);
    handleItemAddedModal(true);

    if (type === "inStock") {
      dispatch(addInStockItem({ item: newItem }))
    } else if ( type === "onDemand") {
      dispatch(addOnDemandItem({ item: newItem }))
    }
  }, [dispatch, type, setCurrentItemAdded, handleItemAddedModal])

  return (
    <>
      <div className={classes.relativeContainer}>
        <Dialog
          open={itemAddedModal}
          onClose={()=>handleItemAddedModal(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent>
            <OrderConfirmation
              item={currentItemAdded}
              type={type}
              handleModalClose={handleItemAddedModal}
            />
          </DialogContent>
        </Dialog>
      </div>
      {currentView === "list" && (
        <OrderInStockTableView
          type={type}
          currentItems={currentItems}
          handlePreview={handlePreview}
          currentProgram={currentProgram}
          handleAddItem={handleAddItem}
        />
      )}
      {currentView === "grid" && (
        <OrderPreGridView
          type={type}
          currentItems={currentItems}
          handlePreview={handlePreview}
          currentProgram={currentProgram}
          handleAddItem={handleAddItem}
        />
      )}
    </>
  );
};

OrderItemViewControl.propTypes = {
  type: PropTypes.string.isRequired,
  currentView: PropTypes.string.isRequired,
  handlePreview: PropTypes.func.isRequired,
  currentProgram: PropTypes.object
};

export default OrderItemViewControl;
