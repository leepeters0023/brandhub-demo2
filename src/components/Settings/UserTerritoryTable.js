import React from "react";
import PropTypes from "prop-types";

import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const UserTerritoryTable = ({ type, territories, handleRemove }) => {
  const classes = useStyles();

  return (
    <>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell className={classes.headerText} align="center">
              Remove
            </TableCell>
            <TableCell className={classes.headerText} align="center">
              {type === "region" ? "Region" : "Key Account"}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {territories.length > 0 ? (
            territories.map((terr) => (
              <TableRow key={terr}>
                <TableCell align="center">
                  <Tooltip title="Remove">
                    <IconButton onClick={() => handleRemove(terr, type)}>
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">{terr}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell />
              <TableCell align="center">
                {type === "region"
                  ? "You have not added a region yet..."
                  : "You have not added a key account yet..."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

UserTerritoryTable.propTypes = {
  type: PropTypes.string,
  territories: PropTypes.array,
  handleRemove: PropTypes.func.isRequired,
};

export default React.memo(UserTerritoryTable, (prev, next) => {
  return (
    prev.type === next.type &&
    prev.territories.length === next.territories.length
  );
});
