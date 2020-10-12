import React, { useState, useEffect } from "react";
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

  const isLoading = useSelector((state) => state.programs.listIsLoading);
  const options = useSelector((state) => state.programs.programList);

  const loading = open && isLoading;

  useEffect(() => {
    if (program.length >= 1) {
      dispatch(fetchProgramList(program));
    }
  }, [program, dispatch]);

  useEffect(() => {
    if (reset) {
      setProgram("");
      setReset(false);
    }
  }, [reset, setProgram, setReset]);

  return (
    <>
      <Autocomplete
        fullWidth
        className={classes.queryField}
        id="program-auto-complete"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={program}
        onInputChange={(_evt, value) => setProgram(value)}
        onChange={(evt, value) => {
          handleChange(value, "program", filterType);
        }}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Program"
            variant="outlined"
            size="small"
            InputProps={{
              ...params.InputProps,
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
