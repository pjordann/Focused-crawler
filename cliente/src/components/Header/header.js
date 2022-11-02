import "./header.css";
import AppBar from "@mui/material/AppBar";
import ToolBar from "@mui/material/Toolbar";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

// dependiendo del tipo de usuario, sacamos un icono u otro.
function Icono(tipoUser) {
  if (tipoUser.tipoUser === "admin")
    return <AdminPanelSettingsIcon sx={{ ml: 18 }} />;
  else return <PersonIcon sx={{ ml: 18 }} />;
}

// componente que renderiza la cabecera inicial de los usuarios.
function CustomHeader(props) {
  // hooks para el menú
  const [anchorEl, setAnchorEl] = useState(null);
  const abrir = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // la navegación y función para cerrar sesión
  const navigate = useNavigate();

  // cerrar popup
  const handleClose = () => {
    setAnchorEl(null);
  };

  // cerrar sesión
  const handleCerrarSesion = () => {
    setAnchorEl(null);
    localStorage.clear();
    navigate("/login");
    // props.setloguearse(false)
  };

  // dashboard
  const handleDashboard = () => {
    setAnchorEl(null);
    navigate("/admin/dashboard");
  };

  // configura el menú según tipo de usuario (el admin con el dashboard)
  function FuncionMenu(tipoUser) {
    if (tipoUser.tipoUser !== "admin") {
      return (
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={abrir}
          onClose={handleClose}
        >
          <MenuItem
            sx={{
              fontSize: "14px",
            }}
            onClick={handleCerrarSesion}
          >
            Cerrar Sesión
          </MenuItem>
        </Menu>
      );
    } else {
      return (
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={abrir}
          onClose={handleClose}
        >
          <MenuItem
            sx={{
              fontSize: "14px",
            }}
            onClick={handleCerrarSesion}
          >
            Cerrar Sesión
          </MenuItem>
          <MenuItem
            sx={{
              fontSize: "14px",
            }}
            onClick={handleDashboard}
          >
            Dashboard
          </MenuItem>
        </Menu>
      );
    }
  }

  return (
    <AppBar position="static" sx={{ alignItems: "center" }}>
      <ToolBar>
        <Typography
          className="tituloClickable"
          variant="h6"
          onClick={() => {
            window.location.reload(false);
          }}
        >
          Focused Crawler Endpoint
        </Typography>
        <Icono tipoUser={props.userName} />
        <Button
          sx={{ color: "white", textTransform: "none", fontSize: "16px" }}
          aria-controls={abrir ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={abrir ? "true" : undefined}
          onClick={handleClick}
        >
          {props.userName}
        </Button>
        <FuncionMenu tipoUser={props.userName} />
      </ToolBar>
    </AppBar>
  );
}

export default CustomHeader;

// el static de Appbar es para que todo lo que esté abajo no se incruste por debajo
// de la cabecera. El align Items es para tener todo centrado.
// El botón de Login lo metemos con letras blancas y dejando un margin-left (ml)
// de 20.
