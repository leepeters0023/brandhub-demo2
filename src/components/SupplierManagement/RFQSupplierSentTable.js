import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";

import TableCell from "@material-ui/core/TableCell";
import { makeStyles } from "@material-ui/core/styles";

const EnhancedTableHead = (props) => {
  const { classes, rowCount, onSelectAllClick, numSelected } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell align="left" className={classes.headerText}>
          Supplier
        </TableCell>
        <TableCell padding="checkbox" align="right">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all items" }}
          />
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const RFQSupplierSentTable = ({
  currentSuppliers,
  isLoading,
  suppliersSelected,
  setSuppliersSelected,
  currentBids,
}) => {
  const classes = useStyles();
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = currentSuppliers.map((sup) => sup.id);
      setSuppliersSelected(newSelecteds);
      return;
    }
    setSuppliersSelected([]);
  };

  const handleClick = (_event, id) => {
    const selectedIndex = suppliersSelected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(suppliersSelected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(suppliersSelected.slice(1));
    } else if (selectedIndex === suppliersSelected.length - 1) {
      newSelected = newSelected.concat(suppliersSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        suppliersSelected.slice(0, selectedIndex),
        suppliersSelected.slice(selectedIndex + 1)
      );
    }

    setSuppliersSelected(newSelected);
  };

  const isSelected = (id) => suppliersSelected.indexOf(id) !== -1;

  useEffect(() => {
    if (
      (filteredSuppliers.length === 0 &&
      currentBids.length > 0 &&
      currentSuppliers.length > 0 &&
      currentBids.length !== currentSuppliers.length) ||
      (filteredSuppliers.length + currentBids.length !== currentSuppliers.length)
    ) {
      let newSuppliers = [...currentSuppliers];
      currentBids.forEach((bid) => {
        newSuppliers = newSuppliers.filter((sup) => sup.id !== bid.supplierId);
      });
      setFilteredSuppliers(newSuppliers);
    }
  }, [filteredSuppliers, currentSuppliers, currentBids.length, currentBids]);

  return (
    <>
      <TableContainer
        className={classes.TableContainer}
        style={{ width: "75%", minWidth: "600px" }}
      >
        <Table className={classes.table}>
          <EnhancedTableHead
            classes={classes}
            numSelected={suppliersSelected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={4}
          />
          <TableBody>
            {isLoading && currentSuppliers.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              filteredSuppliers.length > 0 &&
              filteredSuppliers.map((sup, index) => {
                const isSupplierSelected = isSelected(sup.id);
                const labelId = `supplier-checked-${index}`;
                return (
                  <TableRow key={sup.id}>
                    <TableCell align="left">{sup.name}</TableCell>
                    <TableCell align="right" padding="checkbox">
                      <Checkbox
                        checked={isSupplierSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => {
                          handleClick(event, sup.id);
                          event.stopPropagation();
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            {!isLoading &&
              filteredSuppliers.length === 0 &&
              currentSuppliers.length > 0 &&
              currentSuppliers.map((sup, index) => {
                const isSupplierSelected = isSelected(sup.id);
                const labelId = `supplier-checked-${index}`;
                return (
                  <TableRow key={sup.id}>
                    <TableCell align="left">{sup.name}</TableCell>
                    <TableCell align="right" padding="checkbox">
                      <Checkbox
                        checked={isSupplierSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => {
                          handleClick(event, sup.id);
                          event.stopPropagation();
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

RFQSupplierSentTable.propTypes = {
  suppliersSelected: PropTypes.array.isRequired,
  setSuppliersSelected: PropTypes.func.isRequired,
};

export default RFQSupplierSentTable;
