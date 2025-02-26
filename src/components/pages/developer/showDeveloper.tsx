"use client";

import { useEffect, useState } from "react";
import { useProjectContext } from "../../../context/ProjectContext";
import Navbar from "../elements/navbar/NavBar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  fetchUserStoriesForDeveloper,
  UserStory,
} from "@/service/workItemService";

export function ShowDeveloper() {
  const { selectedProjectId, selectedDeveloper, organizationName } =
    useProjectContext();
  const router = useRouter();

  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ **Pindahkan useEffect ke atas sebelum return**
  useEffect(() => {
    if (!selectedProjectId || !selectedDeveloper || !organizationName) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const stories = await fetchUserStoriesForDeveloper(
          organizationName,
          selectedProjectId,
          selectedDeveloper.name
        );
        setUserStories(stories);
      } catch {
        setError("Failed to fetch user stories");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedProjectId, selectedDeveloper, organizationName]);

  // ✅ **Pindahkan return setelah useEffect**
  if (!selectedProjectId || !selectedDeveloper) {
    router.push("/organizations");
    return null;
  }

  // ✅ **Mengelompokkan User Story berdasarkan Sprint**
  const sprintData = userStories.reduce<{ [key: string]: UserStory[] }>(
    (acc, story) => {
      if (!acc[story.sprint]) acc[story.sprint] = [];
      acc[story.sprint].push(story);
      return acc;
    },
    {}
  );

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-1 px-[25px] py-[18px] flex space-x-[25px]">
        {/* Box Tengah: Sprint dan User Stories */}
        <div className="flex flex-col space-y-[18px] w-[60%]">
          {loading ? (
            <p>Loading user stories...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : Object.keys(sprintData).length > 0 ? (
            Object.entries(sprintData).map(([sprintName, stories]) => (
              <div
                key={sprintName}
                className="bg-white shadow-lg rounded-lg p-6"
              >
                <h2 className="text-lg text-purple_s font-semibold mb-4">
                  {sprintName}
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center py-2 border-b border-gray-300 font-semibold ">
                    <span className="w-[58%]">
                      <span className="text-gray-600">User Story /</span>{" "}
                      <span className="text-red font-semibold">Bug Fix</span>
                    </span>
                    <span className=" text-gray-600 w-[15%]">Status</span>
                    <span className=" text-gray-600 w-[10%]">Effort</span>
                    <span className=" text-gray-600 w-[15%] ">Severity</span>
                  </div>
                  {stories.map((story, i) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0 ${
                        story.type && story.type.toLowerCase() === "bug"
                          ? "text-red"
                          : "text-grey_s"
                      }`}
                    >
                      <span className=" w-[58%]">{story.title}</span>
                      <span className=" w-[15%] ">{story.status}</span>
                      <span className=" w-[10%]">{story.effort}</span>
                      <span className="w-[15%]">
                        {story.type === "Bug" ? story.severity || "-" : "-"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-600 mb-4">
                User Stories
              </h2>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="text-grey_s">
                    <th className="border border-gray-200 bg-gray-50  px-4 py-2 text-center">
                      No User Stories Found
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar Developer Info */}
        <div className="flex flex-col space-y-[18px] w-[40%]">
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-2">
              <Image
                src="/assets/pages/developer/totalUserStory.png"
                alt="Score"
                width={40}
                height={40}
              />
              <div>
                <h3 className="text-lg text-grey_s font-semibold">Score</h3>
                <p className="text-gray-700">
                  {selectedDeveloper.score.toFixed(2)} Point
                </p>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-2">
              <Image
                src="/assets/pages/developer/velocity.png"
                alt="Velocity"
                width={40}
                height={40}
              />
              <div>
                <h3 className="text-lg text-grey_s font-semibold">Velocity</h3>
                <p className="text-gray-700">
                  {selectedDeveloper.velocity.toFixed(2)} SP/Sprint
                </p>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-2">
              <Image
                src="/assets/pages/developer/done.png"
                alt="Done"
                width={40}
                height={40}
              />
              <div>
                <h3 className="text-lg text-grey_s font-semibold">Done</h3>
                <p className="text-gray-700">
                  {selectedDeveloper.storyPoints || "0.00"} story points
                </p>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-2">
              <Image
                src="/assets/pages/developer/bug.png"
                alt="Bugs"
                width={40}
                height={40}
              />
              <div>
                <h3 className="text-lg text-grey_s font-semibold">
                  Bugs Fix Score
                </h3>
                <p className="text-gray-700">
                  {selectedDeveloper.bugFixScore || "0.00"} Points
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowDeveloper;
