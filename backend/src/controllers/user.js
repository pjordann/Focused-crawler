/*
 * Implementación de las funciones de las rutas definidas en /routes.
 * En este caso, las del usuario.
 * https://deskevinmendez.medium.com/login-y-register-con-nodejs-express-jwt-y-mongodb-ff329ed25a3f
 */

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const winston = require("winston");
const axios = require("axios");
const { combine, timestamp, align, printf } = winston.format;
const saltRounds = 10;
const User = require("../models/user");

//logging with winston
const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}:\t ${info.message}`)
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/UsersLog.log",
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/UsersLog.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "logs/UsersLog.log" }),
  ],
});

// login
const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // si no me pasan valores o no son strings...
  if (
    email == undefined ||
    password == undefined ||
    typeof email != "string" ||
    typeof password != "string"
  ) {
    return res.status(400).send({ message: "Invalid values" });
  }

  User.findOne({ email }, (err, retrievedUser) => {
    if (err) {
      logger.error("Error en BD -> /login");
      return res.status(500).send({ message: err });
    }
    if (!retrievedUser)
      return res.status(400).send({ message: "Usuario no registrado" });
    else {
      // user with 'email' exists. Let´s prove pw is correct.
      if (!bcrypt.compareSync(password, retrievedUser.password)) {
        return res.status(400).json({
          message: "Contraseña incorrecta",
        });
      }
      // everything OK. jwt is generated.
      const accessToken = jwt.sign(
        { username: email, id: retrievedUser._id },
        process.env.TOKEN_KEY,
        {
          expiresIn: 60 * 60 * 24, // 24 h
        }
      );
      return res
        .status(200)
        .send({ token: accessToken, id: retrievedUser._id });
    }
  });
};

// signin
const signin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // si no me pasan valores o no son strings...
  if (
    email == undefined ||
    password == undefined ||
    typeof email != "string" ||
    typeof password != "string"
  ) {
    return res.status(400).send({ message: "Invalid values" });
  }
  const user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, saltRounds),
    rol: req.body.rol,
  });

  user.save((err, doc) => {
    if (err) {
      logger.error("Error en BD -> /signin");
      return res.status(400).send({
        message: "Ya existe un usuario con ese correo electrónico",
      });
    }

    const accessToken = jwt.sign(
      { username: req.body.email, id: doc._id },
      process.env.TOKEN_KEY,
      {
        expiresIn: 60 * 60 * 24, // 24 h
      }
    );
    return res.status(200).send({ token: accessToken, id: doc._id });
  });
};

// delete account
/*const deleteNuevo = async (req, res) => {
  const userMotivo = req.body.motivo;
  // si no me pasan valores o no son strings...
  if (userMotivo == undefined || typeof userMotivo != "string") {
    return res.status(400).send({ message: "Invalid values" });
  }
  const userToBeDeleted = req.params.id;
  User.findOne({ _id: userToBeDeleted }, (err, retrievedUser) => {
    if (err) {
      logger.error("Error en BD -> User.findOne en /deleteNuevo");
      return res.status(500).send({ message: err });
    }
    if (!retrievedUser)
      return res.status(400).send({ message: "User not registered" });
    else {
      User.deleteOne({ _id: userToBeDeleted }, (err, resp) => {
        if (err) {
          logger.error("Error en BD -> User.deleteOne en /deleteNuevo");
          return res.status(500).send({ message: err });
        }
        if (resp.deletedCount != 0) {
          const arrayMotivos = userMotivo.split(",");
          for (var i = 0; i < arrayMotivos.length; i++) {
            const deletedUser = new DeletedUser({
              email: retrievedUser.email,
              motivo: parseInt(arrayMotivos[i]),
            });
            deletedUser.save();
          }
          return res.status(200).send({ message: "User deleted successfully" });
        } else return res.status(500).send({ message: "Unexpected error" });
      });
    }
  });
};*/

// change user's password
/*const cambiarContrasenyaNuevo = async (req, res) => {
  const newPassword = req.body.password;
  // si no me pasan valores o no son strings...
  if (newPassword == undefined || typeof newPassword != "string") {
    return res.status(400).send({ message: "Invalid values" });
  }

  const userId = req.params.id;
  User.findOne({ _id: userId }, (err, retrievedUser) => {
    if (err) {
      logger.error("Error en BD -> User.findOne en /cambiarContrasenyaNuevo");
      return res.status(500).send({ message: err });
    }
    if (!retrievedUser)
      return res.status(400).send({ message: "User not registered" });
    else {
      User.updateOne(
        { _id: userId },
        { password: bcrypt.hashSync(newPassword, saltRounds) },
        (err) => {
          if (err) {
            logger.error(
              "Error en BD -> User.updateOne en /cambiarContrasenyaNuevo"
            );
            return res.status(500).send({ message: err });
          } else
            return res
              .status(200)
              .send({ message: "Password changed sucessfully" });
        }
      );
    }
  });
};*/

// change user's mail
/*const cambiarCorreoNuevo = async (req, res) => {
  const newMail = req.body.mail;
  // si no me pasan valores o no son strings...
  if (newMail == undefined || typeof newMail != "string") {
    return res.status(400).send({ message: "Invalid values" });
  }
  const userId = req.params.id;
  User.findOne({ _id: userId }, (err, retrievedUser) => {
    if (err) {
      logger.error("Error en BD -> User.findOne en /cambiarCorreoNuevo");
      return res.status(500).send({ message: err });
    }
    if (!retrievedUser)
      return res.status(400).send({ message: "User not registered" });
    else {
      User.updateOne({ _id: userId }, { email: newMail }, (err) => {
        if (err) {
          logger.error("Error en BD -> User.updateOne en /cambiarCorreoNuevo");
          return res.status(500).send({ message: err });
        } else
          return res.status(200).send({ message: "Mail changed sucessfully" });
      });
    }
  });
};*/

// like
const darLike = async (req, res) => {
  // en este punto, si eres invitado no llegas (te rechazan en "auth").
  // aquí sólo puedes ser un usuario con cuenta (con token) o admin. Por tanto,
  // siempre podrás dar Like.
  const id = req.body.id;
  if (id == undefined || typeof id != "string") {
    return res.status(400).send({ message: "Invalid values" });
  }

  User.findOne({ email: req.userr }, (err, retrievedUser) => {
    if (err) {
      logger.error("Error en BD -> User.findOne en darLike");
      return res.status(500).send({ message: err });
    }
    if (retrievedUser.rol == "lector") return res.status(403).send();

    const PATH = process.env.ELASTIC_URL + id;
    axios
      .post(PATH, {
        script: {
          source: "ctx._source.userScoring += 1",
        },
      })
      .then(() => {
        return res.status(200).send();
      })
      .catch(() => {
        return res.status(500).send({
          message: "Lo sentimos! Ha habido un problema con el servidor",
        });
      });
  });
};

// edit
const editar = async (req, res) => {
  const id = req.body.id;
  const doc = req.body.doc;
  // hacer petición si de rol soy editor2
  User.findOne({ email: req.userr }, (err, retrievedUser) => {
    if (err) {
      logger.error("Error en BD -> User.findOne en editar");
      return res.status(500).send({ message: err });
    }
    if (retrievedUser.rol != "editor2" && retrievedUser.rol != "admin")
      return res.status(403).send();

    const PATH = process.env.ELASTIC_URL + id;
    axios
      .post(PATH, {
        doc: doc,
      })
      .then(() => {
        return res.status(200).send();
      })
      .catch((err) => {
        logger.error("Problema con ELASTIC -> axios /editar");
        console.log(err);
        return res.status(500).send({
          message: "Lo sentimos! Ha habido un problema con el servidor",
        });
      });
  });
};

// eliminar tagsChildren
const deleteTagsChildren = async (req, res) => {
  const id = req.body.id;
  // hacer petición si de rol soy editor2
  User.findOne({ email: req.userr }, (err, retrievedUser) => {
    if (err) {
      logger.error("Error en BD -> User.findOne en editar");
      return res.status(500).send({ message: err });
    }
    if (retrievedUser.rol != "editor2" && retrievedUser.rol != "admin")
      return res.status(403).send();

    const PATH = process.env.ELASTIC_URL + id;
    axios
      .post(PATH, {
        script: 'ctx._source.remove("tagsChildren");',
      })
      .then(() => {
        console.log("se ha eliminado");
        return res.status(200).send();
      })
      .catch((err) => {
        logger.error("Problema con ELASTIC -> axios en delete tagsChildren");
        console.log(err);
        return res.status(500).send({
          message: "Lo sentimos! Ha habido un problema con el servidor",
        });
      });
  });
};

// ADMIN. obtains user's penalizations
const obtenerRol = async (req, res) => {
  var filter = req.query.filter;
  // si no me pasan el valor o no es un string (asc/desc)...
  if (filter == undefined || (filter != "asc" && filter != "desc")) {
    return res
      .status(400)
      .send({ message: "Valor no válido para el filtro (asc/desc)" });
  }
  if (req.userr != "admin@admin.com") {
    return res.sendStatus(403);
  } else {
    // get filter type (asc or desc)
    const filtro = req.query.filter;
    console.log("FILTROOO " + req.query.filter + ".");
    User.find(
      { email: { $ne: "admin@admin.com" } },
      { email: 1, rol: 1, signupDate: 1 }
    )
      .sort({ email: filtro })
      .exec(function (err, groupRes) {
        if (err) {
          logger.error("Error en BD -> User.find en /obtenerRol");
          return res.status(500).send({ message: "Error interno" });
        } else res.status(200).send({ message: groupRes });
      });
  }
};

// ADMIN. total registered users.
const totalUsuarios = async (req, res) => {
  if (req.userr != "admin@admin.com") {
    return res.sendStatus(403);
  }
  User.find({ email: { $ne: "admin@admin.com" } }).count((err, result) => {
    if (err) {
      logger.error("Error en BD -> User.find en /totalUsuarios");
      return res.status(500).send({ message: "Error interno" });
    }
    return res.status(200).send({ total: result });
  });
};

// ADMIN. changes user's role.
const cambiarRol = async (req, res) => {
  if (req.userr != "admin@admin.com") {
    return res.sendStatus(403);
  }
  const newRole = req.body.rol;
  // si no me pasan valores o no son strings...
  if (
    newRole == undefined ||
    typeof newRole != "string" ||
    (newRole != "editor1" && newRole != "editor2" && newRole != "lector")
  ) {
    return res.status(400).send({ message: "Invalid values" });
  }
  const userId = req.params.id;
  User.findOne({ _id: userId }, (err, retrievedUser) => {
    if (err) {
      logger.error("Error en BD -> User.findOne en /cambiarRol");
      return res.status(500).send({ message: "Error interno del servidor" });
    }
    if (!retrievedUser)
      return res.status(400).send({ message: "User not registered" });
    else {
      User.updateOne({ _id: userId }, { rol: newRole }, (err) => {
        if (err) {
          logger.error("Error en BD -> User.updateOne en /cambiarRol");
          return res
            .status(500)
            .send({ message: "Error interno del servidor" });
        } else return res.status(200).send();
      });
    }
  });
};

module.exports = {
  login,
  signin,
  darLike,
  editar,
  cambiarRol,
  obtenerRol,
  totalUsuarios,
  deleteTagsChildren,
};
