import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import {
  addNewOrderItem,
  createNewOrder,
} from "../../redux/slices/currentOrderSlice";

import { useItemUpdate } from "../../hooks/UtilityHooks";

import OrderItemTableView from "./OrderItemTableView";
import OrderPreGridView from "./OrderItemGridView";
import AddItemConfirmation from "../Utility/AddItemConfirmation";
import ItemCatalogTable from "./ItemCatalogTable";
import ItemCatalogGrid from "./ItemCatalogGrid";

//mockdata
import items from "../../assets/mockdata/Items";

let currentItems = items.map((item) => ({
  ...item,
  stock: Math.floor(Math.random() * 10 + 1) * 5,
}));

const OrderItemViewControl = (props) => {
  const { type, currentView, handlePreview, items } = props;
  const dispatch = useDispatch();

  const [currentItemAdded, setCurrentItemAdded] = useCallback(useState(null));
  const { itemValues, handleItemUpdate } = useItemUpdate(items);

  const currentOrderId = useSelector((state) => state.currentOrder.orderNumber);
  const currentItemsByType = useSelector(
    (state) => state.currentOrder[`${type}OrderItems`]
  );

  const handleAddItem = useCallback(
    (item, qty) => {
      let newItem = {
        id: item.id,
        itemNumber: item.itemNumber,
        brand: item.brand,
        itemType: item.itemType,
        price: item.price,
        qty: item.qty,
        imgUrl: item.imgUrl,
        complianceStatus: "pending",
        totalItems: qty,
        estTotal: qty * item.price,
      };

      setCurrentItemAdded(newItem);

      if (!currentOrderId) {
        dispatch(createNewOrder(type, item.id, qty));
      } else {
        console.log(currentItemsByType)
        let currentItem = currentItemsByType.find(
          (i) => i.itemNumber === item.itemNumber
        );
        console.log(currentItem)
        if (currentItem) {
          dispatch(
            addNewOrderItem(
              currentOrderId,
              item.id,
              currentItem.id,
              qty,
              type
            )
          );
        } else {
          dispatch(
            addNewOrderItem(
              currentOrderId,
              item.id,
              undefined,
              qty,
              type
            )
          );
        }
      }
    },
    [dispatch, setCurrentItemAdded, currentItemsByType, currentOrderId, type]
  );

  return (
    <>
      {currentView === "list" && type === "catalog" && (
        <ItemCatalogTable
          currentItems={items ? items : currentItems}
          handlePreview={handlePreview}
        />
      )}
      {currentView === "grid" && type === "catalog" && (
        <ItemCatalogGrid
          currentItems={items ? items : currentItems}
          handlePreview={handlePreview}
        />
      )}
      {currentView === "list" && type !== "catalog" && (
        <OrderItemTableView
          type={type}
          currentItems={items ? items : currentItems}
          handlePreview={handlePreview}
          handleAddItem={handleAddItem}
          currentItemValues={itemValues}
          handleItemUpdate={handleItemUpdate}
          setCurrentItemAdded={setCurrentItemAdded}
        />
      )}
      {currentView === "grid" && type !== "catalog" && (
        <OrderPreGridView
          type={type}
          currentItems={items ? items : currentItems}
          handlePreview={handlePreview}
          handleAddItem={handleAddItem}
          currentItemValues={itemValues}
          handleItemUpdate={handleItemUpdate}
          setCurrentItemAdded={setCurrentItemAdded}
        />
      )}
      {type !== "program" && type !== "catalog" && (
        <AddItemConfirmation type={type} item={currentItemAdded} />
      )}
    </>
  );
};

OrderItemViewControl.propTypes = {
  type: PropTypes.string.isRequired,
  currentView: PropTypes.string.isRequired,
  handlePreview: PropTypes.func.isRequired,
  items: PropTypes.array,
};

export default OrderItemViewControl;
