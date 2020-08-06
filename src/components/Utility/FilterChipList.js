import React from "react";
import PropTypes from "prop-types";

import Chip from "@material-ui/core/Chip";

const FilterChipList = ({ filters, handleChipClick }) => {
  return (
    <>
      {filters.map((filter) => (
        <Chip
          style={{ margin: "auto 2.5px" }}
          color="primary"
          key={filter.value}
          label={filter.value}
          onDelete={() => handleChipClick(filter.type, filter.value)}
        />
      ))}
    </>
  );
};

FilterChipList.propTypes = {
  filters: PropTypes.array.isRequired,
  handleChipClick: PropTypes.func.isRequired,
};

export default FilterChipList;
