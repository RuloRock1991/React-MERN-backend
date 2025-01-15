const { check } = require("express-validator");
const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/events");
const validateJWT = require("../middlewares/validate-jwt");
const { Router } = require("express");
const { fieldsValidators } = require("../middlewares/fields-validator");
const isDate = require("../helpers/isDate");


const router = Router();

//Todas tienen que pasar por la validacione del JWT
//Obtener eventos
router.use(validateJWT);

router.get("/", getEvents);

//Crear un nuevo evento
router.post(
    "/",
    [
        check("title", "El titlo es obligatorio").not().isEmpty(),
        check("start", "La fecha de inicio es obligatoria").custom(isDate),
        check("end", "La fecha de fin es obligatoria").custom(isDate),
        fieldsValidators
    ],
    createEvent);

//Actualizar un evento
router.put(
    "/:id",
    [
        check("title", "El titlo es obligatorio").not().isEmpty(),
        check("start", "La fecha de inicio es obligatoria").custom(isDate),
        check("end", "La fecha de fin es obligatoria").custom(isDate),
        fieldsValidators
    ],
    updateEvent);

//Eliminar un evento
router.delete("/:id", deleteEvent);

module.exports = router;