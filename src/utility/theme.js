export default {
  palette: {
    primary: {
      light: "#ffac33",
      main: "#ff9800",
      dark: "#b26a00",
      contrastText: "#fff",
    },
    secondary: {
      light: "#3d6bb3",
      main: "#0d47a1",
      dark: "#093170",
      contrastText: "#fff",
    },
  },
  global: {
    titleImage: {
      display: "flex",
      alignItems: "center",
    },
    titleText: {
      fontWeight: "600",
      fontSize: "1.5rem",
      color: "#4C4C4C",
      marginBottom: "5px",
    },
    logo: {
      width: "100px",
      height: "auto",
      marginRight: "50px",
    },
    headerText: {
      fontWeight: "600",
      fontSize: "1rem",
      color: "#4C4C4C",
    },
    bodyText: {
      fontSize: "1rem",
      color: "#4C4C4C",
    },
    titleBar: {
      display: "flex",
      justifyContent: "space-between",
    },
    largeButton: {
      fontWeight: "500",
      fontSize: "1.3rem",
    },
    tabContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "30px",
    },
    paperContainer: {
      margin: "30px auto 0 auto",
      padding: "20px 25px",
      width: "90vw",
    },
    chipApproved: {
      margin: "0",
      backgroundColor: "#3f51b5",
      width: "125px",
      color: "white",
      fontWeight: "600",
    },
    chipActive: {
      margin: "0",
      backgroundColor: "#4caf50",
      width: "125px",
      color: "white",
      fontWeight: "600",
    },
    chipPending: {
      margin: "0",
      backgroundColor: "#ff9800",
      width: "125px",
      color: "white",
      fontWeight: "600",
    },
    chipCanceled: {
      margin: "0",
      backgroundColor: "#f44336",
      width: "125px",
      color: "white",
      fontWeight: "600",
    },
    modalTabContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }
  },
};
