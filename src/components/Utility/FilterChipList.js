import React from 'react'

import Chip from "@material-ui/core/Chip"

const FilterChipList = ({ filters, handleChipClick }) => {

  return (
    <>
      {filters.map((filter) => (
        <Chip
        style={{margin: "auto 2.5px"}}
        color="primary"
        key={filter.value}
        label={filter.value}
        onDelete={() => handleChipClick(filter.type, filter.value)}
      />
      ))}
    </>
  )
}

export default FilterChipList;
