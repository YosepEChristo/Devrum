// organizationDB.ts (simulated in-memory DB)

// Define the developer structure
interface Developer {
  name: string;
  userStory: number;
  unfinished: number;
  bugs: number;
  done: number;
  velocity: number;
}

// Define the project structure
interface Project {
  id: string;
  name: string;
  developers: Developer[]; // Add developers to each project
}

// Define the organization structure
interface Organization {
  id: string;
  name: string;
  projects: Project[]; // Add projects to each organization
}

// Simulate an in-memory database with organizations, projects, and developers
const organizationDB: Organization[] = [
  {
    id: "org1",
    name: "Organization 1",
    projects: [
      {
        id: "proj1",
        name: "Project A",
        developers: [
          {
            name: "Bambang Pamungkas",
            userStory: 70,
            unfinished: 15,
            bugs: 10,
            done: 45,
            velocity: 18,
          },
          {
            name: "Rudi Hartono",
            userStory: 65,
            unfinished: 10,
            bugs: 12,
            done: 43,
            velocity: 20,
          },
          {
            name: "Andi Lala",
            userStory: 80,
            unfinished: 5,
            bugs: 8,
            done: 72,
            velocity: 25,
          },
        ],
      },
      {
        id: "proj2",
        name: "Project B",
        developers: [
          {
            name: "Susi Susanti",
            userStory: 55,
            unfinished: 20,
            bugs: 15,
            done: 30,
            velocity: 12,
          },
          {
            name: "Taufik Hidayat",
            userStory: 75,
            unfinished: 8,
            bugs: 11,
            done: 67,
            velocity: 22,
          },
        ],
      },
    ],
  },
  {
    id: "org2",
    name: "Organization 2",
    projects: [
      {
        id: "proj3",
        name: "Project C",
        developers: [
          {
            name: "John Doe",
            userStory: 50,
            unfinished: 10,
            bugs: 7,
            done: 40,
            velocity: 15,
          },
          {
            name: "Jane Smith",
            userStory: 65,
            unfinished: 12,
            bugs: 6,
            done: 53,
            velocity: 18,
          },
        ],
      },
    ],
  },
];

// Fetch organizations
export async function getOrganizations() {
  return organizationDB.map((org) => ({ id: org.id, name: org.name }));
}

// Fetch projects by organization ID
export async function getProjectsByOrganizationId(orgId: string) {
  const organization = organizationDB.find((org) => org.id === orgId);
  return organization ? organization.projects : [];
}

// Fetch developers by project ID
export async function getDevelopersByProjectId(projectId: string) {
  for (const org of organizationDB) {
    const project = org.projects.find((proj) => proj.id === projectId);
    if (project) {
      return project.developers;
    }
  }
  return [];
}
