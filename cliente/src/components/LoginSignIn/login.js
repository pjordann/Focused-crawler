import "./login.css";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { Helmet } from "react-helmet";
import React, { useState } from "react";
import {
  Avatar,
  Button,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FaceIcon from "@mui/icons-material/Face";
import { URL_API } from "../../services/apiService";
import { useNavigate } from "react-router-dom";

function Login(props) {
  /* estilos */
  const paperStyle = {
    width: 300,
    padding: 40,
    height: "100%",
    margin: "0 auto",
    marginTop: "10%",
  };
  const avatarStyle = { backgroundColor: "#1BBD7E" };
  const btnStyleEntrar = {
    margin: "20px 0px",
    textTransform: "none",
    backgroundColor: "#67B7E2",
  };
  const btnStyleInvitado = {
    margin: "20px 0px",
    textTransform: "none",
    backgroundColor: "#D9DA64",
  };

  /* para movernos por la app */
  const navigate = useNavigate();

  /* validación campos con yup y formik*/
  const validationSchema = yup.object({
    CampoCorreo: yup
      .string("Introduzca su correo electrónico")
      .email("Introduzca un correo válido")
      .required("Campo requerido"),
    CampoContraseña: yup
      .string("Introduzca su contraseña")
      .required("Campo requerido"),
  });

  const formik = useFormik({
    initialValues: {
      CampoCorreo: "",
      CampoContraseña: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let urlLogin = URL_API + "/users/login";
      axios
        .post(urlLogin, {
          email: values.CampoCorreo,
          password: values.CampoContraseña,
        })
        .then((response) => {
          // respuesta 200, clean del estado de error
          sethayError(false);
          setMensajeError("");
          // save user token + correo del usuario
          localStorage.setItem("userToken", response.data.token);
          const usuario = values.CampoCorreo.split("@")[0];
          localStorage.setItem("userName", usuario);

          // redirigimos a la si página dependiendo de si es admin ó normal
          if (values.CampoCorreo === "admin@admin.com") {
            // redirigimos a /admin (con el buscador especial)
            localStorage.setItem("userTipo", "admin");
            navigate("/admin");
            //props.loguearse(true);
            //navigate("/admin");
          } else {
            // redirigimos a /app (con el buscador normal)
            localStorage.setItem("userTipo", "normal");
            navigate("/app");
            //props.loguearse(true);
            //navigate("/app");
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            sethayError(true);
            setMensajeError(error.response.data.message);
          } else {
            sethayError(true);
            setMensajeError("Error interno. Pruebe más tarde.");
          }
        });
    },
  });

  /* entrar como invitado */
  function loginGuest() {
    // ya no hay error
    sethayError(false);
    setMensajeError("");
    // no hay token
    localStorage.setItem("userName", "Invitado");
    localStorage.setItem("userTipo", "Invitado");
    navigate("/app");
  }

  /* hooks para el ojo del campo Contraseña. Inicialmente a falso (no se muestra)
     la contraseña.
  */
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    if (showPassword) setShowPassword(false);
    else setShowPassword(true);
  };
  const handleMouseDownPassword = () => {
    if (showPassword) setShowPassword(false);
    else setShowPassword(true);
  };

  /* hooks para los errores de inicio de sesión */
  const [hayError, sethayError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  return (
    <>
      <Helmet>
        <title>{"Login | Focused Crawler"}</title>
      </Helmet>
      <Grid>
        <Paper style={paperStyle}>
          <Grid align={"center"}>
            <Avatar style={avatarStyle}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography marginTop={1} component="h1" variant="h5">
              Iniciar sesión
            </Typography>
          </Grid>

          <form onSubmit={formik.handleSubmit}>
            <Stack marginTop={4} spacing={2}>
              {hayError && <Alert severity="error">{mensajeError}</Alert>}
              <TextField
                id="CampoCorreo"
                name="CampoCorreo"
                label="Correo electrónico"
                fullWidth
                placeholder="Introduzca su correo electrónico"
                onChange={formik.handleChange}
                error={
                  formik.touched.CampoCorreo &&
                  Boolean(formik.errors.CampoCorreo)
                }
                helperText={
                  formik.touched.CampoCorreo && formik.errors.CampoCorreo
                }
                autoComplete="off"
              />
              <TextField
                id="CampoContraseña"
                fullWidth
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                placeholder="Introduzca su contraseña"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={formik.handleChange}
                error={
                  formik.touched.CampoContraseña &&
                  Boolean(formik.errors.CampoContraseña)
                }
                helperText={
                  formik.touched.CampoContraseña &&
                  formik.errors.CampoContraseña
                }
              />
            </Stack>
            <Button
              fullWidth
              type="submit"
              style={btnStyleEntrar}
              variant={"contained"}
            >
              Entrar
            </Button>
          </form>

          {/*<Typography>
            <Link href="#" underline={"hover"}>
              Forgot password ?
            </Link>
          </Typography>*/}

          <Divider sx={{ borderBottomWidth: "50px" }}>
            <Typography>o</Typography>
          </Divider>
          <Button
            fullWidth
            type="submit"
            style={btnStyleInvitado}
            variant={"contained"}
            startIcon={<FaceIcon />}
            onClick={() => loginGuest()}
          >
            Login como invitado
          </Button>
          <Typography style={{ fontSize: "14px" }}>
            ¿Todavía no tienes cuenta?
            <Link
              href="/registro"
              marginLeft={1}
              underline={"hover"}
              //onClick={() => handleChange("event", 1)}
            >
              Regístrate
            </Link>
          </Typography>
        </Paper>
      </Grid>
    </>
  );
}

export default Login;

// login form : https://github.com/MarceloCLopes/login-form-mui-react/blob/master/src/components/Login.jsx

// lo del ojo para dejar ver las pwds : https://stackoverflow.com/questions/60391113/how-to-view-password-from-material-ui-textfield

// la validación con formik y yup : https://formik.org/docs/examples/with-material-ui
