import { Router } from "express";
import { check } from "express-validator";
import {
    getComment,
    createComment,
    updateComment,
    deleteComment

} from "./comment.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getComment);

router.post(
    "/",
    [
        check("content", "Content is required").not().isEmpty(),
        validarCampos,
        validarJWT
    ],
    createComment
);

router.put("/:id", validarJWT, updateComment);

router.delete("/:id", validarJWT, deleteComment);

export default router;