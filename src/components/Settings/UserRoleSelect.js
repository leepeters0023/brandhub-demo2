import React from 'react'

import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  selectedButton: {
    fontWeight: "600",
    fontSize: "1rem",
    textAlign: "center",
    color: "#737373",
  },
}))

const UserRoleSelect = ({role, setRole}) => {
  const classes = useStyles();
  
  return (
    <>
      <ButtonGroup color="secondary" aria-label="role-select">
          <Button
            className={
              role === "field1" ? classes.largeButton : classes.selectedButton
            }
            variant={role === "field1" ? "contained" : "outlined"}
            onClick={() => {
              setRole("field1");
            }}
          >
            FIELD ONE
          </Button>
          <Button
            className={
              role === "field2" ? classes.largeButton : classes.selectedButton
            }
            variant={role === "field2" ? "contained" : "outlined"}
            onClick={() => {
              setRole("field2");
            }}
          >
            FIELD TWO
          </Button>
          <Button
            className={
              role === "compliance"
                ? classes.largeButton
                : classes.selectedButton
            }
            variant={role === "compliance" ? "contained" : "outlined"}
            onClick={() => {
              setRole("compliance");
            }}
          >
            COMPLIANCE
          </Button>
          <Button
            className={
              role === "supplier" ? classes.largeButton : classes.selectedButton
            }
            variant={role === "supplier" ? "contained" : "outlined"}
            onClick={() => {
              setRole("supplier");
            }}
          >
            SUPPLIER
          </Button>
          <Button
            className={
              role === "super" ? classes.largeButton : classes.selectedButton
            }
            variant={role === "super" ? "contained" : "outlined"}
            onClick={() => {
              setRole("super");
            }}
          >
            SUPER-USER
          </Button>
        </ButtonGroup>
    </>
  )
}

export default UserRoleSelect;
