import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { postController } from "./post.controller";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/my-posts", auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.getMyPosts);
router.get("/:id", postController.getSinglePost);
router.patch("/:id", auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.updatePost);
router.delete("/:id", auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.deletePost);

export const postRoutes = router;
