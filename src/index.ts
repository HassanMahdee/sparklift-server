import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
import express from "express";
import cors from "cors";
import dotenv from "dotenv";