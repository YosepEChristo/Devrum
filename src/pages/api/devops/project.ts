// pages/api/devops/project.ts
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { projectId } = req.query;
  const accessToken = req.headers.authorization?.split(" ")[1]; // Ambil token dari header

  if (!accessToken || !projectId) {
    res.status(400).json({ error: "Missing access token or project ID" });
    return;
  }

  try {
    const response = await axios.get(
      `https://dev.azure.com/your_organization/_apis/projects/${projectId}?api-version=6.0`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ error: "Failed to fetch project details" });
  }
}
