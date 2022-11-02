/*
 * Rutas de nuestra aplicación web. La implementación de las funciones
 * se encuentra en /controllers.
 */

const { Router } = require("express");
const router = Router();
const userController = require("../controllers/user");
// jwt
const jwt = require("jsonwebtoken");

// -- middleware --
// if jwt is sent in request --> OK
// but if jwt is not sent or incorrect --> NOT OK
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    //quito lo de Bearer, palabra que se pone automáticamente en las peticiones HTTP
    const token = authHeader.split(" ")[1];
    //verify if sent token is valid
    jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
      if (err) {
        console.log("rechazado por no ser correcto el token");
        return res.sendStatus(403);
      }
      //leave in req.user the user's username.
      req.userr = user.username;
      req.userId = user.id;
      next();
    });
  } else {
    // no authHeader -> no authentication
    console.log("rechazado por no tener la cabecera de autenticacion");
    res.sendStatus(401);
  }
};

//home page
router.get("/", (req, res) => {
  console.log("Petición a la página de inicio");
  res.send("API running...");
});

// test route
router.get("/test", auth, (req, res) => {
  console.log("Authorized. Username: " + req.userr);
  res.send("Authorized. Username: " + req.userr);
});

// User's schema
/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          description: user's email
 *        password:
 *          type: string
 *          description: user's password
 *      required:
 *        - email
 *        - password
 *      example:
 *        email: example@gmail.com
 *        password: iamexample1234
 *    Rol:
 *      type: object
 *      example:
 *        email: "example@gmail.com"
 *        rol: "editor2"
 *  responses:
 *    UnauthorizedError:
 *      description: Access token is missing
 *    NotValidError:
 *      description: Access token is invalid
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 */

// login
/**
 * @swagger
 * /users/login:
 *  post:
 *    summary: Logs new user
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: User successfully logged in
 *        content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: User's token for following api calls
 *                id:
 *                  type: string
 *                  description: User's id for future api calls
 *              example:
 *                token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImV4YW1wbGVAZ21haWwuY29tIiwiaWF0IjoxNjUwNTYzMjQ5LCJleHAiOjE2NTA2NDk2NDl9.f1NcFQ-TIPRbHbdPDJNRnpuqBS2uEpvrJjrElbMW-RQ
 *                id: 62795e42312401ed8495e677
 *      400:
 *        description: User cannot be logged in (user not registered or incorret pw).
 *        content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: error message
 *              example:
 *                message: User or password is incorrect
 *      500:
 *        description: Internal server error.
 *        content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: server's error message
 */
router.post("/users/login", userController.login);

// signin
/**
 * @swagger
 * /users/signin:
 *  post:
 *    summary: Signs in new user
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: User successfully signed in
 *        content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: User's token for following api calls
 *                id:
 *                  type: string
 *                  description: User's id for future calls
 *              example:
 *                token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImV4YW1wbGVAZ21haWwuY29tIiwiaWF0IjoxNjUwNTYzMjQ5LCJleHAiOjE2NTA2NDk2NDl9.f1NcFQ-TIPRbHbdPDJNRnpuqBS2uEpvrJjrElbMW-RQ
 *                id: 62795e42312401ed8495e677
 *      400:
 *        description: User cannot be signed in (already exists created user with that name).
 *        content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: error message
 *              example:
 *                message: Error. User already created with that name
 */
router.post("/users/signin", userController.signin);

// like
/**
 * @swagger
 * /like:
 *  put:
 *    summary: Likes a document
 *    security:
 *      - bearerAuth: []
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            example:
 *              id: "https%3A%2F%2Fexample.com"
 *    responses:
 *      200:
 *        description: Document liked
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/NotValidError'
 *      500:
 *        description: Internal server error.
 *        content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: server's error message
 */
router.put("/like", auth, userController.darLike);

// editar
/**
 * @swagger
 * /editar:
 *  put:
 *    summary: Updates a document
 *    security:
 *      - bearerAuth: []
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            example:
 *              id: "https%3A%2F%2Fexample.com"
 *              doc: new fields to update
 *    responses:
 *      200:
 *        description: Document updated
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/NotValidError'
 *      500:
 *        description: Internal server error.
 *        content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: server's error message
 */
router.put("/editar", auth, userController.editar);

// delete tags children
/**
 * @swagger
 * /tagsChildren:
 *  delete:
 *    summary: Deletes field "tagsChildren" of a document
 *    security:
 *      - bearerAuth: []
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            example:
 *              id: "https%3A%2F%2Fexample.com"
 *    responses:
 *      200:
 *        description: tagsChildren deleted
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/NotValidError'
 *      500:
 *        description: Internal server error.
 *        content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: server's error message
 */
router.post("/tagsChildren", auth, userController.deleteTagsChildren);

/*
 *
 ******** ADMIN
 *
 *
 */

// obtener rol de los usuarios
/**
 * @swagger
 * /users:
 *  get:
 *    summary: ADMIN ONLY. Obtains every user-role pair
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: filter
 *        schema:
 *          type: string
 *          example: asc
 *        description: type of ordering (asc or desc)
 *    tags: [Admin]
 *    responses:
 *      200:
 *        description: All user-role pairs are obtained
 *        content:
 *          'application/json':
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Rol'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/NotValidError'
 *      500:
 *        description: Internal server error.
 *        content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: server's error message
 */
router.get("/users", auth, userController.obtenerRol);

// obtener número total de usuarios registrados
/**
 * @swagger
 * /users/total:
 *  get:
 *    summary: ADMIN ONLY. Obtains total number of registered users
 *    security:
 *      - bearerAuth: []
 *    tags: [Admin]
 *    responses:
 *      200:
 *        description: Total de usuarios registrados
 *        content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                total:
 *                  type: number
 *                  description: Total de usuarios registrados
 *              example:
 *                total: 8
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/NotValidError'
 *      500:
 *        description: Internal server error.
 *        content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: server's error message
 */
router.get("/users/total", auth, userController.totalUsuarios);

// cambiar rol
/**
 * @swagger
 * /users/{id}/rol:
 *  put:
 *    summary: Change user's role
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: integer
 *        description: User's ID which role is updated.
 *        example: 62795e42312401ed8495e677
 *    tags: [Admin]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              rol:
 *                type: string
 *                description: user's new role
 *            required:
 *              - rol
 *            example:
 *              rol: editor2
 *    responses:
 *      200:
 *        description: Role was changed successfully
 *      400:
 *        description: User not registered/Invalid values
 *        content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: User not registered/Invalid values
 *              example:
 *                message: User not registered/Invalid values
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/NotValidError'
 *      500:
 *        description: Internal server error.
 *        content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: server's error message
 */
router.put("/users/:id/rol", auth, userController.cambiarRol);

module.exports = router;
