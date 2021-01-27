/*
Global styles for the site, handled by Material UI
*/
export default {
  palette: {
    primary: {
      light: "#bebebe",
      main: "#cbcbcb",
      dark: "#d8d8d8",
      contrastText: "#000000",
    },
    secondary: {
      light: "#999999",
      main: "#737373",
      dark: "#595959",
      contrastText: "#000000",
    },
    text: {
      primary: "#4C4C4C",
      secondary: "#737373",
    },
  },
  itemGrid: {
    paperWrapper: {
      backgroundColor: "whitesmoke",
      width: "95%",
      height: "100%",
      padding: "10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
    },
    itemGridContainer: {
      maxWidth: "2000px",
      paddingBottom: "20px",
    },
    previewImg: {
      width: "150px",
      height: "150px",
      borderRadius: "10px",
      objectFit: "cover",
      "&:hover": {
        cursor: "pointer",
      },
    },
    singleItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
    singleItemWrapper: {
      position: "relative",
      width: "100%",
      height: "auto",
      padding: "0 5px",
    },
    checkbox: {
      position: "absolute",
      top: "0px",
      right: "0px",
      padding: "0px",
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
      borderRadius: "10px",
      objectFit: "cover",
    },
    previewImageFloat: {
      width: "75px",
      height: "75px",
      borderRadius: "10px",
      objectFit: "cover",
      "&:hover": {
        cursor: "pointer",
      },
    },
    mainWrapper: {
      backgroundColor: "#FFFFFF",
      maxWidth: "2000px",
      paddingTop: "24px",
    },
    navItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
    navIcon: {
      color: "#FFFFFF",
    },
    navText: {
      fontSize: ".7rem",
      fontWeight: "600",
      color: "#FFFFFF",
    },
    hoverText: {
      "&:hover": {
        cursor: "pointer",
      },
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
      fontWeight: "500",
      fontSize: "1rem",
      color: "#4C4C4C",
    },
    headerListItem: {
      color: "black",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    headerListItemNew: {
      color: "white",
      border: "solid white .5px",
      padding: "7px",
      "&:hover": {
        backgroundColor: "#8397B0",
        boxShadow: "5px 5px 5px rgba(68, 68, 68, 0.6)",
      },
    },
    bodyText: {
      fontSize: ".9rem",
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
      color: "#FFFFFF",
      backgroundColor: "#8397B0",
    },
    tabContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "30px",
    },
    cartContainer: {
      maxHeight: "750px",
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
      backgroundColor: "#737373",
    },
    configButtons: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    },
    innerConfigDiv: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    backdrop: {
      zIndex: 1250,
      color: "#fff",
    },
    showHideFilters: {
      display: "flex",
      flexDirection: "row",
      position: "relative",
      alignItems: "center",
      maxWidth: "150px",
      height: "32px",
      marginRight: "10px",
      "&:hover": {
        cursor: "pointer",
      },
    },
    liftedPopper: {
      zIndex: "2500",
    },
  },
};
