import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { updateCouponValue } from "../../redux/slices/couponSlice";
import { fetchProgramList } from "../../redux/slices/programsSlice";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

const ProgramSelector = ({
  classes,
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

  return (
    <>
      <Autocomplete
        fullWidth
        className={classes.couponField}
        id="program-selector"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={program}
        onInputChange={(_evt, value) => setProgram(value)}
        onChange={(evt, value) => {
          dispatch(updateCouponValue({key: "program", value: value ? value.name : null}));
        }}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        classes={{
          "popper": classes.popper
        }}
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

ProgramSelector.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default ProgramSelector;