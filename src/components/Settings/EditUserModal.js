import React, { useState } from "react";
import PropTypes from "prop-types";

import { useInput } from "../../hooks/InputHooks";

import UserRoleSelect from "./UserRoleSelect";
import UserTerritoryTable from "./UserTerritoryTable";

import Tooltip from "@material-ui/core/Tooltip";
import AutoComplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";

import { regions, keyAccounts } from "../../utility/constants";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  settingsMargin: {
    marginBottom: "15px",
  },
}));

const EditUserModal = ({ handleClose, userId }) => {
  const classes = useStyles();

  const regionArray = regions.map((reg) => reg.name);
  const { value: firstName, bind: bindFirstName } = useInput("");
  const { value: lastName, bind: bindLastName } = useInput("");
  const { value: email, bind: bindEmail } = useInput("");
  const { value: phone, bind: bindPhone } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");

  const [region, setRegion] = useState(null);
  const [keyAccount, setKeyAccount] = useState(null);
  const [role, setRole] = useState("field1");

  const [regionsList, setRegionsList] = useState([]);
  const [keyAccountList, setKeyAccountList] = useState([]);

  const handleRegion = () => {
    const currentRegions = [...regionsList];
    if (currentRegions.filter((reg) => reg === region).length === 0) {
      currentRegions.push(region);
      setRegionsList(currentRegions);
    }
  };

  const handleKeyAccount = () => {
    const currentKeyAccounts = [...keyAccountList];
    if (currentKeyAccounts.filter((acct) => acct === keyAccount).length === 0) {
      currentKeyAccounts.push(keyAccount);
      setKeyAccountList(currentKeyAccounts);
    }
  };

  const handleRemove = (terr, type) => {
    if (type === "region") {
      const newRegions = regionsList.filter((reg) => reg !== terr);
      setRegionsList(newRegions);
    } else if (type === "keyAccount") {
      const newAccounts = keyAccountList.filter((acct) => acct !== terr);
      setKeyAccountList(newAccounts);
    }
  };

  const handleFormSubmit = (evt) => {
    evt.preventDefault();
    console.log(evt.target.id);
    //temporarily removing unused vars so build will work on netlify, not permenant
    console.log(firstName, lastName, email, phone, password);
  };

  return (
    <>
      <IconButton
        className={classes.closeButton}
        onClick={() => {
          handleClose(false);
        }}
      >
        <CancelIcon fontSize="large" color="secondary" />
      </IconButton>
      <form>
        <TextField
          className={classes.settingsMargin}
          variant="outlined"
          color="secondary"
          name="firstName"
          type="text"
          label="FirstName"
          {...bindFirstName}
          fullWidth
        />
        <TextField
          className={classes.settingsMargin}
          variant="outlined"
          color="secondary"
          name="lastName"
          type="text"
          label="LastName"
          {...bindLastName}
          fullWidth
        />
        <TextField
          className={classes.settingsMargin}
          variant="outlined"
          color="secondary"
          name="email"
          type="email"
          label="Email"
          {...bindEmail}
          fullWidth
        />
        <TextField
          className={classes.settingsMargin}
          variant="outlined"
          color="secondary"
          name="phone"
          type="text"
          label="Phone"
          {...bindPhone}
          fullWidth
        />
        <TextField
          className={classes.settingsMargin}
          variant="outlined"
          color="secondary"
          name="password"
          type="text"
          label="Password"
          {...bindPassword}
          fullWidth
        />
        <br />
        <br />
        <Typography
          className={classes.headerText}
          style={{ marginBottom: "15px" }}
        >
          User Role
        </Typography>
        <UserRoleSelect role={role} setRole={setRole} />
      </form>
      <br />
      <br />
      <Typography
        className={classes.headerText}
        style={{ marginBottom: "15px" }}
      >
        Region / Key Acct. Assignment
      </Typography>
      <Grid container spacing={6}>
        <Grid item md={6} xs={12}>
          <div
            style={{
              display: "flex",
              flexWrap: "none",
              width: "100%",
              alignItems: "center",
            }}
          >
            <AutoComplete
              fullWidth
              value={region}
              onChange={(event, value) => setRegion(value)}
              id="region"
              options={regionArray}
              getOptionLabel={(region) => region}
              renderInput={(params) => (
                <TextField
                  color="secondary"
                  {...params}
                  label="Region"
                  variant="outlined"
                  size="small"
                />
              )}
            />
            <Tooltip title="Add Region">
              <span>
                <IconButton
                  style={{
                    marginLeft: "5px",
                  }}
                  id="addRegion"
                  disabled={region === null}
                  onClick={handleRegion}
                >
                  <AddCircleIcon color="secondary" />
                </IconButton>
              </span>
            </Tooltip>
          </div>
          <br />
          <UserTerritoryTable
            type={"region"}
            territories={regionsList}
            handleRemove={handleRemove}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <div
            style={{
              display: "flex",
              flexWrap: "none",
              width: "100%",
              alignItems: "center",
            }}
          >
            <AutoComplete
              fullWidth
              value={keyAccount}
              onChange={(event, value) => setKeyAccount(value)}
              id="keyAccount"
              options={keyAccounts}
              getOptionLabel={(keyAccount) => keyAccount}
              renderInput={(params) => (
                <TextField
                  color="secondary"
                  {...params}
                  label="Key Account"
                  variant="outlined"
                  size="small"
                />
              )}
            />
            <Tooltip title="Add Key Account">
              <span>
                <IconButton
                  style={{
                    marginLeft: "5px",
                  }}
                  id="addRegion"
                  disabled={keyAccount === null}
                  onClick={handleKeyAccount}
                >
                  <AddCircleIcon color="secondary" />
                </IconButton>
              </span>
            </Tooltip>
          </div>
          <br />
          <UserTerritoryTable
            type={"keyAccount"}
            territories={keyAccountList}
            handleRemove={handleRemove}
          />
        </Grid>
      </Grid>
      <br />
      <br />
      <Button
        className={classes.largeButton}
        variant="contained"
        color="secondary"
        id="profile"
        onClick={handleFormSubmit}
      >
        SUBMIT
      </Button>
    </>
  );
};

EditUserModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default EditUserModal;
