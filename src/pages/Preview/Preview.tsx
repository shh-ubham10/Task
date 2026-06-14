import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { updateTest } from "../../api/tests";
import { useTest } from "../../context/TestContext";
import "./Preview.css";

const Preview = () => {
  const navigate = useNavigate();
  const { testData, questions, resetTest } = useTest();
  const [tab, setTab] = useState<"now" | "schedule">("now");
  const [liveUntil, setLiveUntil] = useState("always");
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    if (!testData.id) { alert("No test to publish."); return; }
    setPublishing(true);
    try {
      await updateTest(testData.id, { status: "live" });
      resetTest();
      navigate("/");
    } catch {
      alert("Failed to publish. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const subjectName = testData.subject || "-";
  const topicNames = Array.isArray(testData.topics) ? testData.topics.join(", ") : "-";

  return (
    <AppLayout>
      <div className="preview-page">
        <div className="preview-header">
          <div className="ph-left">
            <span className="breadcrumb-link">Test creation</span>
          </div>
          <span className="success-badge">✓ All {questions.length} Questions done</span>
        </div>

        <div className="test-summary-card">
          <div className="card-top">
            <div className="card-top-left">
              <span className="test-type-badge">
                {testData.type === "chapterwise" ? "Chapter Wise" : testData.type || "Chapter Wise"}
              </span>
              <div className="test-name-row">
                <span className="test-icon">📖</span>
                <h3>{testData.name || "Test Name"}</h3>
                <span className="difficulty-badge">{testData.difficulty || "Easy"}</span>
              </div>
            </div>
            <button className="edit-btn">✏</button>
          </div>

          <div className="summary-meta">
            <div><span className="meta-label">Subject</span><p>{subjectName}</p></div>
            <div><span className="meta-label">Topic</span><p>{topicNames}</p></div>
            <div><span className="meta-label">Sub Topic</span><p>{testData.sub_topics?.[0] || "-"}</p></div>
          </div>

          <div className="summary-stats">
            <span>{testData.total_time || 60} Min</span>
            <span>{questions.length} Q's</span>
            <span>{testData.total_marks || 0} Marks</span>
          </div>
        </div>

        <div className="publish-tabs">
          <button className={tab === "now" ? "active" : ""} onClick={() => setTab("now")}>
            Publish Now
          </button>
          <button className={tab === "schedule" ? "active" : ""} onClick={() => setTab("schedule")}>
            Schedule Publish
          </button>
        </div>

        {tab === "schedule" && (
          <div className="schedule-section">
            <p>Select Date and Time</p>
            <div className="date-time-grid">
              <input type="date" />
              <input type="time" />
            </div>
          </div>
        )}

        <div className="availability-section">
          <h4>Live Until</h4>
          <p className="live-desc">Choose how long this test should remain available on the platform.</p>

          <div className="radio-grid">
            {["always", "1week", "2weeks", "3weeks", "1month", "custom"].map((val) => (
              <label key={val}>
                <input
                  type="radio"
                  name="liveUntil"
                  checked={liveUntil === val}
                  onChange={() => setLiveUntil(val)}
                />
                {val === "always" ? "Always Available"
                  : val === "1week" ? "1 Week"
                  : val === "2weeks" ? "2 Weeks"
                  : val === "3weeks" ? "3 Weeks"
                  : val === "1month" ? "1 Month"
                  : "Custom Duration"}
              </label>
            ))}
          </div>

          {liveUntil === "custom" && (
            <div className="date-time-grid" style={{ marginTop: 16 }}>
              <input type="date" placeholder="Select End Date" />
              <input type="time" placeholder="Select End Time" />
            </div>
          )}
        </div>

        <div className="preview-actions">
          <button className="cancel-btn" onClick={() => navigate("/questions")}>Cancel</button>
          <button className="confirm-btn" onClick={handlePublish} disabled={publishing}>
            {publishing ? "Publishing..." : "Confirm"}
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Preview;