import { createContext, useContext, useState, type ReactNode } from "react";

export interface Question {
  id?: string;
  type: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  explanation?: string;
  difficulty?: string;
  topic?: string;
  sub_topic?: string;
}

export interface TestDraft {
  id?: string;
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  difficulty: string;
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  total_time: number;
  total_marks: number;
  total_questions: number;
}

interface TestContextType {
  testData: Partial<TestDraft>;
  setTestData: React.Dispatch<React.SetStateAction<Partial<TestDraft>>>;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  resetTest: () => void;
}

const TestContext = createContext<TestContextType | null>(null);

export const TestProvider = ({ children }: { children: ReactNode }) => {
  const [testData, setTestData] = useState<Partial<TestDraft>>({});
  const [questions, setQuestions] = useState<Question[]>([]);

  const resetTest = () => {
    setTestData({});
    setQuestions([]);
  };

  return (
    <TestContext.Provider value={{ testData, setTestData, questions, setQuestions, resetTest }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const ctx = useContext(TestContext);
  if (!ctx) throw new Error("useTest must be used within TestProvider");
  return ctx;
};