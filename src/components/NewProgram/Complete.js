import React from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import Typography from "@material-ui/core/Typography";

const Complete = ({ classes }) => {
  const name = useSelector((state) => state.newProgram.name);
  const startDate = useSelector((state) => state.newProgram.orderStartDate);

  return (
    <>
      <br />
      <br />
      <br />
      <Typography className={classes.headerText}>
        Thank you for your submission!
      </Typography>
      <br />
      <Typography className={classes.bodyText}>
        {`The program ${name} will be available to order on ${startDate}.`}
      </Typography>
    </>
  );
};

Complete.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default React.memo(Complete);
