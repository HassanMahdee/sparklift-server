import { ObjectId } from "mongodb";

export interface Campaign {
  _id?: ObjectId;
  title: string;
  description: string;
  image: string;
  category: string;
  raised: number;
  goal: number;
  createdAt: Date;
  deadline: Date;
  organizer: string;
  minContribution: number;
  status: "pending" | "approved" | "rejected" | "active" | "completed";
  creatorEmail: string;
  rewards: string;
  story: string;
  featured: boolean;
  updatedAt?: Date;
}

export interface CreateCampaignDTO {
  title: string;
  description: string;
  image: string;
  category: string;
  raised: number;
  goal: number;
  deadline: Date;
  organizer: string;
  minContribution: number;
  status: "pending" | "approved" | "rejected" | "active" | "completed";
  creatorEmail: string;
  rewards: string;
  story: string;
  featured: boolean;
}

export interface UpdateCampaignDTO {
  title?: string;
  description?: string;
  image?: string;
  category?: string;
  raised?: number;
  goal?: number;
  deadline?: Date;
  organizer?: string;
  minContribution?: number;
  status?: "pending" | "approved" | "rejected" | "active" | "completed";
  creatorEmail?: string;
  rewards?: string;
  story?: string;
  featured?: boolean;
}
