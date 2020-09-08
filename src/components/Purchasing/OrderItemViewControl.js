import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";
import { addInStockItem } from "../../redux/slices/inStockOrderSlice";
import { addOnDemandItem } from "../../redux/slices/onDemandOrderSlice";

import OrderItemTableView from "./OrderItemTableView";
import OrderPreGridView from "./OrderItemGridView";
import OrderConfirmation from "../Utility/OrderConfirmation";
import ItemCatalogTable from "./ItemCatalogTable";
import ItemCatalogGrid from "./ItemCatalogGrid";

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
  const { type, currentView, handlePreview, items } = props;
  const dispatch = useDispatch();
  const classes = useStyles();

  const [itemAddedModal, handleItemAddedModal] = useCallback(useState(false));
  const [currentItemAdded, setCurrentItemAdded] = useCallback(useState(null));
  const [currentItemValues, updateCurrentItemValues] = useCallback(
    useState({})
  );

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

  const handleItemUpdate = useCallback(
    (evt) => {
      const numArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
      let itemValues = { ...currentItemValues };
      let total;
      if (
        numArray.includes(evt.target.value[evt.target.value.length - 1]) ||
        evt.target.value === ""
      ) {
        if (evt.target.value === "") {
          total = 0;
        } else total = parseInt(evt.target.value);
        itemValues[`${evt.target.id}`] = total;
        updateCurrentItemValues(itemValues);
      }
    },
    [currentItemValues, updateCurrentItemValues]
  );

  useEffect(() => {
    if (Object.keys(currentItemValues).length === 0) {
      let itemObj = {};
      items.forEach((item) => {
        itemObj[`${item.id}`] = "";
      });
      updateCurrentItemValues(itemObj);
    }
  }, [items, currentItemValues, updateCurrentItemValues]);

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
      {(currentView === "list" && type === "catalog") && (
        <ItemCatalogTable
          currentItems={items ? items : currentItems}
          handlePreview={handlePreview}
        />
      )}
      {(currentView === "grid" && type === "catalog") && (
        <ItemCatalogGrid
          currentItems={items ? items : currentItems}
          handlePreview={handlePreview}
        />
      )}
      {(currentView === "list" && type !== "catalog") && (
        <OrderItemTableView
          type={type}
          currentItems={items ? items : currentItems}
          handlePreview={handlePreview}
          handleAddItem={handleAddItem}
          currentItemValues={currentItemValues}
          handleItemUpdate={handleItemUpdate}
        />
      )}
      {(currentView === "grid" && type !== "catalog") && (
        <OrderPreGridView
          type={type}
          currentItems={items ? items : currentItems}
          handlePreview={handlePreview}
          handleAddItem={handleAddItem}
          currentItemValues={currentItemValues}
          handleItemUpdate={handleItemUpdate}
        />
      )}
    </>
  );
};

OrderItemViewControl.propTypes = {
  type: PropTypes.string.isRequired,
  currentView: PropTypes.string.isRequired,
  handlePreview: PropTypes.func.isRequired,
  items: PropTypes.array
};

export default OrderItemViewControl;
