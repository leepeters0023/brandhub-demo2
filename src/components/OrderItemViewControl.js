import React from "react";

import OrderInStockTableView from "./OrderItemTableView";
import OrderPreGridView from "./OrderItemGridView";

//mockdata
import items from "../assets/mockdata/Items";

const OrderItemViewControl = (props) => {

  const { type, currentView, handlePreview } = props;

  //const [currentItems, setCurrentItems] = useState(items);

  return (
    <>
      {currentView === "list" && (
        <OrderInStockTableView
          type={type}
          currentItems={items}
          handlePreview={handlePreview}
        />
      )}
      {currentView === "grid" && (
        <OrderPreGridView
          type={type}
          currentItems={items}
          handlePreview={handlePreview}
        />
      )}
    </>
  );
};

export default OrderItemViewControl;
