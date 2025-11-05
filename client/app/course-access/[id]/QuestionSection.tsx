"use client";
import { useAddAnswerMutation, useAddQuestionMutation } from "@/redux/features/courses/courseApi";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
type Notification = {
  _id: string;
  message: string;
  title: string;
  status: "read" | "unread";
  userId: string;
};
const QuestionSection = ({
  lectureId,
  question,
  name,
  id,
}: {
  lectureId: string;
  question: any;
  id: string;
   name:string,
}) => {
  const [questions, setQuestions] = useState<any>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [addQuestion] = useAddQuestionMutation();
  const [AddAnswer] = useAddAnswerMutation();
  const { user } = useSelector((state: any) => state.auth);

  const socketRef = useRef<any>(null);

  // Connect socket
  useEffect(() => {
    if (!user) return;

    const socket = io("https://socket-dpdp.onrender.com/", {
      withCredentials: true,
      transports: ["websocket"],
      query: { userId: user._id },
    });

    socketRef.current = socket;

    socket.on("connect", () => console.log("✅ Connected to socket:", socket.id));
    socket.on("disconnect", () => console.log("❌ Disconnected from socket"));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Set existing questions
  useEffect(() => {
    setQuestions(question);
  }, [question]);

  // Add Question
  const addQuestionHandler = async () => {
    if (!newQuestion.trim()) return;

    const data: any = await addQuestion({
      question: newQuestion,
      courseId: id,
      contentId: lectureId,
    });

    if (data && data.data.success) {
      const q = data.data.question;
      setQuestions((prev: any[]) => [q, ...prev]);
      setNewQuestion("");

      
      // 🔔 Emit socket notification
      if (socketRef.current) {
        socketRef.current.emit("Notification", {
          type: "reply",
          message: `${user.name} asked to question in your course ${name}.`,
          courseId: id,
          questionId: q._id,
          userId: user._id,
        });
      }
    }
  };

  // Add Reply
  const addReply = async (questionId: string) => {
    const reply = replyInputs[questionId]?.trim();
    if (!reply) return;

    try {
      const { data }: any = await AddAnswer({
        data: {
          answer: reply,
          questionId,
          courseId: id,
          contentId: lectureId,
        },
      });

      if (data && data.success) {
        const newReply = data.newAnswer;

        setQuestions((prev: any[]) =>
          prev.map((q) =>
            q._id === questionId
              ? { ...q, questionreplies: [newReply, ...q.questionreplies] }
              : q
          )
        );

        setReplyInputs((prev) => ({ ...prev, [questionId]: "" }));

        // 🔔 Emit socket notification for replies
        // if (socketRef.current) {
        //   socketRef.current.emit("newNotification", {
        //     type: "reply",
        //     message: `${user.name} replied to a question.`,
        //     courseId: id,
        //     questionId,
        //     userId: user._id,
        //   });
        // }
      }
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };
console
  return (
    <div className="bg-card text-foreground p-6">
      <h3 className="text-xl font-bold mb-4">Questions & Answers</h3>

      { lectureId ? (
        <>
          {/* Add Question Input */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Ask a question about this lecture..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="flex-1 px-3 py-2 rounded-md bg-border border border-border focus:outline-none focus:border-blue-500 text-foreground"
            />
            <button
              onClick={addQuestionHandler}
              className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-md font-medium"
            >
              Post
            </button>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {!questions || questions.length === 0 ? (
              <p className="text-muted-foreground">
                No questions yet. Be the first to ask!
              </p>
            ) : (
              <>
                {questions.map((q: any, index: number) => (
                  <div
                    key={index}
                    className="bg-border p-4 rounded-lg border border-border mb-4"
                  >
                    {/* --- Question Header --- */}
                    <div className="flex items-center gap-3 mb-2">
                      {q.user?.avatar ? (
                        <img
                          src={q.user.avatar.url}
                          alt={q.user.name}
                          className="w-8 h-8 rounded-full object-cover border border-gray-600"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-gray-300">
                          {q.user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {q.user?.name}
                        </p>
                      </div>
                    </div>

                    {/* --- Question Body --- */}
                    <p className="text-foreground font-medium mb-3">
                      Question: {q.question}
                    </p>

                    {/* --- Replies --- */}
                    <div className="ml-4 mt-3 space-y-3">
                      {q.questionreplies && q.questionreplies.length > 0 ? (
                        q.questionreplies.map((reply: any, idx: number) => (
                          <div
                            key={idx}
                            className="border-l-2 border-border pl-3 py-1 text-gray-300 text-sm"
                          >
                            <div className="flex items-center gap-2">
                              {reply.user?.avatar.url ? (
                                <img
                                  src={reply.user.avatar.url}
                                  alt={reply.user.name}
                                  className="w-6 h-6 rounded-full object-cover border border-gray-600"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-border flex items-center justify-center text-gray-300">
                                  {reply.user?.name?.[0]?.toUpperCase() || "U"}
                                </div>
                              )}
                              <span className="font-semibold text-foreground text-sm">
                                {reply.user?.name}
                              </span>
                            </div>
                            <p className="ml-8">{reply.answer}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted text-sm">No replies yet.</p>
                      )}

                      {/* --- Reply Input --- */}
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={replyInputs[q._id] || ""}
                          onChange={(e) =>
                            setReplyInputs((prev) => ({
                              ...prev,
                              [q._id]: e.target.value,
                            }))
                          }
                          placeholder="Write a reply..."
                          className="flex-1 px-2 py-1 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-blue-500 text-foreground"
                        />
                        <button
                          onClick={() => addReply(q._id)}
                          className="bg-primary hover:bg-primary-dark text-sm px-3 py-1 rounded-md text-foreground"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      ) : (
        <div>
          <p className="text-muted-foreground">Select a video to ask questions</p>
        </div>
      )}
    </div>
  );
};

export default QuestionSection;
