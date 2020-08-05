import React from "react";

import OrderInStockTableView from "./OrderItemTableView";
import OrderPreGridView from "./OrderItemGridView";

//mockdata
import items from "../../assets/mockdata/Items";

const OrderItemViewControl = (props) => {
  const { type, currentView, allPdf, allCart, handlePreview } = props;

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
        />
      )}
      {currentView === "grid" && (
        <OrderPreGridView
          type={type}
          currentItems={items}
          allPdf={allPdf}
          allCart={allCart}
          handlePreview={handlePreview}
        />
      )}
    </>
  );
};

export default OrderItemViewControl;
