import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { addStockItem } from "../../redux/slices/inStockOrderSlice";
import { addDemandItem } from "../../redux/slices/onDemandOrderSlice";

import OrderItemTableView from "./OrderItemTableView";
import OrderPreGridView from "./OrderItemGridView";
import AddItemConfirmation from "../Utility/AddItemConfirmation";
import ItemCatalogTable from "./ItemCatalogTable";
import ItemCatalogGrid from "./ItemCatalogGrid";

//mockdata
import items from "../../assets/mockdata/Items";

let currentItems = items.map((item) => ({...item, stock: Math.floor(Math.random() * 10 + 1) * 5}))

const OrderItemViewControl = (props) => {
  const { type, currentView, handlePreview, items } = props;
  const dispatch = useDispatch();

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

    if (type === "inStock") {
      dispatch(addStockItem("1", newItem, newItem.qty))
    } else if ( type === "onDemand") {
      dispatch(addDemandItem("1", newItem, newItem.qty))
    }
  }, [dispatch, type, setCurrentItemAdded])

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
          setCurrentItemAdded={setCurrentItemAdded}
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
          setCurrentItemAdded={setCurrentItemAdded}
        />
      )}
      <AddItemConfirmation type={type} item={currentItemAdded} />
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
