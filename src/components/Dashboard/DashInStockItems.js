import React from "react";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

//mockdata
import items from "../../assets/mockdata/Items";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  ...theme.dashboard
}))

const DashInStockItems = () => {
  const classes = useStyles()

  return (
    <>
      <Paper variant="outlined" style={{display: "flex", alignItems: "center", height: "Calc(100% - 44px)", padding: "10px"}}>
        <br />
        <List style={{width: "100%"}}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                className={classes.dashboardAvatar}
                alt={items[0].brand}
                src={`${items[0].imgUrl}`}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${items[0].brand}-${items[0].itemType}`}
              secondary={
                <>
                  <Typography
                    component="span"
                    className={classes.bodyText}
                    style={{display: "inline"}}
                    color="textSecondary"
                  >
                    {`${items[0].itemNumber}  -  ${items[0].qty}  -  $${items[0].price.toFixed(2)}`}
                  </Typography>
                </>
              }
            />
          </ListItem>
          <Divider />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                className={classes.dashboardAvatar}
                alt={items[1].brand}
                src={`${items[1].imgUrl}`}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${items[1].brand}-${items[1].itemType}`}
              secondary={
                <>
                  <Typography
                    component="span"
                    className={classes.bodyText}
                    style={{display: "inline"}}
                    color="textSecondary"
                  >
                    {`${items[1].itemNumber}  -  ${items[1].qty}  -  $${items[1].price.toFixed(2)}`}
                  </Typography>
                </>
              }
            />
          </ListItem>
          <Divider />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                className={classes.dashboardAvatar}
                alt={items[2].brand}
                src={`${items[2].imgUrl}`}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${items[2].brand}-${items[2].itemType}`}
              secondary={
                <>
                  <Typography
                    component="span"
                    className={classes.bodyText}
                    style={{display: "inline"}}
                    color="textSecondary"
                  >
                    {`${items[2].itemNumber}  -  ${items[2].qty}  -  $${items[2].price.toFixed(2)}`}
                  </Typography>
                </>
              }
            />
          </ListItem>
          <Divider />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                className={classes.dashboardAvatar}
                alt={items[3].brand}
                src={`${items[3].imgUrl}`}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${items[3].brand}-${items[3].itemType}`}
              secondary={
                <>
                  <Typography
                    component="span"
                    className={classes.bodyText}
                    style={{display: "inline"}}
                    color="textSecondary"
                  >
                    {`${items[3].itemNumber}  -  ${items[3].qty}  -  $${items[3].price.toFixed(2)}`}
                  </Typography>
                </>
              }
            />
          </ListItem>
        </List>
      </Paper>
    </>
  )
}

export default DashInStockItems;