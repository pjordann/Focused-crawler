import "./login.css";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { Helmet } from "react-helmet";
import React, { useState } from "react";
import {
  Avatar,
  Button,
  Alert,
  Grid,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { URL_API } from "../../services/apiService";
import { useNavigate } from "react-router-dom";

function Registro(props) {
  /* estilos */
  const paperStyle = {
    width: 300,
    padding: 40,
    height: "100%",
    margin: "0 auto",
    marginTop: "10%",
  };
  const avatarStyle = { backgroundColor: "#E9523E" };
  const btnStyleEntrar = {
    margin: "20px 0px",
    textTransform: "none",
    backgroundColor: "#67B7E2",
  };

  /* para movernos por la app */
  const navigate = useNavigate();

  /* validación campos con yup y formik*/
  const validationSchema = yup.object({
    CampoCorreo: yup
      .string("Introduzca su correo electrónico")
      .email("Introduzca un correo válido")
      .matches(/^(?!admin\b)/i, "Correo inválido")
      .required("Campo requerido"),
    CampoContraseña: yup
      .string("Introduzca su contraseña")
      .min(8, "Mínimo 8 caracteres")
      .required("Campo requerido"),
    ConfirmaContraseña: yup
      .string("Repita la contraseña")
      .required("Campo requerido")
      .oneOf(
        [yup.ref("CampoContraseña"), null],
        "Las constraseñas deben ser idénticas"
      ),
  });

  const formik = useFormik({
    initialValues: {
      CampoCorreo: "",
      CampoContraseña: "",
      ConfirmaContraseña: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let urlRegistro = URL_API + "/users/signin";
      axios
        .post(urlRegistro, {
          email: values.CampoCorreo,
          password: values.CampoContraseña,
        })
        .then((response) => {
          // clean del estado de error
          sethayError(false);
          setMensajeError("");

          // el admin no se registra. Por tanto, save token + save tipo de user
          // + save el correo + redirect a /app
          localStorage.setItem("userToken", response.data.token);
          localStorage.setItem("userTipo", "normal");
          const usuario = values.CampoCorreo.split("@")[0];
          localStorage.setItem("userName", usuario);
          navigate("/app");
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

  /* hooks para los errores en el registro */
  const [hayError, sethayError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  return (
    <>
      <Helmet>
        <title>{"Registro | Focused Crawler"}</title>
      </Helmet>
      <Grid>
        <Paper style={paperStyle}>
          <Grid align={"center"}>
            <Avatar style={avatarStyle}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography marginTop={1} component="h1" variant="h5">
              Registrarse
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
                //type={"email"}
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
              <TextField
                id="ConfirmaContraseña"
                fullWidth
                label="Repita la contraseña"
                type={showPassword ? "text" : "password"}
                placeholder="Introduzca de nuevo la contraseña"
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
                  formik.touched.ConfirmaContraseña &&
                  Boolean(formik.errors.ConfirmaContraseña)
                }
                helperText={
                  formik.touched.ConfirmaContraseña &&
                  formik.errors.ConfirmaContraseña
                }
              />
            </Stack>

            <Button
              fullWidth
              type="submit"
              style={btnStyleEntrar}
              variant={"contained"}
            >
              Registrarse
            </Button>
          </form>

          {/*<Typography>
            <Link href="#" underline={"hover"}>
              Forgot password ?
            </Link>
          </Typography>*/}
          <Typography style={{ fontSize: "14px" }}>
            ¿Ya tienes una cuenta?
            <Link
              href="/login"
              marginLeft={1}
              underline={"hover"}
              //onClick={() => handleChange("event", 1)}
            >
              Entrar
            </Link>
          </Typography>
        </Paper>
      </Grid>
    </>
  );
}

export default Registro;

// login form : https://github.com/MarceloCLopes/login-form-mui-react/blob/master/src/components/Login.jsx

// lo del ojo para dejar ver las pwds : https://stackoverflow.com/questions/60391113/how-to-view-password-from-material-ui-textfield

// la validación con formik y yup : https://formik.org/docs/examples/with-material-ui
