import React from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";
import { addItem } from "../../redux/slices/programTableSlice";

import OrderInStockTableView from "./OrderItemTableView";
import OrderPreGridView from "./OrderItemGridView";

//mockdata
import items from "../../assets/mockdata/Items";

const OrderItemViewControl = (props) => {
  const { type, currentView, allPdf, allCart, handlePreview, currentProgram } = props;

  const dispatch = useDispatch();

  const handleAddItem = (item) => {
    dispatch(addItem({program: currentProgram.id, item}))
  }
  //const [currentItems, setCurrentItems] = useState(items);

  return (
    <>
      {currentView === "list" && (
        <OrderInStockTableView
          type={type}
          currentItems={items}
          allPdf={allPdf}
          allCart={allCart}
          handlePreview={handlePreview}
          handleAddItem={handleAddItem}
        />
      )}
      {currentView === "grid" && (
        <OrderPreGridView
          type={type}
          currentItems={items}
          allPdf={allPdf}
          allCart={allCart}
          handlePreview={handlePreview}
          handleAddItem={handleAddItem}
        />
      )}
    </>
  );
};

OrderItemViewControl.propTypes = {
  type: PropTypes.string.isRequired,
  currentView: PropTypes.string.isRequired,
  allPdf: PropTypes.bool,
  allCart: PropTypes.bool,
  handlePreview: PropTypes.func.isRequired,
  currentProgram: PropTypes.object
};

export default OrderItemViewControl;
