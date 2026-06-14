import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { bulkCreateQuestions } from "../../api/questions";
import { useTest } from "../../context/TestContext";
import "./Question.css";

interface QForm {
  question: string; option1: string; option2: string;
  option3: string; option4: string; correct_option: string;
  explanation: string; difficulty: string; image?: string;
}

const blank = (): QForm => ({
  question: "", option1: "", option2: "", option3: "", option4: "",
  correct_option: "option1", explanation: "", difficulty: "easy", image: "",
});

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98a2b3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const Question = () => {
  const navigate = useNavigate();
  const { testData, questions, setQuestions } = useTest();
  const [current, setCurrent] = useState(0);
  const [form, setForm] = useState<QForm>(blank());
  const [saving, setSaving] = useState(false);

  const set = (k: keyof QForm, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const applyFormat = (tag: string) => {
    const textarea = document.getElementById("q-textarea") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.question.substring(start, end);
    if (!selected) return;
    const tagMap: Record<string, [string, string]> = {
      B: ["**", "**"], I: ["*", "*"], U: ["__", "__"], S: ["~~", "~~"],
    };
    const [open, close] = tagMap[tag] || ["", ""];
    const newText = form.question.substring(0, start) + open + selected + close + form.question.substring(end);
    set("question", newText);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set("image", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.trim().split("\n").slice(1);
      const parsed: QForm[] = lines.map((line) => {
        const cols = line.split(",");
        return {
          question: cols[0]?.trim() || "",
          option1: cols[1]?.trim() || "",
          option2: cols[2]?.trim() || "",
          option3: cols[3]?.trim() || "",
          option4: cols[4]?.trim() || "",
          correct_option: cols[5]?.trim() || "option1",
          explanation: cols[6]?.trim() || "",
          difficulty: cols[7]?.trim() || "easy",
          image: "",
        };
      }).filter((q) => q.question);

      if (!parsed.length) { alert("No valid questions found in CSV."); return; }

      const updated = [...questions];
      if (form.question.trim()) updated[current] = { ...form, type: "mcq" };
      const merged = [...updated, ...parsed.map((q) => ({ ...q, type: "mcq" }))];
      setQuestions(merged);
      setForm(blank());
      setCurrent(merged.length);
      alert(`${parsed.length} question${parsed.length > 1 ? "s" : ""} imported successfully.`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const saveAndAdd = () => {
    if (!form.question.trim()) { alert("Question text is required."); return; }
    const updated = [...questions];
    updated[current] = { ...form, type: "mcq" };
    setQuestions(updated);
    setCurrent(updated.length);
    setForm(blank());
  };

  const selectQ = (idx: number) => {
    const updated = [...questions];
    if (form.question.trim()) updated[current] = { ...form, type: "mcq" };
    setQuestions(updated);
    setForm(updated[idx] ? { ...(updated[idx] as QForm) } : blank());
    setCurrent(idx);
  };

  const deleteCurrentEdits = () => {
    setForm(blank());
  };

  const handleSubmit = async () => {
    if (!form.question.trim()) { alert("Complete the current question."); return; }
    const updated = [...questions];
    updated[current] = { ...form, type: "mcq" };
    if (!updated.length) { alert("Add at least 1 question."); return; }
    setSaving(true);
    try {
      await bulkCreateQuestions(updated.map((q) => ({
        type: "mcq", question: q.question,
        option1: q.option1, option2: q.option2, option3: q.option3, option4: q.option4,
        correct_option: q.correct_option, explanation: q.explanation || "",
        difficulty: q.difficulty || "easy", test_id: testData.id,
      })));
      setQuestions(updated);
      navigate("/preview");
    } catch { alert("Failed to save questions."); }
    finally { setSaving(false); }
  };

  const listCount = Math.max(questions.length + 1, current + 1);

  return (
    <AppLayout>
      <div className="qp-wrap">
        {/* LEFT SIDEBAR */}
        <aside className="qp-left">
          <div className="qp-meta">
            <span className="qp-meta-label">Question creation</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#98a2b3" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </div>
          <div className="qp-total">
            <span className="qp-total-label">Total Questions :</span>
            <span className="qp-total-num">{testData.total_questions || 0}</span>
          </div>
          <div className="qp-qlist">
            {Array.from({ length: listCount }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => selectQ(idx)}
                className={`qp-qbtn ${current === idx ? "active" : ""} ${questions[idx]?.question ? "done" : ""}`}
              >
                <span className="qp-qbtn-dot"/>
                <span>Question {idx + 1}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            ))}
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <div className="qp-content">
          {/* top breadcrumb + publish */}
          <div className="qp-topbar">
            <div className="qp-breadcrumb">
              Test Creation&nbsp;/&nbsp;Create Test&nbsp;/&nbsp;<strong>Chapter Wise</strong>
            </div>
            <button className="qp-publish-btn" onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Publish"}
            </button>
          </div>

          {/* test info card */}
          <div className="qp-info-card">
            <div className="qp-info-left">
              <span className="qp-type-badge">Chapter Wise</span>
              <div className="qp-info-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3d5af1" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                <span className="qp-test-name">{testData.name || "Chapter 1"}</span>
                <span className="qp-easy-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {testData.difficulty || "Easy"}
                </span>
              </div>
              <div className="qp-info-details">
                <span><b>Subject</b> {testData.subject || "-"}</span>
              </div>
            </div>
            <div className="qp-info-stats">
              <span>{testData.total_time || 60} Min</span>
              <span>{testData.total_questions || 0} Q's</span>
              <span>{testData.total_marks || 0} Marks</span>
            </div>
            <button className="qp-edit-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98a2b3" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>

          {/* question number row */}
          <div className="qp-qnum-row">
            <span className="qp-qnum">Question {current + 1}</span>
            <span className="qp-qnum-of">/{testData.total_questions || "?"}</span>
            <div className="qp-qnum-actions">
              <button className="qp-chip">+ MCQ</button>
              <label className="qp-chip qp-chip-csv">
                + CSV
                <input
                  type="file"
                  accept=".csv"
                  style={{ display: "none" }}
                  onChange={handleCSV}
                />
              </label>
            </div>
          </div>

          {/* delete row */}
          <div className="qp-delete-row">
            <button className="qp-delete-btn" onClick={deleteCurrentEdits}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              Delete All Edits
            </button>
          </div>

          {/* question editor */}
          <div className="qp-editor-box">
            <div className="qp-toolbar">
              {["B","I","U","S"].map((t) => (
                <button key={t} className="qp-tool qp-tool-fmt" onClick={() => applyFormat(t)}
                  style={{ fontWeight: t === "B" ? 700 : 400, fontStyle: t === "I" ? "italic" : "normal",
                    textDecoration: t === "U" ? "underline" : t === "S" ? "line-through" : "none" }}>
                  {t}
                </button>
              ))}
              <div className="qp-tool-sep"/>
              <button className="qp-tool" title="Bullet list">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
              </button>
              <button className="qp-tool" title="Numbered list">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
              </button>
              <button className="qp-tool" title="Link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </button>
              <label className="qp-tool" title="Upload Image" style={{ cursor: "pointer" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload}/>
              </label>
              <div className="qp-tool-sep"/>
              <button className="qp-tool" title="Align left">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
              </button>
              <button className="qp-tool" title="Align center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
              </button>
            </div>

            {form.image && (
              <div className="qp-img-preview">
                <img src={form.image} alt="question visual"/>
                <button className="qp-img-remove" onClick={() => set("image", "")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            )}

            <textarea
              id="q-textarea"
              className="qp-textarea"
              placeholder="Type here"
              rows={5}
              value={form.question}
              onChange={(e) => set("question", e.target.value)}
            />
          </div>

          {/* options */}
          <p className="qp-opts-label">Type the options below</p>
          {(["option1","option2","option3","option4"] as const).map((opt) => (
            <div key={opt} className="qp-opt-row">
              <label className="qp-opt-radio">
                <input type="radio" name="correct" checked={form.correct_option === opt} onChange={() => set("correct_option", opt)}/>
                <span className="qp-radio-circle"/>
              </label>
              <input
                className="qp-opt-input"
                placeholder={`Type Option here`}
                value={form[opt]}
                onChange={(e) => set(opt, e.target.value)}
              />
              <button className="qp-opt-del" onClick={() => set(opt, "")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#98a2b3" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
              </button>
            </div>
          ))}

          {/* solution */}
          <p className="qp-sol-label">Add Solution</p>
          <div className="qp-editor-box">
            <textarea
              className="qp-textarea"
              placeholder="Type here"
              rows={4}
              value={form.explanation}
              onChange={(e) => set("explanation", e.target.value)}
            />
          </div>

          {/* question settings */}
          <p className="qp-settings-title">Question settings</p>

          <div className="qp-settings-field">
            <label>Level of Difficulty</label>
            <div className="qp-sel-wrap">
              <select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="difficult">Difficult</option>
              </select>
              <ChevronDown/>
            </div>
          </div>

          <div className="qp-settings-field">
            <label>Topic</label>
            <div className="qp-sel-wrap">
              <select><option>Select from Drop-down</option></select>
              <ChevronDown/>
            </div>
          </div>

          <div className="qp-settings-field">
            <label>Sub-topic</label>
            <div className="qp-sel-wrap">
              <select><option>Select from Drop-down</option></select>
              <ChevronDown/>
            </div>
          </div>

          {/* bottom actions */}
          <div className="qp-bottom-actions">
            <button className="qp-exit-btn" onClick={() => navigate("/")}>Exit Test Creation</button>
            <button className="qp-add-btn" onClick={saveAndAdd}>+ Add Question</button>
            <button className="qp-next-btn" onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Next"}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Question;