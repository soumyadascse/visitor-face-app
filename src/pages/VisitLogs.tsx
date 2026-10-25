import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { getVisitLogs } from "../services/visitorService";

interface VisitLog {
  id: string;
  visitor_name: string;
  flat_number: string;
  image_url?: string;
  emotion: string;
  estimated_age: number;
  visit_time?: string;
  created_at?: string;
}

export default function VisitLogs() {
  const [logs, setLogs] = useState<VisitLog[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await getVisitLogs();
      setLogs(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) =>
      [
        log.visitor_name,
        log.flat_number,
        log.emotion,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [logs, search]);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Visit Logs Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Visitor recognition history
          </p>
        </div>

        {/* Dashboard Cards */}

        <div className="grid md:grid-cols-3 gap-4 mb-8">

          <div className="bg-white rounded-2xl shadow p-5 border">
            <h3 className="text-gray-500">
              Total Visits
            </h3>

            <p className="text-3xl font-bold text-blue-600">
              {logs.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5 border">
            <h3 className="text-gray-500">
              Recognized Visitors
            </h3>

            <p className="text-3xl font-bold text-green-600">
              {logs.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5 border">
            <h3 className="text-gray-500">
              Today's Visits
            </h3>

            <p className="text-3xl font-bold text-purple-600">
              {
                logs.filter((log) => {
                  const date =
                    log.visit_time ||
                    log.created_at;

                  return (
                    date &&
                    new Date(date).toDateString() ===
                      new Date().toDateString()
                  );
                }).length
              }
            </p>
          </div>

        </div>

        {/* Search */}

        <div className="bg-white rounded-2xl shadow border overflow-hidden">

          <div className="p-5 border-b">

            <input
              type="text"
              placeholder="Search visitor..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full
                border
                rounded-lg
                p-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th className="p-4 text-left">
                    Flat
                  </th>

                  <th className="p-4 text-left">
                    Age
                  </th>

                  <th className="p-4 text-left">
                    Emotion
                  </th>

                  <th className="p-4 text-left">
                    Visit Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredLogs.map((log) => {

                  const visitDate =
                    log.visit_time ||
                    log.created_at;

                  return (
                    <tr
                      key={log.id}
                      className="
                        border-b
                        hover:bg-gray-50
                      "
                    >

                      <td className="p-4 font-medium">
                        {log.visitor_name}
                      </td>

                      <td className="p-4">
                        {log.flat_number}
                      </td>

                      <td className="p-4">
                        {log.estimated_age}
                      </td>

                      <td className="p-4">

                        <span
                          className="
                            bg-blue-100
                            text-blue-700
                            px-3
                            py-1
                            rounded-full
                            text-xs
                          "
                        >
                          {log.emotion}
                        </span>

                      </td>

                      <td className="p-4">

                        {visitDate
                          ? new Date(
                              visitDate
                            ).toLocaleString("en-IN")
                          : "-"}

                      </td>

                    </tr>
                  );
                })}

                {filteredLogs.length === 0 && (

                  <tr>

                    <td
                      colSpan={6}
                      className="
                        text-center
                        p-8
                        text-gray-500
                      "
                    >
                      No visit logs found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </>
  );
}