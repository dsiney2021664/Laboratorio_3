import { Router } from "express";
import { check } from "express-validator";
import {
    getUsers,
    createUser,
    updateUser
} from "./user.controller.js";
import {
    existenteEmail,
    existeUsuarioById,
} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getUsers);

router.post(
    "/",
    [
        check("name", "The name is required").not().isEmpty(),
        check("password", "Password must be greater than 6 characters").isLength({
            min: 6,
        }),
        check("email", "This email is not valid").isEmail(),
        check("email").custom(existenteEmail),
        validarCampos,
    ],
    createUser
);

router.put(
    "/:id",
    [
        check("id", "Not a valid ID").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
);

export default router;