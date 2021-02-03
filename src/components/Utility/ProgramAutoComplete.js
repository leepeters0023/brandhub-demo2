import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { fetchProgramList } from "../../redux/slices/programsSlice";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

const ProgramAutoComplete = ({
  classes,
  handleChange,
  reset,
  setReset,
  filterType,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [program, setProgram] = useState("");
  const [currentPrograms, setCurrentPrograms] = useState([]);

  const isLoading = useSelector((state) => state.programs.listIsLoading);
  const options = useSelector((state) => state.programs.programList);
  const currentFilterPrograms = useSelector((state) => state.filters.program);

  const loading = open && isLoading;

  const debounce = useRef(null);

  const handlePrograms = (value) => {
    setCurrentPrograms(value);
  };

  const handleQuery = useCallback(() => {
    clearTimeout(debounce.current);

    debounce.current = setTimeout(() => {
      dispatch(fetchProgramList(program));
    }, 250);
  }, [program, dispatch]);

  const handleProgramDisplay = (prog) => {
    if (prog.brands && prog.brands.length === 1) {
      return `${prog.name} - ${prog.brands[0].name}`
    } else if (prog.brands && prog.brands.length > 1) {
      return `${prog.name} - Multiple Brands`
    } else {
      return `${prog.name}`
    }
  }

  useEffect(() => {
    if (program.length >= 1) {
      handleQuery();
    }
  }, [program, handleQuery, dispatch]);

  useEffect(() => {
    if (currentFilterPrograms.length !== currentPrograms.length) {
      setCurrentPrograms(currentFilterPrograms);
    }
  }, [currentFilterPrograms, currentPrograms.length]);

  useEffect(() => {
    if (reset) {
      setProgram("");
      setCurrentPrograms([]);
      setReset(false);
    }
  }, [reset, setProgram, setReset]);

  return (
    <>
      <Autocomplete
        multiple
        freeSolo
        renderTags={() => null}
        fullWidth
        className={classes.queryField}
        classes={{
          popper: classes.liftedPopper,
        }}
        id="program-auto-complete"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={program}
        onInputChange={(_evt, value) => setProgram(value)}
        onChange={(evt, value) => {
          handleChange(value, "program", filterType);
          handlePrograms(value);
        }}
        getOptionSelected={(option, value) => handleProgramDisplay(option) === handleProgramDisplay(value)}
        getOptionLabel={(option) => handleProgramDisplay(option)}
        options={options}
        loading={loading}
        value={currentPrograms}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Program"
            variant="outlined"
            size="small"
            InputProps={{
              ...params.InputProps,
              autoComplete: "new-password",
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={15} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </>
  );
};

ProgramAutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
};

export default ProgramAutoComplete;
