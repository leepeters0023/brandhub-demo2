import React from "react";
import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Helmet from "react-helmet";

const useStyles = makeStyles((theme) => ({
    ...theme.global,
    mainWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    singleItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "40px",
        padding: "10px",
      },
}));

const Project = () => {
    const classes = useStyles();
    return (
        <>
        <Helmet>
        <title> Project Status</title>
      </Helmet>
        <Container
            className={classes.mainWrapper}
        >
            <div style={{ height: "100%", width: "1440px", marginTop: "50px"}}>
                <img style={{width: "100%"}} src="https://res.cloudinary.com/joshdowns-dev/image/upload/v1607707175/Select/Programs_joxfpq.png" />
            </div>
        </Container>
        </>

    );
};

Project.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default Project;
