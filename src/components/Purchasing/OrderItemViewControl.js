import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import {
  addNewOrderItem,
  createNewOrder,
} from "../../redux/slices/currentOrderSlice";

import OrderItemTableView from "./OrderItemTableView";
import OrderPreGridView from "./OrderItemGridView";
import AddItemConfirmation from "../Utility/AddItemConfirmation";
import ItemCatalogTable from "./ItemCatalogTable";
import ItemCatalogGrid from "./ItemCatalogGrid";

const OrderItemViewControl = (props) => {
  const { type, currentView, handlePreview, items, catalogType, secondaryAddFunction } = props;
  const dispatch = useDispatch();

  const [currentItemAdded, setCurrentItemAdded] = useCallback(useState(null));

  const currentOrderId = useSelector((state) => state.currentOrder.orderId);

  const handleAddItem = useCallback(
    (item, remove) => {
      let newItem = {
        brand: item.brand,
        itemType: item.itemType,
      };

      if (secondaryAddFunction) {
        secondaryAddFunction(item, remove)
      } else {
        setCurrentItemAdded(newItem);
        if (!currentOrderId) {
          dispatch(createNewOrder(type, item.id));
        } else {
          dispatch(addNewOrderItem(currentOrderId, item.id, type))
        }
      }
    },
    [dispatch, secondaryAddFunction, setCurrentItemAdded, currentOrderId, type]
  );

  return (
    <>
      {currentView === "list" && type === "catalog" && (
        <ItemCatalogTable
          currentItems={items}
          handlePreview={handlePreview}
          catalogType={catalogType}
        />
      )}
      {currentView === "grid" && type === "catalog" && (
        <ItemCatalogGrid
          currentItems={items}
          handlePreview={handlePreview}
          catalogType={catalogType}
        />
      )}
      {currentView === "list" && type !== "catalog" && (
        <OrderItemTableView
          type={type}
          currentItems={items}
          handlePreview={handlePreview}
          handleAddItem={handleAddItem}
          setCurrentItemAdded={setCurrentItemAdded}
        />
      )}
      {currentView === "grid" && type !== "catalog" && (
        <OrderPreGridView
          type={type}
          currentItems={items}
          handlePreview={handlePreview}
          handleAddItem={handleAddItem}
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

export default React.memo(OrderItemViewControl, (prev, next) => {
  return (
    prev.type === next.type &&
    prev.currentView === next.currentView &&
    prev.items.length === next.items.length
  )
});
