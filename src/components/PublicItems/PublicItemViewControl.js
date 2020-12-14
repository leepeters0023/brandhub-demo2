import React from "react";
import PropTypes from "prop-types";

import PublicItemGridView from "./PublicItemGridView";
import PublicItemTableView from './PublicItemTableView';

const PublicItemViewControl = ({ currentView, items, handlePreview, isItemsLoading}) => {
  return (
    <>
      {currentView === "list" && (
        <PublicItemTableView
          items={items}
          handlePreview={handlePreview}
          isItemsLoading={isItemsLoading}
        />
      )}
      {currentView === "grid" && (
        <PublicItemGridView
          items={items}
          handlePreview={handlePreview}
          isItemsLoading={isItemsLoading}
        />
      )}
    </>
  )
}

PublicItemViewControl.propTypes = {
  currentView: PropTypes.string.isRequired,
  items: PropTypes.array,
  handlePreview: PropTypes.func.isRequired,
  isItemsLoading: PropTypes.bool.isRequired,
};

export default React.memo(PublicItemViewControl);