import React from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { deleteSingleDistributor } from "../../redux/slices/userSlice";

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

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const DistributorTable = ({ distributors, isLoading, id }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleDelete = (distId) => {
    dispatch(deleteSingleDistributor({ id: id, distId: distId}))
  };

  return (
    <>
      <TableContainer className={classes.tableContainer}>
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
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading && distributors.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={8}>
                  <Typography className={classes.headerText}>
                    {`You currently don't have any favorite distributors set...`}
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
                  <TableCell align="right">
                    <Tooltip title="Remove Favorite">
                      <IconButton onClick={() => handleDelete(dist.id)}>
                        <CancelIcon fontSize="small" color="inherit" />
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

DistributorTable.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  distributors: PropTypes.array.isRequired,
};

export default React.memo(DistributorTable);
