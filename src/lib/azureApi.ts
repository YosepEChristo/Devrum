// src/lib/azureApi.ts
import axios from "axios";

export const fetchOrganizations = async (accessToken: string) => {
  try {
    const response = await axios.get(
      "https://dev.azure.com/{organization}/_apis/projects",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.value; // asumsinya Azure DevOps mengembalikan 'value' sebagai daftar organisasi
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw new Error("Unable to fetch organizations");
  }
};
