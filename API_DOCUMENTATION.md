# Sparklift Server API Documentation

## Overview

Sparklift Server is a RESTful API built with Express.js and MongoDB for managing campaigns. The server runs on port 5000 by default.

**Base URL:** `http://localhost:5000`

---

## Endpoints

### Health Check

#### GET /

Returns a status message indicating the server is running.

**Response:**

```json
{
  "message": "Sparklift Server is running"
}
```

---

### Campaign Endpoints

Base path: `/api/campaigns`

#### GET /api/campaigns

Retrieve all campaigns with optional filtering, sorting, and pagination.

**Query Parameters:**

- `search` (string, optional): Search campaigns by name (case-insensitive)
- `category` (string, optional): Filter by category
- `status` (string, optional): Filter by status
- `sort` (string, optional): Field to sort by
- `order` (string, optional): Sort order - "asc" or "desc" (default: desc)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Number of items per page (default: 10)

**Response (200 OK):**

```json
{
  "campaigns": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**Error Response (500):**

```json
{
  "error": "Failed to fetch campaigns"
}
```

---

#### GET /api/campaigns/creator/:creatorEmail

Retrieve all campaigns created by a specific creator email.

**URL Parameters:**

- `creatorEmail` (string, required): The email address of the campaign creator

**Response (200 OK):**

```json
{
  "campaigns": [...],
  "pagination": {
    "total": 5
  }
}
```

**Error Response (500):**

```json
{
  "error": "Failed to fetch campaigns by creator"
}
```

---

#### GET /api/campaigns/featured

Retrieve all featured campaigns (where featured field is true).

**Response (200 OK):**

```json
{
  "campaigns": [...],
  "pagination": {
    "total": 3
  }
}
```

**Error Response (500):**

```json
{
  "error": "Failed to fetch featured campaigns"
}
```

---

#### GET /api/campaigns/:id

Retrieve a specific campaign by its ID.

**URL Parameters:**

- `id` (string, required): MongoDB ObjectId of the campaign

**Response (200 OK):**

```json
{
  "_id": "...",
  "name": "Campaign Name",
  "status": "active",
  ...
}
```

**Error Responses:**

- 400: Invalid campaign ID

```json
{
  "error": "Invalid campaign ID"
}
```

- 404: Campaign not found

```json
{
  "error": "Campaign not found"
}
```

- 500: Failed to fetch campaign

```json
{
  "error": "Failed to fetch campaign"
}
```

---

#### POST /api/campaigns

Create a new campaign.

**Request Body:**

```json
{
  "title": "Clean Water for Rural Schools",
  "description": "Installing water filtration systems in 50 rural schools to provide safe drinking water for over 15,000 students and teachers.",
  "image": "https://images.unsplash.com/photo-1542884841-9f546e727bca?w=800&h=600&fit=crop",
  "category": "community",
  "raised": 42000,
  "goal": 50000,
  "deadline": "2024-11-30T00:00:00Z",
  "organizer": "Water for All Foundation",
  "minContribution": 15,
  "status": "approved",
  "creatorEmail": "contact@waterforall.org",
  "rewards": "Personalized thank you card, name on school water station plaque for contributions over $100",
  "story": "Every day, 15,000 students in rural communities drink contaminated water...",
  "featured": false
}
```

**Required Fields:**

- `title` (string): Campaign title
- `description` (string): Campaign description
- `status` (string): Campaign status (pending, approved, rejected, active, or completed)
- `creatorEmail` (string): Creator's email address

**Optional Fields:**

- `image` (string): Campaign image URL
- `category` (string): Campaign category
- `raised` (number): Amount raised so far
- `goal` (number): Fundraising goal
- `deadline` (string): Campaign deadline (ISO date format)
- `organizer` (string): Organization name
- `minContribution` (number): Minimum contribution amount
- `rewards` (string): Contribution rewards description
- `story` (string): Campaign story/detailed description
- `featured` (boolean): Whether campaign is featured

**Response (201 Created):**

```json
{
  "_id": "...",
  "title": "Clean Water for Rural Schools",
  "description": "Installing water filtration systems in 50 rural schools...",
  "image": "https://images.unsplash.com/photo-1542884841-9f546e727bca?w=800&h=600&fit=crop",
  "category": "community",
  "raised": 42000,
  "goal": 50000,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "deadline": "2024-11-30T00:00:00.000Z",
  "organizer": "Water for All Foundation",
  "minContribution": 15,
  "status": "approved",
  "creatorEmail": "contact@waterforall.org",
  "rewards": "Personalized thank you card...",
  "story": "Every day, 15,000 students...",
  "featured": false,
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- 400: Missing required fields

```json
{
  "error": "Title, description, status, and creatorEmail are required"
}
```

- 500: Failed to create campaign

```json
{
  "error": "Failed to create campaign"
}
```

---

#### PATCH /api/campaigns/:id

Update an existing campaign by its ID.

**URL Parameters:**

- `id` (string, required): MongoDB ObjectId of the campaign

**Request Body:**

```json
{
  "name": "Updated Name",
  "status": "completed",
  ...
}
```

**Response (200 OK):**

```json
{
  "_id": "...",
  "name": "Updated Name",
  "status": "completed",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  ...
}
```

**Error Responses:**

- 400: Invalid campaign ID

```json
{
  "error": "Invalid campaign ID"
}
```

- 404: Campaign not found

```json
{
  "error": "Campaign not found"
}
```

- 500: Failed to update campaign

```json
{
  "error": "Failed to update campaign"
}
```

---

#### DELETE /api/campaigns/:id

Delete a campaign by its ID.

**URL Parameters:**

- `id` (string, required): MongoDB ObjectId of the campaign

**Response (200 OK):**

```json
{
  "message": "Campaign deleted successfully"
}
```

**Error Responses:**

- 400: Invalid campaign ID

```json
{
  "error": "Invalid campaign ID"
}
```

- 404: Campaign not found

```json
{
  "error": "Campaign not found"
}
```

- 500: Failed to delete campaign

```json
{
  "error": "Failed to delete campaign"
}
```

---

## Technology Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB
- **CORS:** Enabled for cross-origin requests

## Environment Variables

- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `DB_NAME`: Database name

## Running the Server

```bash
# Development mode with hot reload
npm run dev

# Build TypeScript
npm run build

# Production mode
npm start
```
