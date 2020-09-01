import React, { useState } from "react";

import { useInput } from "../../hooks/UtilityHooks";

import UserTable from "./UserTable";
import EditUserModal from "./EditUserModal";
import UserTerritoryTable from "./UserTerritoryTable";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import AutoComplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

import AddCircleIcon from "@material-ui/icons/AddCircle";

import { regions, keyAccounts } from "../../utility/constants";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  settingsMargin: {
    marginBottom: "15px",
  },
}));

const Users = () => {
  const classes = useStyles();

  const regionArray = regions.map((reg) => reg.name);
  const { value: firstName, bind: bindFirstName } = useInput("");
  const { value: lastName, bind: bindLastName } = useInput("");
  const { value: email, bind: bindEmail } = useInput("");
  const { value: phone, bind: bindPhone } = useInput("");
  const { value: password, bind: bindPassword} = useInput("");

  const [modal, handleModal] = useState(false);
  const [region, setRegion] = useState(null);
  const [keyAccount, setKeyAccount] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [roles, setRoles] = useState({
    fieldOne: false,
    fieldTwo: false,
    compliance: false,
    finance: false,
    supplier: false,
    superUser: false,
  });

  const [regionsList, setRegionsList] = useState([]);
  const [keyAccountList, setKeyAccountList] = useState([]);

  const handleRoleChange = (evt) => {
    setRoles({ ...roles, [evt.target.name]: evt.target.checked });
  };

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

  const {
    fieldOne,
    fieldTwo,
    compliance,
    finance,
    supplier,
    superUser,
  } = roles;
  const error =
    [fieldOne, fieldTwo, compliance, finance, supplier, superUser].filter(
      (v) => v
    ).length < 1;

  const handleFormSubmit = (evt) => {
    evt.preventDefault();
    console.log(evt.target.id);
    //temporarily removing unused vars so build will work on netlify, not permenant
    console.log(firstName, lastName, email, phone, password);
  };

  const handleUserClick = (user) => {
    setCurrentUserId(user);
    handleModal(true);
  };

  const handleModalClose = () => {
    handleModal(false);
  };

  return (
    <>
      <div className={classes.relativeContainer}>
        <Dialog open={modal} onClose={handleModalClose} fullWidth maxWidth="lg">
          <DialogTitle>
            <Typography className={classes.headerText}>
              {`User Id: ${currentUserId}`}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <EditUserModal handleClose={handleModalClose} />
          </DialogContent>
        </Dialog>
      </div>
      <Typography className={classes.titleText}>Add New User</Typography>
      <br />
      <form>
        <TextField
          size="small"
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
          size="small"
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
          size="small"
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
          size="small"
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
          size="small"
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
        <Typography
          className={classes.headerText}
          style={{ marginBottom: "15px" }}
        >
          User Role
        </Typography>

        <FormControl required error={error} component="fieldset">
          <FormLabel component="legend">Pick at least 1</FormLabel>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={fieldOne}
                  onChange={handleRoleChange}
                  name="fieldOne"
                />
              }
              label="Field User Lvl. One"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={fieldTwo}
                  onChange={handleRoleChange}
                  name="fieldTwo"
                />
              }
              label="Field User Lvl. Two"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={compliance}
                  onChange={handleRoleChange}
                  name="compliance"
                />
              }
              label="Compliance"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={finance}
                  onChange={handleRoleChange}
                  name="finance"
                />
              }
              label="Finance"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={supplier}
                  onChange={handleRoleChange}
                  name="supplier"
                />
              }
              label="Supplier"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={superUser}
                  onChange={handleRoleChange}
                  name="superUser"
                />
              }
              label="Super"
            />
          </FormGroup>
        </FormControl>
      </form>
      <br />
      <br />
      <Typography
        className={classes.headerText}
        style={{ marginBottom: "15px" }}
      >
        Region / Key Acct. Assignment
      </Typography>
      <Grid container spacing={2}>
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

      <br />
      <br />
      <Divider />
      <br />
      <br />
      <Typography className={classes.titleText}>Edit Users</Typography>
      <br />
      <UserTable handleUserClick={handleUserClick} />
    </>
  );
};

export default Users;
