import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { getSubjects, getTopicsBySubject, getSubTopicsByTopics } from "../../api/subjects";
import { createTest } from "../../api/tests";
import { useTest } from "../../context/TestContext";
import "./TestForm.css";

interface Option { id: string; name: string; }

const TestForm = () => {
  const navigate = useNavigate();
  const { setTestData } = useTest();
  const [activeTab, setActiveTab] = useState("chapterwise");
  const [subjects, setSubjects] = useState<Option[]>([]);
  const [topics, setTopics] = useState<Option[]>([]);
  const [subTopics, setSubTopics] = useState<Option[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    subject: "", name: "", topic: "", sub_topic: "",
    duration: "", difficulty: "easy",
    wrong_marks: -1, unattempt_marks: 0, correct_marks: 5,
    total_questions: "", total_marks: "",
  });

  useEffect(() => {
    getSubjects().then((r) => setSubjects(r.data?.data || []));
  }, []);

  useEffect(() => {
    if (!form.subject) { setTopics([]); setSubTopics([]); return; }
    getTopicsBySubject(form.subject).then((r) => {
      setTopics(r.data?.data || []);
      setSubTopics([]);
      setForm((p) => ({ ...p, topic: "", sub_topic: "" }));
    });
  }, [form.subject]);

  useEffect(() => {
    if (!form.topic) { setSubTopics([]); return; }
    getSubTopicsByTopics([form.topic]).then((r) => {
      setSubTopics(r.data?.data || []);
      setForm((p) => ({ ...p, sub_topic: "" }));
    });
  }, [form.topic]);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const handleNext = async () => {
    if (!form.name || !form.subject || !form.topic) {
      alert("Please fill Test Name, Subject and Topic."); return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name, type: activeTab, subject: form.subject,
        topics: [form.topic], sub_topics: form.sub_topic ? [form.sub_topic] : [],
        difficulty: form.difficulty,
        correct_marks: Number(form.correct_marks),
        wrong_marks: Number(form.wrong_marks),
        unattempt_marks: Number(form.unattempt_marks),
        total_time: Number(form.duration),
        total_marks: Number(form.total_marks),
        total_questions: Number(form.total_questions),
        status: null,
      };
      const res = await createTest(payload);
      setTestData({ ...payload, id: res.data?.data?.id });
      navigate("/questions");
    } catch { alert("Failed to create test."); }
    finally { setSaving(false); }
  };

  const ChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98a2b3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );

  return (
    <AppLayout>
      <div className="tf-container">
        <div className="tf-breadcrumb">
          Test Creation&nbsp;<span>/</span>&nbsp;Create Test&nbsp;<span>/</span>&nbsp;
          <strong>{activeTab === "chapterwise" ? "Chapter Wise" : activeTab === "pyq" ? "PYQ" : "Mock Test"}</strong>
        </div>

        <div className="tf-tabs">
          {[["chapterwise","Chapter Wise"],["pyq","PYQ"],["mock","Mock Test"]].map(([v,l]) => (
            <button key={v} className={activeTab === v ? "tf-tab active" : "tf-tab"} onClick={() => setActiveTab(v)}>
              {l}
            </button>
          ))}
        </div>

        <div className="tf-grid">
          <div className="tf-field">
            <label>Subject</label>
            <div className="tf-select-wrap">
              <select value={form.subject} onChange={(e) => set("subject", e.target.value)}>
                <option value="">Choose from Drop-down</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <ChevronDown/>
            </div>
          </div>

          <div className="tf-field">
            <label>Name of Test</label>
            <input placeholder="Enter name of Test" value={form.name} onChange={(e) => set("name", e.target.value)}/>
          </div>

          <div className="tf-field">
            <label>Topic</label>
            <div className="tf-select-wrap">
              <select value={form.topic} onChange={(e) => set("topic", e.target.value)} disabled={!topics.length}>
                <option value="">Choose from Drop-down</option>
                {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <ChevronDown/>
            </div>
          </div>

          <div className="tf-field">
            <label>Sub Topic</label>
            <div className="tf-select-wrap">
              <select value={form.sub_topic} onChange={(e) => set("sub_topic", e.target.value)} disabled={!subTopics.length}>
                <option value="">Choose from Drop-down</option>
                {subTopics.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <ChevronDown/>
            </div>
          </div>

          <div className="tf-field">
            <label>Duration (Minutes)</label>
            <input placeholder="Enter the time" value={form.duration} onChange={(e) => set("duration", e.target.value)}/>
          </div>

          <div className="tf-field">
            <label>Test Difficulty Level</label>
            <div className="tf-radio-group">
              {["easy","medium","difficult"].map((d) => (
                <label key={d} className="tf-radio-label">
                  <input type="radio" name="difficulty" checked={form.difficulty === d} onChange={() => set("difficulty", d)}/>
                  <span className="tf-radio-custom"/>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>

        <p className="tf-section-title">Marking Scheme:</p>

        <div className="tf-marks-grid">
          {[
            { label: "Wrong Answer", key: "wrong_marks", val: form.wrong_marks },
            { label: "Unattempted", key: "unattempt_marks", val: form.unattempt_marks },
            { label: "Correct Answer", key: "correct_marks", val: form.correct_marks },
          ].map(({ label, key, val }) => (
            <div key={key} className="tf-field">
              <label>{label}</label>
              <div className="tf-spinner">
                <input type="number" value={val} onChange={(e) => set(key, Number(e.target.value))}/>
                <div className="tf-spinner-btns">
                  <button type="button" onClick={() => set(key, Number(val) + 1)}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
                  </button>
                  <button type="button" onClick={() => set(key, Number(val) - 1)}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="tf-field">
            <label>No of Questions</label>
            <input placeholder="Ex:250 Marks" value={form.total_questions} onChange={(e) => set("total_questions", e.target.value)}/>
          </div>

          <div className="tf-field">
            <label>Total Marks</label>
            <input placeholder="Ex:250 Marks" value={form.total_marks} onChange={(e) => set("total_marks", e.target.value)}/>
          </div>
        </div>

        <div className="tf-actions">
          <button className="tf-cancel" onClick={() => navigate("/")}>Cancel</button>
          <button className="tf-next" onClick={handleNext} disabled={saving}>
            {saving ? "Saving..." : "Next"}
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default TestForm;