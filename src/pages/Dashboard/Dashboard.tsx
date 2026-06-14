import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { getAllTests, deleteTest } from "../../api/tests";
import "./Dashboard.css";

interface Test {
  id: string;
  name: string;
  subject: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTests = async () => {
    try {
      const res = await getAllTests();
      setTests(res.data?.data || []);
    } catch {
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this test?")) return;
    try {
      await deleteTest(id);
      setTests((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Failed to delete test.");
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  return (
    <AppLayout>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h2>Test Management</h2>
            <p>Manage and track all your tests</p>
          </div>
          <button className="create-test-btn" onClick={() => navigate("/tests/create")}>
            + Create New Test
          </button>
        </div>

        <div className="dashboard-card">
          {loading ? (
            <div className="loading-state">Loading tests...</div>
          ) : tests.length === 0 ? (
            <div className="empty-state">
              <p>No tests found.</p>
              <button onClick={() => navigate("/tests/create")}>Create your first test</button>
            </div>
          ) : (
            <table className="tests-table">
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr key={test.id}>
                    <td>{test.name}</td>
                    <td>{test.subject}</td>
                    <td>
                      <span className={`status-badge ${test.status === "live" ? "published" : "draft"}`}>
                        {test.status === "live" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td>{formatDate(test.created_at)}</td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => navigate(`/tests/edit/${test.id}`)}>Edit</button>
                        <button onClick={() => navigate(`/preview/${test.id}`)}>View</button>
                        <button className="delete-action" onClick={() => handleDelete(test.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;