import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db/mongodb.js";
import { CreateCampaignDTO, UpdateCampaignDTO } from "../types/campaign.js";

export const getAllCampaigns = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { search, category, status, sort, order, page, limit = "10" } = req.query;

    const db = getDb();
    const filter: Record<string, unknown> = {};

    if (search && typeof search === "string") {
      filter.title = { $regex: search, $options: "i" };
    }

    if (category && typeof category === "string") {
      filter.category = category;
    }

    if (status && typeof status === "string") {
      filter.status = status;
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const sortField = sort as string;
    const sortOrder = order === "asc" ? 1 : -1;

    const campaigns = await db
      .collection("campaigns")
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limitNum)
      .toArray();

    const total = await db.collection("campaigns").countDocuments(filter);

    res.status(200).json({
      campaigns,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};

export const getCampaignById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid campaign ID" });
      return;
    }

    const db = getDb();
    const campaign = await db
      .collection("campaigns")
      .findOne({ _id: new ObjectId(id) });

    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    res.status(200).json(campaign);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    res.status(500).json({ error: "Failed to fetch campaign" });
  }
};

export const getCampaignsByCreator = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { creatorEmail } = req.params;

    const db = getDb();
    const filter: Record<string, unknown> = { creatorEmail };

    const campaigns = await db.collection("campaigns").find(filter).toArray();

    const total = await db.collection("campaigns").countDocuments(filter);

    res.status(200).json({
      campaigns,
      pagination: {
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching campaigns by creator:", error);
    res.status(500).json({ error: "Failed to fetch campaigns by creator" });
  }
};

export const getFeaturedCampaigns = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const db = getDb();
    const filter: Record<string, unknown> = { featured: true };

    const campaigns = await db.collection("campaigns").find(filter).toArray();

    const total = await db.collection("campaigns").countDocuments(filter);

    res.status(200).json({
      campaigns,
      pagination: {
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching featured campaigns:", error);
    res.status(500).json({ error: "Failed to fetch featured campaigns" });
  }
};

export const createCampaign = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const campaignData: CreateCampaignDTO = req.body;

    if (
      !campaignData.title ||
      !campaignData.description ||
      !campaignData.status ||
      !campaignData.creatorEmail
    ) {
      res.status(400).json({
        error: "Title, description, status, and creatorEmail are required",
      });
      return;
    }

    const db = getDb();
    const newCampaign = {
      ...campaignData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("campaigns").insertOne(newCampaign);

    res.status(201).json({
      _id: result.insertedId,
      ...newCampaign,
    });
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ error: "Failed to create campaign" });
  }
};

export const updateCampaign = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateCampaignDTO = req.body;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid campaign ID" });
      return;
    }

    const db = getDb();
    const updateDoc = {
      $set: {
        ...updateData,
        updatedAt: new Date(),
      },
    };

    const result = await db
      .collection("campaigns")
      .updateOne({ _id: new ObjectId(id) }, updateDoc);

    if (result.matchedCount === 0) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    const updatedCampaign = await db
      .collection("campaigns")
      .findOne({ _id: new ObjectId(id) });
    res.status(200).json(updatedCampaign);
  } catch (error) {
    console.error("Error updating campaign:", error);
    res.status(500).json({ error: "Failed to update campaign" });
  }
};

export const deleteCampaign = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid campaign ID" });
      return;
    }

    const db = getDb();
    const result = await db
      .collection("campaigns")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    res.status(500).json({ error: "Failed to delete campaign" });
  }
};
