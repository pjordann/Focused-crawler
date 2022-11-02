import "./App.css";
import React, { useState } from "react";
import Principal from "./components/Principal/principal";
import PrincipalAdmin from "./components/PrincipalAdmin/principalAdmin";
import Login from "./components/LoginSignIn/login";
import Registro from "./components/LoginSignIn/registro";
import NotFound from "./components/NotFound/notFound";
import Dashboard from "./components/Dashboard/dashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [loggedIn, setLogin] = useState(false);
  const loguearse = () => {
    setLogin(true);
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login logueado={loggedIn} loguearse={loguearse} />}
        />
        <Route
          path="/registro"
          element={<Registro logueado={loggedIn} loguearse={loguearse} />}
        />
        <Route
          path="/app"
          element={<Principal logueado={loggedIn} loguearse={loguearse} />}
        />
        <Route
          path="/admin"
          element={<PrincipalAdmin logueado={loggedIn} loguearse={loguearse} />}
        />
        <Route
          path="/admin/dashboard"
          element={<Dashboard logueado={loggedIn} loguearse={loguearse} />}
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// si queremos devolverlo a como estaba al principio, directamente quitamos los
// props de los componentes y el hook.
