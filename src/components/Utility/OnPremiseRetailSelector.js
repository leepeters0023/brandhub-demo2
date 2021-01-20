import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { updateCurrentMarket } from "../../redux/slices/userSlice";

import { fetchPrograms } from "../../redux/slices/programsSlice";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

const OnPremiseRetailSelector = ({ classes }) => {
  const dispatch = useDispatch();

  const isRetail = useSelector((state) => state.user.isRetail);
  const isOnPremise = useSelector((state) => state.user.isOnPremise);
  const currentMarket = useSelector((state) => state.user.currentMarket);
}