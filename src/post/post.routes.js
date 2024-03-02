import { Router } from "express";
import { check } from "express-validator";
import {
    getPosts,
    createPost,
    updatePost,
    deletePost
} from "./post.controller.js";
import {
    existenteEmail,
    existePostById,
} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getPosts);

router.post(
    "/",
    [
        check("title", "Title is required").not().isEmpty(),
        check("category", "Category is required").not().isEmpty(),
        check("mainText", "Main text is required").not().isEmpty(),
        validarCampos, 
        validarJWT  
    ],
    createPost
);

router.put("/:id", validarJWT, updatePost);

router.delete("/:id", validarJWT, deletePost);

export default router;
