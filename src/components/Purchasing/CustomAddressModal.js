import React from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { setOrderDetails } from "../../redux/slices/patchOrderSlice";

import { useInput } from "../../hooks/InputHooks";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global
}))

const CustomAddressModal = ({ orderSetId, orderType }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  
}