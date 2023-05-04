import "react-tabs/style/react-tabs.css";
import { React, useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@mui/material";
import { getUserDetailsAdmin, logOutAdmin } from "../API/api";
import { useNavigate } from "react-router-dom";
// import HeaderLogo from "../assets/Logo/HeaderLogo.svg";
import HeaderLogo from "../assets/Logo/KristagramLogo.svg";


const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    alignItems: "center",
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    marginTop: "50px",
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      marginTop: "50px",
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    alignItems: "center",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const PersistentDrawer = ({ children }) => {
  const navigate = useNavigate();
  const [res, setRes] = useState();
  useEffect(() => {
    getCriticalAdminFlag();
  }, [res]);

  const getCriticalAdminFlag = async () => {
    const responce = await getUserDetailsAdmin();
    console.log("responce", responce);
    setRes(responce.data.users.flag);
  };

  // console.log("?", res);
  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          elevation={1}
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          style={{ background: "#273746" }}
        >
          <Toolbar style={{ justifyContent: "space-between" }}>
            <Box
              sx={{ height: 34, width: 220 }}
              component="img"
              alt="The house from the offer."
              src={HeaderLogo}
            />
            <Button
              variant="outlined"
              style={{ borderColor: "white", color: "white" }}
              onClick={async () => {
                await logOutAdmin();
                navigate("/", { replace: true });
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
        >
          <Toolbar />
          <Divider />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <Link
                to="/admin"
                style={{ textDecoration: "none", color: "black" }}
              >
                <ListItem>
                  <ListItemText primary="Admin Department" />
                </ListItem>
              </Link>
              <Divider />
              <Link to="/marketing" style={{ textDecoration: "none", color: "black" }}>
                <ListItem>
                  <ListItemText primary="Marketing Department" />
                </ListItem>
              </Link>
              <Divider />
              <Link to="/stakeholder" style={{ textDecoration: "none", color: "black" }}>
                <ListItem>
                  <ListItemText primary="Stake Holder" />
                </ListItem>
              </Link>
              <Divider />
              {console.log("res", res)}
              {res == "true" ? (
                <div>
                  <Link
                    to="/criticaltask"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <ListItem>
                      <ListItemText primary="Critical Task" />
                    </ListItem>
                  </Link>
                  <Divider />
                </div>
              ) : (
                ""
              )}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box>
        <Main>
          {children}
          <Outlet />
        </Main>
      </Box>
    </div>
  );
};

export default PersistentDrawer;
