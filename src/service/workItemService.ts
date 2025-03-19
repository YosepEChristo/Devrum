import axios from "axios";
import { getAccessTokenFromCookie } from "@/utils/refreshTokenHandler";

interface WorkItem {
  id: number;
  fields: {
    "System.AssignedTo"?: { displayName: string };
    "System.Title"?: string;
    "System.WorkItemType"?: string;
    "System.State"?: string;
    "Microsoft.VSTS.Scheduling.Effort"?: number;
    "System.IterationPath"?: string;
    "Microsoft.VSTS.Common.Severity"?: string;
  };
}

export interface UserStory {
  id: number;
  title: string;
  status: string;
  sprint: string;
  effort: number;
  type: string;
  severity?: string;
}

export interface Developer {
  name: string;
  storyPoints: number;
  velocity: number;
  bugFixScore: number;
  score: number;
}

/**
 * Fetch User Stories dan Bugs untuk developer tertentu dari Azure DevOps
 */
export const fetchUserStoriesForDeveloper = async (
  organizationName: string,
  projectId: string,
  developerName: string
): Promise<UserStory[]> => {
  const accessToken = getAccessTokenFromCookie();
  if (!accessToken) throw new Error("Access token is not available!");

  console.log("Fetching User Stories & Bugs for:", developerName);

  // 🔥 Fetch nama proyek terlebih dahulu agar System.TeamProject bisa digunakan dengan benar
  const projectResponse = await axios.get(
    `https://dev.azure.com/${organizationName}/_apis/projects/${projectId}?api-version=6.0`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const projectName = projectResponse.data.name; // ✅ Gunakan Nama Proyek!

  const workItemResponse = await axios.post(
    `https://dev.azure.com/${organizationName}/${projectId}/_apis/wit/wiql?api-version=6.0`,
    {
      query: `
        SELECT [System.Id], [System.Title], [System.State], [System.IterationPath], 
               [Microsoft.VSTS.Scheduling.Effort], [System.WorkItemType], 
               [Microsoft.VSTS.Common.Severity]
        FROM WorkItems
        WHERE [System.AssignedTo] CONTAINS '${developerName}'
        AND [System.TeamProject] = '${projectName}'
        AND ([System.WorkItemType] = 'Product Backlog Item' OR [System.WorkItemType] = 'Bug')
      `,
    },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  console.log("Raw Response:", workItemResponse.data);

  const workItemIds =
    workItemResponse.data.workItems?.map((item: { id: number }) => item.id) ||
    [];

  if (workItemIds.length === 0) {
    console.log("No User Stories/Bugs found for", developerName);
    return [];
  }

  console.log("Work Item IDs:", workItemIds);

  const workItemDetailsResponse = await axios.post(
    `https://dev.azure.com/${organizationName}/_apis/wit/workitemsbatch?api-version=6.0`,
    { ids: workItemIds },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  console.log("Detailed Work Items:", workItemDetailsResponse.data);

  return workItemDetailsResponse.data.value.map((item: WorkItem) => ({
    id: item.id,
    title: item.fields["System.Title"] || "No Title",
    status: item.fields["System.State"] || "Unknown",
    sprint: item.fields["System.IterationPath"]?.split("\\").pop() || "Unknown",
    effort: item.fields["Microsoft.VSTS.Scheduling.Effort"] || 0,
    severity: item.fields["Microsoft.VSTS.Common.Severity"] || "N/A",
    type: item.fields["System.WorkItemType"] || "Unknown",
  }));
};

/**
 * Fetch daftar developer dan kalkulasi DPS.
 */
export const fetchProjectAndDevelopers = async (
  organizationName: string,
  projectId: string
): Promise<{ projectName: string; developers: Developer[] }> => {
  const accessToken = getAccessTokenFromCookie();
  if (!accessToken) throw new Error("Access token is not available!");

  // 🔥 Fetch nama proyek untuk memastikan System.TeamProject menggunakan nama, bukan ID
  const projectResponse = await axios.get(
    `https://dev.azure.com/${organizationName}/_apis/projects/${projectId}?api-version=6.0`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const projectName = projectResponse.data.name;

  const workItemResponse = await axios.post(
    `https://dev.azure.com/${organizationName}/${projectId}/_apis/wit/wiql?api-version=6.0`,
    {
      query: `
        SELECT [System.Id], [System.AssignedTo], [Microsoft.VSTS.Scheduling.Effort], 
               [System.WorkItemType], [Microsoft.VSTS.Common.Severity], [System.State], 
               [System.IterationPath]
        FROM WorkItems 
        WHERE [System.AssignedTo] <> '' 
        AND [System.TeamProject] = '${projectName}'
      `,
    },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const workItemIds =
    workItemResponse.data.workItems?.map((item: { id: number }) => item.id) ||
    [];

  if (workItemIds.length === 0) return { projectName, developers: [] };

  const workItemDetailsResponse = await axios.post(
    `https://dev.azure.com/${organizationName}/_apis/wit/workitemsbatch?api-version=6.0`,
    { ids: workItemIds },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const workItems: WorkItem[] = workItemDetailsResponse.data.value;

  const developerMap: Record<string, Developer> = {};

  workItems.forEach((item) => {
    const name = item.fields?.["System.AssignedTo"]?.displayName || "Unknown";
    const effort = item.fields?.["Microsoft.VSTS.Scheduling.Effort"] || 0;
    const state = item.fields?.["System.State"] || "";
    const workItemType =
      item.fields?.["System.WorkItemType"]?.toLowerCase() || "";
    const severity =
      item.fields?.["Microsoft.VSTS.Common.Severity"]?.toLowerCase() || "";
    const sprint = item.fields?.["System.IterationPath"] || "";

    if (!developerMap[name]) {
      developerMap[name] = {
        name,
        storyPoints: 0,
        velocity: 0,
        bugFixScore: 0,
        score: 0,
      };
    }

    // ✅ Hitung Story Points hanya jika status "Done"
    if (state.toLowerCase() === "done") {
      developerMap[name].storyPoints += effort;
    }

    // ✅ Hitung Velocity berdasarkan jumlah sprint unik
    if (sprint) {
      const totalSprints = new Set(
        workItems.map((wi) => wi.fields?.["System.IterationPath"])
      ).size;
      developerMap[name].velocity =
        totalSprints > 0 ? developerMap[name].storyPoints / totalSprints : 0;
    }

    // ✅ Hitung Bug Fix Score berdasarkan severity
    if (workItemType === "bug") {
      let severityScore = 0;
      switch (severity) {
        case "1 - critical":
          severityScore = 5;
          break;
        case "2 - high":
          severityScore = 3;
          break;
        case "3 - medium":
          severityScore = 2;
          break;
        case "4 - low":
          severityScore = 1;
          break;
      }
      developerMap[name].bugFixScore += severityScore;
    }
  });

  Object.values(developerMap).forEach((dev) => {
    dev.score =
      0.6 * dev.storyPoints + 0.2 * dev.velocity + 0.2 * dev.bugFixScore;
  });

  return { projectName, developers: Object.values(developerMap) };
};
