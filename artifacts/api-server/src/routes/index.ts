import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import validationsRouter from "./validations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(validationsRouter);

export default router;
