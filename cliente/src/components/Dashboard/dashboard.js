import "./dashboard.css";
import * as React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import CustomHeader from "../Header/header";
import { URL_API } from "../../services/apiService";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Breadcrumbs,
  Link,
  IconButton,
} from "@mui/material/";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import EditIcon from "@mui/icons-material/Edit";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  width: 410,
  iconColor: "white",
  customClass: {
    popup: "colored-toast",
  },
  showConfirmButton: false,
  timer: 3000,
});

const columns = [
  { id: "email", label: "Usuario" },
  { id: "signupDate", label: "Fecha de registro", format: "date" },
  { id: "rol", label: "Rol" },
  { id: "editar", label: "Editar rol" },
];

// función que saca los usuarios totales
function UsuariosTotales(setCantidad) {
  const tokenValue = localStorage.getItem("userToken");
  const URL_TOTAL_USUARIOS_REGISTRADOS = URL_API + "/users/total";
  axios
    .get(URL_TOTAL_USUARIOS_REGISTRADOS, {
      headers: { Authorization: `Bearer ${tokenValue}` },
    })
    .then((response) => {
      setCantidad(response.data.total);
    })
    .catch((err) => {
      setCantidad(-1);
    });
}

// función que llama a la API para hacer el cambio al nuevo usuario
function cambiarRolAPI(id, nuevorol, rows, setRows, index) {
  const tokenValue = localStorage.getItem("userToken");
  let URL_CAMBIAR_ROL = URL_API + "/users/" + id + "/rol";
  axios
    .put(
      URL_CAMBIAR_ROL,
      {
        rol: nuevorol,
      },
      {
        headers: { Authorization: `Bearer ${tokenValue}` },
      }
    )
    .then(() => {
      Toast.fire({
        icon: "success",
        title: "Rol actualizado",
      });
      let newRows = rows;
      newRows[index]["rol"] = nuevorol;
      setRows([...newRows]);
    })
    .catch(() => {
      Toast.fire({
        icon: "error",
        title: "Error en el servidor",
      });
    });
}

// pop-up que cambia el rol directamente.
function cambiarRol(username, role, id, rows, index, setRows) {
  const swalCustom = Swal.mixin({
    customClass: {
      title: "tituloPopUp",
      input: "customInput",
    },
  });
  swalCustom.fire({
    title: "Nuevo rol para " + `<span class="user">${username}</span>`,
    input: "select",
    inputOptions: {
      editor1: "Editor nivel 1",
      editor2: "Editor nivel 2",
      lector: "Lector",
    },
    inputPlaceholder: "Seleccione un rol",
    inputValue: role,
    showCancelButton: true,
    confirmButtonText: "Cambiar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    inputValidator: (value) => {
      if (value === "") {
        // aquí no se entra nunca pq siempre hay una opción marcada por defecto
        return "Seleccione el nuevo rol, por favor";
      } else {
        // petición a la API
        cambiarRolAPI(id, value, rows, setRows, index);
      }
    },
  });
}

// componente Dashboard
function Dashboard(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // hook para los usuarios totales
  const [cantidad, setCantidad] = React.useState(0);
  // cargamos el número de usuarios totales
  UsuariosTotales(setCantidad);

  // hooks para renderizar una vez obtenida la respuesta de la API
  const [isLoading, setLoading] = useState(true);
  const [rows, setRows] = useState();
  // hacemos la llamada y al recibir respuesta, metemos setLoading a falso.
  useEffect(() => {
    const tokenValue = localStorage.getItem("userToken");
    const URL_LISTADO_USUARIOS = URL_API + "/users";
    axios
      .get(URL_LISTADO_USUARIOS, {
        headers: { Authorization: `Bearer ${tokenValue}` },
        params: { filter: "asc" },
      })
      .then((response) => {
        console.log(response);
        setRows(response.data.message);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // rebotar al login si no has iniciado sesión
  if (
    localStorage.getItem("userToken") == null ||
    localStorage.getItem("userTipo") !== "admin"
  ) {
    return <Navigate to="/login" />;
  }

  // si no tengo la data de la API, no renderizo nada
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <CustomHeader userName="admin" />
      <br />
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          sx={{ display: "flex", alignItems: "center" }}
          color="inherit"
          href="/admin"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Link
          underline="hover"
          sx={{ display: "flex", alignItems: "center" }}
          color="inherit"
          href="/admin/dashboard"
        >
          <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
      </Breadcrumbs>
      <br />
      <br />
      <div>
        <Typography>Cantidad de usuarios registrados: {cantidad}</Typography>
      </div>
      <br />
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sx={{ backgroundColor: "orange" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      style={
                        index % 2
                          ? { background: "#DDDDDD" }
                          : { background: "white" }
                      }
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        if (value !== undefined) {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format === "date"
                                ? value.split("T")[0]
                                : value}
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell key={column.id} align="left">
                              <IconButton>
                                <EditIcon
                                  onClick={cambiarRol.bind(
                                    this,
                                    row["email"],
                                    row["rol"],
                                    row["_id"],
                                    rows,
                                    index,
                                    setRows
                                  )}
                                />
                              </IconButton>
                            </TableCell>
                          );
                        }
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default Dashboard;
