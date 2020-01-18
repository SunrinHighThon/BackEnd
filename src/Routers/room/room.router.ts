import * as express from "express"
import { Create,Join,Leave } from "./room.controller";

const router = express.Router();

router.post("/create",Create);
router.post("/join", Join);
router.post("/leave",Leave);
export default router
