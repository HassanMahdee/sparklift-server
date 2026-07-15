import { Router } from "express";
import {
  getAllCampaigns,
  getCampaignById,
  getCampaignsByCreator,
  getFeaturedCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaignController.js";

const router = Router();

router.get("/", getAllCampaigns);
router.get("/featured", getFeaturedCampaigns);
router.get("/creator/:creatorEmail", getCampaignsByCreator);
router.get("/:id", getCampaignById);
router.post("/", createCampaign);
router.patch("/:id", updateCampaign);
router.delete("/:id", deleteCampaign);

export default router;
