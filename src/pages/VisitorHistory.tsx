import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { getVisitors } from "../services/visitorService";

interface Visitor {
  id: string;
  name: string;
  mobile: string;
  gender: string;
  flat_number: string;
  purpose: string;
  image_url: string;
  created_at?: string;
}

export default function VisitorHistory() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadVisitors();
  }, []);

  const loadVisitors = async () => {
    try {
      const data = await getVisitors();

      setVisitors(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredVisitors = useMemo(() => {
    return visitors.filter((visitor) =>
      [visitor.name, visitor.mobile, visitor.flat_number, visitor.purpose]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, visitors]);

  const totalVisitors = visitors.length;

  const todayVisitors = visitors.filter((visitor) => {
    if (!visitor.created_at) return false;

    return (
      new Date(visitor.created_at).toDateString() === new Date().toDateString()
    );
  }).length;

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Visitor Dashboard</h1>

          <p className="text-gray-500 mt-2">
            Monitor all visitor registrations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow p-5 border">
            <h3 className="text-gray-500">Total Visitors</h3>

            <p className="text-3xl font-bold text-blue-600">{totalVisitors}</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5 border">
            <h3 className="text-gray-500">Today's Visitors</h3>

            <p className="text-3xl font-bold text-green-600">{todayVisitors}</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5 border">
            <h3 className="text-gray-500">Registered Visitors</h3>

            <p className="text-3xl font-bold text-purple-600">
              {totalVisitors}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow border overflow-hidden">
          <div className="p-5 border-b">
            <input
              type="text"
              placeholder="Search by name, mobile, flat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                  <th className="p-4 text-left">Photo</th>

                  <th className="p-4 text-left">Name</th>

                  <th className="p-4 text-left">Mobile</th>

                  <th className="p-4 text-left">Flat</th>

                  <th className="p-4 text-left">Purpose</th>

                  <th className="p-4 text-left">Registered Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredVisitors.map((visitor) => (
                  <tr
                    key={visitor.id}
                    className="
                        border-b
                        hover:bg-gray-50
                      "
                  >
                    <td className="p-4">
                      <img
                        src={visitor.image_url}
                        alt={visitor.name}
                        className="
      w-16
      h-16
      rounded-full
      object-cover
      border
    "
                      />
                    </td>
                    <td className="p-4 font-medium">{visitor.name}</td>

                    <td className="p-4">{visitor.mobile}</td>

                    <td className="p-4">{visitor.flat_number}</td>

                    <td className="p-4">
                      <span
                        className="
                            bg-blue-100
                            text-blue-700
                            text-xs
                            px-3
                            py-1
                            rounded-full
                          "
                      >
                        {visitor.purpose}
                      </span>
                    </td>

                    <td className="p-4">
                      {visitor.created_at
                        ? new Date(visitor.created_at).toLocaleDateString(
                            "en-IN",
                          )
                        : "-"}
                    </td>
                  </tr>
                ))}

                {filteredVisitors.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="
                        text-center
                        p-8
                        text-gray-500
                      "
                    >
                      No visitors found
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
