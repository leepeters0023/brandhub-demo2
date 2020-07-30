export default {
  palette: {
    primary: {
      light: "#bebebe",
      main: "#cbcbcb",
      dark: "#d8d8d8",
      contrastText: "#000000",
    },
    secondary: {
      light: "#737373",
      main: "#595959",
      dark: "#404040",
      contrastText: "#e5e5e5",
    },
  },
  dashboard: {
    paper: {
      height: "100%",
      padding: "40px",
      backgroundColor: "#404040",
    },
    welcomeText: {
      fontWeight: "600",
      color: "#e5e5e5",
    },
    subTitle: {
      fontWeight: "600",
      color: "#e5e5e5",
    },
    content: {
      fontSize: "1.25rem",
      color: "#e5e5e5",
    },
    buttons: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    gridList: {
      flexWrap: "nowrap",
      transform: "translateZ(0)",
    },
    title: {
      color: "#ffac33",
    },
    gridTitleBar: {
      background:
        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
    },
  },
  global: {
    titleImage: {
      display: "flex",
      alignItems: "center",
    },
    previewImg: {
      width: "75px",
      height: "75px",
      borderRadius: "50%",
      objectFit: "cover",
    },
    previewImageFloat: {
      width: "75px",
      height: "75px",
      borderRadius: "50%",
      objectFit: "cover",
      "&:hover": {
        cursor: "pointer",
      },
    },
    mainWrapper: {
      backgroundColor: "#e5e5e5",
      maxWidth: "2000px",
      minHeight: "Calc(100vh - 64px)",
      margin: "0px",
      paddingTop: "24px",
    },
    navList: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      height: "Calc(100% - 64px)",
      marginTop: "64px",
    },
    navItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center"
    },
    navText: {
      fontSize: ".7rem",
      fontWeight: "600",
      color: "#e5e5e5",
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
      fontWeight: "600",
      fontSize: "1rem",
      textAlign: "center",
      color: "#404040"
    },
    tabContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "30px",
    },
    cartContainer: {
      maxHeight: "65vh",
    },
    modalTabContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    centerWrapper: {
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    relativeContainer: {
      position: "relative",
    },
    closeButton: {
      position: "absolute",
      top: "0",
      right: "5px",
    },
    pageBreak: {
      border: "none",
      height: "2px",
      margin: "0",
      flexShrink: "0",
      backgroundColor: "#404040"
    },
    configButtons: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end"
    },
    innerConfigDiv: {
      display: "flex",
      justifyContent: "flex-end"
    }
  },
};
