import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { setCustomAttention } from "../../redux/slices/distributorSlice";

import EditAttnModal from "./EditAttnModal";

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const DistributorAttnTable = ({ distributors, isLoading }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [currentDist, setCurrentDist] = useCallback(useState(null));
  const [isEditOpen, setEditOpen] = useCallback(useState(false));

  const handleEdit = (id, value) => {
    dispatch(setCustomAttention(id, value));
  };

  const handleEditOpen = (id, value, name) => {
    setCurrentDist({ id: id, attn: value, name: name });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setCurrentDist(null);
    setEditOpen(false);
  };

  return (
    <>
      {currentDist && (
        <EditAttnModal
          id={currentDist.id}
          attention={currentDist.attn}
          dist={currentDist.name}
          handleEdit={handleEdit}
          editOpen={isEditOpen}
          handleClose={handleEditClose}
        />
      )}
      <TableContainer className={classes.tableContainer} style={{maxHeight: "45vh"}}>
        <Table stickyHeader className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerText} align="left">
                Distributor
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Street Address
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                City
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                State
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Zip
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Attention
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading && distributors.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={7}>
                  <Typography className={classes.headerText}>
                    {`There are no distributors that fit your search criteria...`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              distributors.length > 0 &&
              distributors.map((dist) => (
                <TableRow key={dist.id}>
                  <TableCell align="left">{dist.name}</TableCell>
                  <TableCell align="left">
                    {`${dist["street-address-1"]} ${
                      dist["street-address-2"]
                        ? `, ${dist["street-address-2"]} `
                        : ""
                    }`}
                  </TableCell>
                  <TableCell align="left">{dist.city}</TableCell>
                  <TableCell align="left">{dist.state}</TableCell>
                  <TableCell align="left">{dist.zip}</TableCell>
                  <TableCell align="left">{dist.attn}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Attention">
                      <IconButton
                        onClick={() =>
                          handleEditOpen(dist.id, dist.attn, dist.name)
                        }
                      >
                        <EditIcon fontSize="small" color="inherit" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            {isLoading && (
              <TableRow>
                <TableCell align="left" colSpan={8}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

DistributorAttnTable.propTypes = {
  distributors: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default React.memo(DistributorAttnTable);
