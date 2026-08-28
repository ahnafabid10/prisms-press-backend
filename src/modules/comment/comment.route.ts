import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { commentController } from "./comment.controller";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.ADMIN, Role.AUTHOR, Role.USER), commentController.createComment);
router.get("/post/:postId", commentController.getCommentsByPostId);
router.patch("/:id", auth(Role.ADMIN, Role.AUTHOR, Role.USER), commentController.updateComment);
router.delete("/:id", auth(Role.ADMIN, Role.AUTHOR, Role.USER), commentController.deleteComment);

export const commentRoutes = router;
