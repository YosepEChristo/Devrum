// src/components/pages/developer/ShowDeveloper.tsx
"use client";

import { useProjectContext } from "@/context/ProjectContext";
import Navbar from "@/components/elements/navbar/NavBar";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function ShowDeveloper() {
  const { selectedProjectId, selectedDeveloper } = useProjectContext();
  const router = useRouter();

  if (!selectedProjectId || !selectedDeveloper) {
    router.push("/organizations"); // Redirect if no project or developer is selected
    return null;
  }

  const calculateTotals = () => {
    let totalDone = 0;
    let totalUnfinished = 0;
    let totalBugs = 0;
    let totalUserStories = 0;

    selectedDeveloper.sprintData.forEach((sprint) => {
      sprint.tasks.forEach((task) => {
        totalUserStories += task.userStoryCount;

        switch (task.status) {
          case "DONE":
            totalDone += task.userStoryCount;
            break;
          case "UNFINISHED":
            totalUnfinished += task.userStoryCount;
            break;
          case "BUGS":
            totalBugs += task.userStoryCount;
            break;
        }
      });
    });

    const velocity =
      (totalDone + totalBugs) / selectedDeveloper.sprintData.length;
    return {
      totalDone,
      totalUnfinished,
      totalBugs,
      totalUserStories,
      velocity,
    };
  };

  const totals = calculateTotals();

  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="flex-1 px-[25px] py-[18px]">
        <div className="flex space-x-[25px]">
          {/* Sprint Blocks */}
          <div className="flex flex-col space-y-[18px] w-[60%]">
            {selectedDeveloper.sprintData.map((sprint, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-4 mb-4"
              >
                <h2 className="text-lg text-purple_s font-semibold mb-2">
                  {sprint.sprintId}{" "}
                  <span className="text-[10px] text-grey_s">
                    {sprint.startDate} - {sprint.endDate}
                  </span>
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {sprint.tasks.map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                    >
                      <span className="text-grey_s w-[50%]">
                        {task.taskName}
                      </span>
                      <span className=" text-grey_s w-[15%]">
                        {task.userStoryCount} user story
                      </span>
                      <span className="text-grey_s w-[15%]">
                        Priority {task.priority}
                      </span>
                      <span
                        className={`w-[15%] font-semibold ${
                          task.status === "DONE"
                            ? "text-green"
                            : task.status === "BUGS"
                            ? "text-red"
                            : "text-yellow"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar with Developer Info */}
          <div className="flex flex-col space-y-[18px] w-[40%]">
            {/* Developer Name and Role */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-4">
              <Image
                src="/assets/pages/developer/user-64x64.png"
                alt="Developer"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <h2 className="text-xl text-grey_s font-semibold">
                  {selectedDeveloper.name}
                </h2>
                <p className="text-gray-500">Front-End</p>
              </div>
            </div>

            {/* Total User Stories */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-4">
              <Image
                src="/assets/pages/developer/totalUserStory.png"
                alt="Total User Stories"
                width={40}
                height={40}
              />
              <div>
                <h2 className="text-lg text-grey_s font-semibold">
                  Total User Stories
                </h2>
                <p className="text-gray-700">
                  {totals.totalUserStories} User Story
                </p>
              </div>
            </div>

            {/* Metrics Boxes */}
            <div className="grid grid-cols-2 gap-4">
              {/* Velocity */}
              <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-2">
                <Image
                  src="/assets/pages/developer/velocity.png"
                  alt="Velocity"
                  width={32}
                  height={32}
                />
                <div>
                  <h3 className="text-lg text-grey_s font-semibold">
                    Velocity
                  </h3>
                  <p className="text-gray-700">
                    {totals.velocity.toFixed(2)} us/sprint
                  </p>
                </div>
              </div>

              {/* Done */}
              <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-2">
                <Image
                  src="/assets/pages/developer/done.png"
                  alt="Done"
                  width={32}
                  height={32}
                />
                <div>
                  <h3 className="text-lg text-grey_s font-semibold">Done</h3>
                  <p className="text-gray-700">{totals.totalDone} user story</p>
                </div>
              </div>

              {/* Unfinished */}
              <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-2">
                <Image
                  src="/assets/pages/developer/unfinished.png"
                  alt="Unfinished"
                  width={32}
                  height={32}
                />
                <div>
                  <h3 className="text-lg text-grey_s font-semibold">
                    Unfinished
                  </h3>
                  <p className="text-gray-700">
                    {totals.totalUnfinished} user story
                  </p>
                </div>
              </div>

              {/* Bugs */}
              <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-2">
                <Image
                  src="/assets/pages/developer/bug.png"
                  alt="Bugs"
                  width={32}
                  height={32}
                />
                <div>
                  <h3 className="text-lg text-grey_s font-semibold">Bugs</h3>
                  <p className="text-gray-700">{totals.totalBugs} user story</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowDeveloper;
