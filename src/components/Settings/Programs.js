import React from 'react'

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}))

const Programs = () => {
  const classes = useStyles()
  return (
    <>
      <Typography className={classes.titleText}>TBD</Typography>
    </>
  )
}

export default Programs;