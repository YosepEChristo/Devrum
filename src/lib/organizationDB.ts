// organizationDB.ts (simulated in-memory DB with updated sprint and task data)

interface Task {
  taskName: string;
  userStoryCount: number;
  priority: number;
  status: "DONE" | "UNFINISHED" | "BUGS";
}

interface SprintData {
  sprintId: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
}

interface Developer {
  name: string;
  sprintData: SprintData[];
}

interface Project {
  id: string;
  name: string;
  developers: Developer[];
}

interface Organization {
  id: string;
  name: string;
  projects: Project[];
}

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
            sprintData: [
              {
                sprintId: "sprint1",
                startDate: "2 Jul",
                endDate: "9 Jul",
                tasks: [
                  {
                    taskName: "Register Page",
                    userStoryCount: 3,
                    priority: 1,
                    status: "DONE",
                  },
                  {
                    taskName: "Login Page",
                    userStoryCount: 3,
                    priority: 2,
                    status: "DONE",
                  },
                  {
                    taskName: "Third Page",
                    userStoryCount: 3,
                    priority: 1,
                    status: "BUGS",
                  },
                ],
              },
              {
                sprintId: "sprint2",
                startDate: "10 Jul",
                endDate: "17 Jul",
                tasks: [
                  {
                    taskName: "Home Page",
                    userStoryCount: 4,
                    priority: 2,
                    status: "UNFINISHED",
                  },
                  {
                    taskName: "FAQ Page",
                    userStoryCount: 2,
                    priority: 1,
                    status: "DONE",
                  },
                  {
                    taskName: "Logout Configuration",
                    userStoryCount: 1,
                    priority: 2,
                    status: "DONE",
                  },
                ],
              },
            ],
          },
          {
            name: "Rudi Hartono",
            sprintData: [
              {
                sprintId: "sprint1",
                startDate: "2 Jul",
                endDate: "9 Jul",
                tasks: [
                  {
                    taskName: "Setup API",
                    userStoryCount: 2,
                    priority: 1,
                    status: "DONE",
                  },
                  {
                    taskName: "Database Configuration",
                    userStoryCount: 3,
                    priority: 1,
                    status: "UNFINISHED",
                  },
                ],
              },
              {
                sprintId: "sprint2",
                startDate: "10 Jul",
                endDate: "17 Jul",
                tasks: [
                  {
                    taskName: "User Authentication",
                    userStoryCount: 3,
                    priority: 2,
                    status: "DONE",
                  },
                  {
                    taskName: "Settings Page",
                    userStoryCount: 2,
                    priority: 1,
                    status: "BUGS",
                  },
                ],
              },
            ],
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
        id: "proj2",
        name: "Project B",
        developers: [
          {
            name: "Susi Susanti",
            sprintData: [
              {
                sprintId: "sprint1",
                startDate: "2 Jul",
                endDate: "9 Jul",
                tasks: [
                  {
                    taskName: "Landing Page",
                    userStoryCount: 5,
                    priority: 1,
                    status: "BUGS",
                  },
                  {
                    taskName: "Contact Form",
                    userStoryCount: 3,
                    priority: 2,
                    status: "DONE",
                  },
                ],
              },
              {
                sprintId: "sprint2",
                startDate: "10 Jul",
                endDate: "17 Jul",
                tasks: [
                  {
                    taskName: "Dashboard",
                    userStoryCount: 4,
                    priority: 2,
                    status: "UNFINISHED",
                  },
                  {
                    taskName: "User Profile",
                    userStoryCount: 2,
                    priority: 1,
                    status: "DONE",
                  },
                ],
              },
            ],
          },
          {
            name: "Taufik Hidayat",
            sprintData: [
              {
                sprintId: "sprint1",
                startDate: "2 Jul",
                endDate: "9 Jul",
                tasks: [
                  {
                    taskName: "Analytics Page",
                    userStoryCount: 3,
                    priority: 1,
                    status: "DONE",
                  },
                  {
                    taskName: "Report Generation",
                    userStoryCount: 2,
                    priority: 2,
                    status: "BUGS",
                  },
                ],
              },
              {
                sprintId: "sprint2",
                startDate: "10 Jul",
                endDate: "17 Jul",
                tasks: [
                  {
                    taskName: "Notifications",
                    userStoryCount: 3,
                    priority: 2,
                    status: "DONE",
                  },
                  {
                    taskName: "Messages",
                    userStoryCount: 3,
                    priority: 1,
                    status: "UNFINISHED",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "org3",
    name: "Organization 3",
    projects: [
      {
        id: "proj3",
        name: "Project C",
        developers: [
          {
            name: "John Doe",
            sprintData: [
              {
                sprintId: "sprint1",
                startDate: "2 Jul",
                endDate: "9 Jul",
                tasks: [
                  {
                    taskName: "Profile Page",
                    userStoryCount: 3,
                    priority: 2,
                    status: "DONE",
                  },
                  {
                    taskName: "Settings Page",
                    userStoryCount: 2,
                    priority: 1,
                    status: "UNFINISHED",
                  },
                ],
              },
              {
                sprintId: "sprint2",
                startDate: "10 Jul",
                endDate: "17 Jul",
                tasks: [
                  {
                    taskName: "Notifications",
                    userStoryCount: 2,
                    priority: 2,
                    status: "DONE",
                  },
                  {
                    taskName: "Messages",
                    userStoryCount: 3,
                    priority: 1,
                    status: "BUGS",
                  },
                ],
              },
            ],
          },
          {
            name: "Jane Smith",
            sprintData: [
              {
                sprintId: "sprint1",
                startDate: "2 Jul",
                endDate: "9 Jul",
                tasks: [
                  {
                    taskName: "Admin Dashboard",
                    userStoryCount: 4,
                    priority: 1,
                    status: "DONE",
                  },
                  {
                    taskName: "Audit Logs",
                    userStoryCount: 2,
                    priority: 2,
                    status: "BUGS",
                  },
                ],
              },
              {
                sprintId: "sprint2",
                startDate: "10 Jul",
                endDate: "17 Jul",
                tasks: [
                  {
                    taskName: "Access Control",
                    userStoryCount: 3,
                    priority: 1,
                    status: "UNFINISHED",
                  },
                  {
                    taskName: "User Activity",
                    userStoryCount: 2,
                    priority: 2,
                    status: "DONE",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export async function getOrganizations() {
  return organizationDB.map((org) => ({ id: org.id, name: org.name }));
}

export async function getProjectsByOrganizationId(orgId: string) {
  const organization = organizationDB.find((org) => org.id === orgId);
  return organization ? organization.projects : [];
}

export async function getDevelopersByProjectId(projectId: string) {
  for (const org of organizationDB) {
    const project = org.projects.find((proj) => proj.id === projectId);
    if (project) {
      return project.developers;
    }
  }
  return [];
}

export async function getSprintDataByDeveloperName(
  projectId: string,
  developerName: string
) {
  const developers = await getDevelopersByProjectId(projectId);
  const developer = developers.find((dev) => dev.name === developerName);
  return developer ? developer.sprintData : [];
}
