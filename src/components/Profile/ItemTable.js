import React from "react";
import PropTypes from "prop-types";

import { formatMoney } from "../../utility/utilityFunctions";

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

const ItemTable = ({ items, isLoading }) => {
  const classes = useStyles();

  const handleDelete = (id) => {
    //TODO write function when api is available
    console.log(id);
  }

  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table stickyHeader className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerText} align="left">
                Preview
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Sequence #
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Program
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Item Type
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Est. Cost
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading && items.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={8}>
                  <Typography className={classes.headerText}>
                    {`You currently don't have any favorite items set...`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              items.length > 0 &&
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell align="left">
                  <img
                    id={item.itemNumber}
                    className={classes.previewImageFloat}
                    src={item.imgUrl}
                    alt={item.itemType}
                  />
                </TableCell>
                  <TableCell align="left">
                    {item.itemNumber}
                  </TableCell>
                  <TableCell align="left">{item.program}</TableCell>
                  <TableCell align="left">{item.itemType}</TableCell>
                  <TableCell align="left">{formatMoney(item.estCost)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Remove Favorite">
                      <IconButton onClick={() => handleDelete(item.id)}>
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
  )
}

ItemTable.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
}

export default React.memo(ItemTable);