import React from "react";
import PropTypes from "prop-types";

import SharedItemGridView from "./SharedItemGridView";
import SharedItemTableView from "./SharedItemTableView";

const SharedItemViewControl = ({
  currentView,
  items,
  handlePreview,
  isItemsLoading,
}) => {
  return (
    <>
      {currentView === "list" && (
        <SharedItemTableView
          items={items}
          handlePreview={handlePreview}
          isItemsLoading={isItemsLoading}
        />
      )}
      {currentView === "grid" && (
        <SharedItemGridView
          items={items}
          handlePreview={handlePreview}
          isItemsLoading={isItemsLoading}
        />
      )}
    </>
  );
};

SharedItemViewControl.propTypes = {
  currentView: PropTypes.string.isRequired,
  items: PropTypes.array,
  handlePreview: PropTypes.func.isRequired,
  isItemsLoading: PropTypes.bool.isRequired,
};

export default React.memo(SharedItemViewControl);
