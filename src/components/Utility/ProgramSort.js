import React, { useState } from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const ProgramSort = ({ setSortOption }) => {
  const [value, setValue] = useState('brand');

  const handleChange = (event) => {
    setValue(event.target.value);
    setSortOption(event.target.value);
  };

  return (
    <FormControl component="fieldset">
      <RadioGroup row aria-label="sortOption" name="sort" value={value} onChange={handleChange}>
        <FormControlLabel value="brand" control={<Radio />} label="Brand" />
        <FormControlLabel value="month" control={<Radio />} label="Focus Month" />
        <FormControlLabel value="unit" control={<Radio />} label="Business Unit" />
      </RadioGroup>
    </FormControl>
  );
}

export default ProgramSort;