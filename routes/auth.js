/*
Rutas de Usuario / Auth
host + /api/auth
*/

const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

const { createUser, loginUser, renewToken } = require("../controllers/auth");
const { fieldsValidators } = require("../middlewares/fields-validator");
const validateJWT = require("../middlewares/validate-jwt");

router.post(
    "/new",
    [
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("email", "El email es obligatorio").isEmail(),
        check("password", "El password debe contener al menos 6 caracteres").isLength({ min: 6 }),
        fieldsValidators
    ], //middlewares
    createUser);

router.post(
    "/",
    [
        check("email", "El email es obligatorio").isEmail(),
        check("password", "El password debe contener al menos 6 caracteres").isLength({ min: 6 }),
        fieldsValidators
    ],
    loginUser);

router.get("/renew", validateJWT, renewToken);

module.exports = router;