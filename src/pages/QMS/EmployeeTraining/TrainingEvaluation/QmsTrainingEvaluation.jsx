import React, { useState, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import ErrorModal from "../Modals/ErrorModal";
import QuestionAddSuccessModal from "../Modals/QuestionAddSuccessModal";
import DeleteQuestionConfirmModal from "../Modals/DeleteQuestionConfirmModal";
import DeleteQuestionSuccessModal from "../Modals/DeleteQuestionSuccessModal";
import RatingAddSuccessModal from "../Modals/RatingAddSuccessModal";
import DeleteTrainingEvaluationSuccessModal from "../Modals/DeleteTrainingEvaluationSuccessModal";
import DeleteTrainingEvaluationConfirmModal from "../Modals/DeleteTrainingEvaluationConfirmModal";
import SendMailModalTraining from "../SendMailModalTraining";


const EvaluationModal = ({
  isOpen,
  onClose,
  employee,
  employeeList,
  trainingEvaluationId,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState("Select Employee");
  const [selectedSource, setSelectedSource] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]); // Add employees state
  const [submitting, setSubmitting] = useState(false);
  const [showAddRatingSuccessModal, setShowAddRatingSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [activeRatingQuestion, setActiveRatingQuestion] = useState(null);
  const navigate = useNavigate();

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role");
    if (role === "company") return localStorage.getItem("company_id");
    else if (role === "user") {
      try {
        const userCompanyId = localStorage.getItem("user_company_id");
        return userCompanyId ? JSON.parse(userCompanyId) : null;
      } catch (e) {
        console.error("Error parsing user company ID:", e);
        return null;
      }
    }
    return null;
  };

  // Fetch training-specific evaluation data to get employees and users
  useEffect(() => {
    const fetchTrainingEvaluationData = async () => {
      try {
        const companyId = getUserCompanyId();
        
        const response = await axios.get(
          `${BASE_URL}/qms/training-evaluation/${companyId}/evaluation/${trainingEvaluationId}/`
        );
        
        console.log("Training evaluation data (filtered):", response.data);
        
        const evaluationData = response.data;
        const employeesFromEvaluation = evaluationData.filter(item => item.type === "employee");
        const usersFromEvaluation = evaluationData.filter(item => item.type === "user");
        
        setEmployees(employeesFromEvaluation);
        setUsers(usersFromEvaluation);
        
        console.log("Employees with incomplete training evaluations:", employeesFromEvaluation);
        console.log("Users with incomplete training evaluations:", usersFromEvaluation);
        
      } catch (error) {
        console.error("Error fetching training evaluation data:", error);
        setError("Failed to load training participants");
        setShowErrorModal(true);
        setTimeout(() => setShowErrorModal(false), 3000);
        
        setEmployees([]);
        setUsers([]);
      }
    };

    if (isOpen && trainingEvaluationId) {
      fetchTrainingEvaluationData();
    }
  }, [isOpen, trainingEvaluationId]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (selectedEmployee === "Select Employee" || !selectedEmployee) return;
      setLoading(true);
      try {
        const questionsResponse = await axios.get(
          `${BASE_URL}/qms/training-evaluation/${trainingEvaluationId}/questions/`
        );
        console.log("Fetched questions:", questionsResponse.data);
        const allQuestions = questionsResponse.data;
        const companyId = getUserCompanyId();
        const userResponse = await axios.get(
          `${BASE_URL}/qms/training-evaluation/${companyId}/evaluation/${trainingEvaluationId}/`
        );
        console.log("Fetched evaluation data:", userResponse.data);
        const userData = userResponse.data.find(
          (user) => user.id === parseInt(selectedEmployee)
        );

        const unansweredQuestions = allQuestions.map((question) => {
          const userQuestion = userData?.questions.find(
            (q) => q.question_text === question.question_text
          );
          return {
            ...question,
            answer: userQuestion?.answer || null,
          };
        }).filter((question) => !question.answer);

        console.log("Unanswered questions:", unansweredQuestions);
        setQuestions(unansweredQuestions);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions");
        setShowErrorModal(true);
        setTimeout(() => setShowErrorModal(false), 3000);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen && trainingEvaluationId && selectedEmployee !== "Select Employee") {
      fetchQuestions();
    }
  }, [isOpen, trainingEvaluationId, selectedEmployee]);

  const toggleRatingSelector = (questionId) => {
    if (selectedEmployee === "Select Employee") {
      setError("Please select an employee or user first");
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
      return;
    }
    setActiveRatingQuestion(activeRatingQuestion === questionId ? null : questionId);
  };

  const handleAnswerChange = (questionId, rating) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, answer: rating.toString() } : q
    );
    setQuestions(updatedQuestions);
    setActiveRatingQuestion(null);
  };

  const handleEmployeeChange = (e) => {
    const [source, id] = e.target.value.split(":");
    setSelectedEmployee(id);
    setSelectedSource(source);
    console.log("Selected:", { source, id });
  };

  const handleSubmitAllAnswers = async () => {
    if (selectedEmployee === "Select Employee" || !selectedSource) {
      setError("Please select an employee or user first");
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
      return;
    }

    setSubmitting(true);
    try {
      const questionsWithAnswers = questions.filter((q) => q.answer);

      if (questionsWithAnswers.length === 0) {
        throw new Error("No answers provided.");
      }

      console.log("Submitting answers for:", {
        source: selectedSource,
        id: selectedEmployee,
        questions: questionsWithAnswers,
      });

      for (const question of questionsWithAnswers) {
        const requestData = {
          answer: question.answer,
        };

        if (selectedSource === "employee") {
          requestData.employee_id = parseInt(selectedEmployee);
        } else if (selectedSource === "user") {
          requestData.user_id = parseInt(selectedEmployee);
        } else {
          throw new Error(`Invalid source type: ${selectedSource}`);
        }

        console.log("Request data for question", question.id, ":", requestData);

        try {
          const response = await axios.patch(
            `${BASE_URL}/qms/training-evaluation/question/answer/${question.id}/`,
            requestData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Success response for question", question.id, ":", response.data);
        } catch (questionError) {
          console.error("Error submitting answer for question:", question.id);
          console.error("Request data:", requestData);
          console.error("Error response:", questionError.response?.data);
          console.error("Error status:", questionError.response?.status);

          if (questionError.response?.status === 404) {
            if (requestData.user_id) {
              throw new Error(
                `User with ID ${requestData.user_id} not found for question ${question.id}`
              );
            } else if (requestData.employee_id) {
              throw new Error(
                `Employee with ID ${requestData.employee_id} not found for question ${question.id}`
              );
            } else {
              throw new Error(`Question ${question.id} not found`);
            }
          } else if (questionError.response?.status === 400) {
            throw new Error(
              `Invalid request for question ${question.id}: ${JSON.stringify(
                questionError.response.data
              )}`
            );
          } else if (questionError.response?.status === 403) {
            throw new Error(`Permission denied for question ${question.id}`);
          }

          throw questionError;
        }
      }

      // Refresh the data after successful submission
      const companyId = getUserCompanyId();
      const response = await axios.get(
        `${BASE_URL}/qms/training-evaluation/${companyId}/evaluation/${trainingEvaluationId}/`
      );
      
      const evaluationData = response.data;
      const employeesFromEvaluation = evaluationData.filter(item => item.type === "employee");
      const usersFromEvaluation = evaluationData.filter(item => item.type === "user");
      
      setEmployees(employeesFromEvaluation);
      setUsers(usersFromEvaluation);
      
      console.log("Refreshed employees:", employeesFromEvaluation);
      console.log("Refreshed users:", usersFromEvaluation);

      // Reset form state
      setQuestions([]);
      setSelectedEmployee("Select Employee");
      setSelectedSource(null);

      setShowAddRatingSuccessModal(true);
      setTimeout(() => {
        setShowAddRatingSuccessModal(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error submitting answers:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      let errorMessage = "Failed to submit answers";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data) {
        errorMessage = JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  // Format employee and user names for display
  const formatName = (item) =>
    item.first_name && item.last_name
      ? `${item.first_name} ${item.last_name}`
      : item.first_name || item.last_name || item.username || item.email || `ID ${item.id}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-[#24242D] rounded-lg w-[528px]"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-[#1C1C24] text-white flex items-start justify-center rounded-lg">
              <div className="w-[528px]">
                <div className="px-[8px] pt-5 pb-6 border-b border-[#383840] mx-3">
                  <p className="evaluate-modal-head">
                    Please respond to each question on a scale of 1-10, 1<br />
                    being Very Poor and 10 being Excellent
                  </p>
                </div>
                <RatingAddSuccessModal
                  showAddRatingSuccessModal={showAddRatingSuccessModal}
                  onClose={() => setShowAddRatingSuccessModal(false)}
                />
                <ErrorModal
                  errorMessege={error}
                  showErrorModal={showErrorModal}
                  onClose={() => setShowErrorModal(false)}
                  autoClose={false}
                />
                <div className="p-5 pt-6">
                  <div className="flex relative items-center gap-3">
                    <label className="block evaluate-modal-head">Select Employee or User</label>
                    <select
                      className="w-[215px] h-[49px] bg-[#24242D] p-2 rounded-md appearance-none cursor-pointer border-none px-3 select-employee-dropdown"
                      value={selectedSource ? `${selectedSource}:${selectedEmployee}` : "Select Employee"}
                      onChange={handleEmployeeChange}
                      onFocus={() => setIsDropdownOpen(true)}
                      onBlur={() => setIsDropdownOpen(false)}
                    >
                      <option value="Select Employee">Select Employee</option>
                      {employees.length > 0 && (
                        <optgroup label="Employees">
                          {employees.map((emp) => (
                            <option key={`employee-${emp.id}`} value={`employee:${emp.id}`}>
                              {formatName(emp)}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {users.length > 0 && (
                        <optgroup label="Users">
                          {users.map((user) => (
                            <option key={`user-${user.id}`} value={`user:${user.id}`}>
                              {formatName(user)}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                    <div className="absolute -top-[9px] right-[145px] flex items-center pr-2 pointer-events-none mt-6">
                      <ChevronDown
                        size={20}
                        className={`transition-transform duration-300 text-[#AAAAAA] ${isDropdownOpen ? "rotate-180deg" : ""}`}
                      />
                    </div>
                  </div>
                </div>
                {loading ? (
                  <div className="text-center py-6 not-found">Loading questions...</div>
                ) : (
                  <div className="max-h-[320px] overflow-y-auto">
                    <table className="min-w-full">
                      <thead className="bg-[#24242D]">
                        <tr className="h-[48px]">
                          <th className="px-4 text-left employee-evaluation-theads w-16">No</th>
                          <th className="px-4 text-left employee-evaluation-theads">Question</th>
                          <th className="px-4 text-right employee-evaluation-theads w-32">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {questions.length > 0 ? (
                          questions.map((question, index) => (
                            <React.Fragment key={question.id}>
                              <tr className="bg-[#1C1C24] border-b border-[#383840] cursor-pointer h-[54px]">
                                <td className="px-4 whitespace-nowrap employee-evaluate-data">{index + 1}</td>
                                <td className="px-4 whitespace-nowrap employee-evaluate-data">{question.question_text}</td>
                                <td className="px-4 whitespace-nowrap text-right">
                                  {question.answer ? (
                                    <div className="bg-[#24242D] rounded-md px-[10px] flex items-center justify-center w-[78px] h-[30px] ml-auto rating-data">
                                      {question.answer}
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => toggleRatingSelector(question.id)}
                                      className="!text-[#1E84AF] employee-evaluate-data"
                                    >
                                      {activeRatingQuestion === question.id ? (
                                        <X size={18} className="ml-auto text-[#AAAAAA]" />
                                      ) : (
                                        "Click to Answer"
                                      )}
                                    </button>
                                  )}
                                </td>
                              </tr>
                              {activeRatingQuestion === question.id && (
                                <tr className="bg-[#1C1C24] border-b border-[#383840]">
                                  <td colSpan="3" className="px-4 py-3">
                                    <div className="flex justify-between items-center gap-2 bg-[#24242D] px-[20px] h-[58px] rounded-[6px]">
                                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                                        <button
                                          key={rating}
                                          onClick={() => handleAnswerChange(question.id, rating)}
                                          className={`w-[33px] h-[26px] rounded-md flex items-center justify-center employee-evaluate-data ${
                                            rating === 10
                                              ? "border border-[#1E84AF] !text-[#1E84AF]"
                                              : "border border-[#5B5B5B] !text-[#5B5B5B]"
                                          } hover:border-[#1E84AF] hover:!text-[#1E84AF] duration-200`}
                                        >
                                          {rating}
                                        </button>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="text-center py-4 not-found">
                              {selectedEmployee === "Select Employee"
                                ? "Please select an employee or user"
                                : "No unanswered questions for this selection"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="p-4 flex justify-end space-x-4">
                  <button className="cancel-btn duration-200" onClick={onClose}>
                    Cancel
                  </button>
                  <button
                    className="save-btn duration-200"
                    onClick={handleSubmitAllAnswers}
                    disabled={submitting || questions.length === 0}
                  >
                    {submitting ? "Submitting..." : "Done"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const QuestionsModal = ({ isOpen, onClose, trainingEvaluationId }) => {
  const [formData, setFormData] = useState({
    question: "",
  });
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddQuestionSuccessModal, setShowAddQuestionSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [showDeleteQuestionSuccessModal, setShowDeleteQuestionSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      if (trainingEvaluationId) {
        setLoading(true);
        try {
          const response = await axios.get(
            `${BASE_URL}/qms/training-evaluation/${trainingEvaluationId}/questions/`
          );
          setQuestions(response.data);
        } catch (err) {
          console.error("Error fetching questions:", err);
          let errorMsg = err.message;
          if (err.response) {
            if (err.response.data.date) errorMsg = err.response.data.date[0];
            else if (err.response.data.detail) errorMsg = err.response.data.detail;
            else if (err.response.data.message) errorMsg = err.response.data.message;
          }
          setError(errorMsg);
        } finally {
          setLoading(false);
        }
      }
    };
    if (isOpen) fetchQuestions();
  }, [isOpen, trainingEvaluationId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim()) {
      setError("Question is required");
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/qms/training-evaluation/question-add/`,
        {
          emp_training_eval: trainingEvaluationId,
          question_text: formData.question,
        }
      );
      setQuestions([...questions, response.data]);
      setFormData({ question: "" });
      setShowAddQuestionSuccessModal(true);
      setTimeout(() => {
        setShowAddQuestionSuccessModal(false);
        navigate("/company/qms/training-evaluation");
      }, 1500);
      setError("");
    } catch (err) {
      console.error("Error adding question:", err);
      let errorMsg = err.message;
      if (err.response) {
        if (err.response.data.date) errorMsg = err.response.data.date[0];
        else if (err.response.data.detail) errorMsg = err.response.data.detail;
        else if (err.response.data.message) errorMsg = err.response.data.message;
      }
      setError(errorMsg);
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (question) => {
    setQuestionToDelete(question);
    setShowDeleteModal(true);
  };

  const closeAllModals = () => {
    setShowDeleteModal(false);
    setDeleteQuestionSuccessModal(false);
    setShowErrorModal(false);
    setShowAddQuestionSuccessModal(false);
  };

  const confirmDeleteQuestion = async () => {
    if (!questionToDelete) return;
    setLoading(true);
    try {
      await axios.delete(
        `${BASE_URL}/qms/training-evaluation/question/${questionToDelete.id}/delete/`
      );
      setQuestions(questions.filter((question) => question.id !== questionToDelete.id));
      setShowDeleteModal(false);
      setShowDeleteQuestionSuccessModal(true);
      setTimeout(() => setShowDeleteQuestionSuccessModal(false), 1500);
    } catch (err) {
      console.error("Error deleting question:", err);
      let errorMsg = err.message;
      if (err.response) {
        errorMsg = err.response.data.date?.[0] || err.response.data.detail || err.response.data.message || "Failed to delete question";
      }
      setError(errorMsg);
      setShowDeleteModal(false);
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ question: "" });
    setError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
       <motion.div
  key="questions-modal"
  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  <motion.div
    className="bg-[#1C1C24] rounded-lg w-[528px] max-h-[505px]"
    initial={{ scale: 0.9, y: 20 }}
    animate={{ scale: 1, y: 25 }}
    exit={{ scale: 0.9, y: 20 }}
    transition={{ type: "spring", damping: 25, stiffness: 300 }}
  >
      <form onSubmit={handleSubmit} className="p-5">
        <div className="mb-5">
          <label className="block mb-3 add-question-label">
            Question <span className="text-red-500">*</span>
          </label>
          <textarea
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="w-full bg-[#24242D] rounded-md p-3 h-[111px] text-white outline-none add-question-inputs"
            placeholder="Add Question"
            disabled={loading}
          />
          {error && <p className="text-red-500 mt-1">{error}</p>}
        </div>
        <div className="flex justify-end w-full">
          <div className="flex w-[80%] gap-5">
            <button
              type="button"
              onClick={() => { handleCancel(); onClose(); }}
              className="flex-1 cancel-btn duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 save-btn duration-200"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
      {loading && questions.length === 0 ? (
        <div className="text-center py-4 not-found">Loading questions...</div>
      ) : (
        questions.length > 0 && (
       // Fixed table structure - replace the problematic section with this:
<div className="mb-4">
  <table className="w-full text-left">
    <thead className="bg-[#24242D]">
      <tr className="h-[48px]">
        <th className="px-4 add-question-theads text-left w-[10%]">No</th>
        <th className="px-4 add-question-theads text-left w-[70%]">Question</th>
        <th className="px-4 pr-8 add-question-theads text-right">Delete</th>
      </tr>
    </thead>
    <tbody>
      {questions.map((question, index) => (
        <tr
          key={question.id}
          className="border-b border-[#383840] h-[42px] last:border-b-0"
        >
          <td className="px-4 add-question-data w-[10%]">{index + 1}</td>
          <td className="px-4 add-question-data w-[70%]">{question.question_text}</td>
          <td className="px-4 text-center">
            <button
              onClick={() => openDeleteModal(question)}
              className="text-gray-400 hover:text-white"
              disabled={loading}
            >
              <img src={deleteIcon} alt="Delete Icon" />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        )
      )}
      <QuestionAddSuccessModal
        key="add-question-success"
        showAddQuestionSuccessModal={showAddQuestionSuccessModal}
        onClose={() => setShowAddQuestionSuccessModal(false)}
      />
      <DeleteQuestionConfirmModal
        key="delete-question-confirm"
        showDeleteModal={showDeleteModal}
        onConfirm={confirmDeleteQuestion}
        onCancel={closeAllModals}
      />
      <DeleteQuestionSuccessModal
        key="delete-question-success"
        showDeleteQuestionSuccessModal={showDeleteQuestionSuccessModal}
        onClose={() => setShowDeleteQuestionSuccessModal(false)}
      />
      <ErrorModal
        key="error-modal"
        showErrorModal={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={error}
      />
    </motion.div>
        </motion.div >
      )}
    </AnimatePresence >
  );
};

const QmsTrainingEvaluation = () => {
  const [trainingEmployees, setTrainingEmployees] = useState([]);
  const [sendMail, setSendMail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [draftCount, setDraftCount] = useState(0);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const [evaluationModal, setEvaluationModal] = useState({ isOpen: false, employee: null, trainingEvaluationId: null });
  const [questionsModal, setQuestionsModal] = useState({ isOpen: false, trainingEvaluationId: null });
  const [sendMailModal, setSendMailModal] = useState({ isOpen: false, trainingEvaluationId: null });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [trainingEvaluationToDelete, setTrainingEvaluationToDelete] = useState(null);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [
    showDeleteTrainingEvaluationSuccessModal,
    setShowDeleteTrainingEvaluationSuccessModal,
  ] = useState(false);
  const getUserCompanyId = () => {
    const role = localStorage.getItem("role");
    if (role === "company") {
      return localStorage.getItem("company_id");
    } else if (role === "user") {
      try {
        const userCompanyId = localStorage.getItem("user_company_id");
        return userCompanyId ? JSON.parse(userCompanyId) : null;
      } catch (e) {
        console.error("Error parsing user company ID:", e);
        return null;
      }
    }
    return null;
  };

  const getRelevantUserId = () => {
    const role = localStorage.getItem("role");
    if (role === "user") {
      const userId = localStorage.getItem("user_id");
      if (userId) return userId;
    }
    const companyId = localStorage.getItem("company_id");
    if (companyId) return companyId;
    return null;
  };

  const fetchSendMail = async () => {
    setLoading(true);
    try {
      const companyId = getUserCompanyId();
      const response = await axios.get(`${BASE_URL}/qms/training-evaluation/company/${companyId}/`);
      setSendMail(response.data);
    } catch (err) {
      console.error("Error fetching send mail data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTrainingAssignments = async () => {
      setLoading(true);
      try {
        const userId = getRelevantUserId();
        const companyId = getUserCompanyId();
        if (!companyId) {
          setError("Company ID not found");
          setLoading(false);
          return;
        }
        const response = await axios.get(
          `${BASE_URL}/qms/training-evaluation/${companyId}/`
        );
        const draftResponse = await axios.get(
          `${BASE_URL}/qms/training-evaluation/drafts-count/${userId}/`
        );
        setDraftCount(draftResponse.data.count);
        const sortedTrainingEvaluations = response.data.sort((a, b) => a.id - b.id);
        setTrainingEmployees(sortedTrainingEvaluations);
        setError(null);
      } catch (err) {
        let errorMsg = err.message;
        if (err.response) {
          errorMsg = err.response.data.date?.[0] || err.response.data.detail || err.response.data.message || errorMsg;
        }
        setError(errorMsg);
        console.error("Error fetching training evaluation data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainingAssignments();
    fetchSendMail();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTrainingEvaluations = trainingEmployees.filter((trainingEvaluation) =>
    trainingEvaluation.evaluation_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = () => {
    navigate("/company/qms/add-training-evaluation");
  };

  const handleDraftEmployeeTraining = () => {
    navigate("/company/qms/drafts-training-evaluation");
  };

  const handleView = (id) => {
    navigate(`/company/qms/views-training-evaluation/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/company/qms/edits-training-evaluation/${id}`);
  };

  const handleResultGraph = () => {
    navigate("/company/qms/training-evaluation-graph");
  };

  const openDeleteModal = (trainingEvaluation) => {
    setTrainingEvaluationToDelete(trainingEvaluation);
    setShowDeleteModal(true);
  };

  const openSendMailModal = (trainingEvaluationId) => {
    setSendMailModal({ isOpen: true, trainingEvaluationId });
  };

  const cancelDeleteTraining = () => {
    setShowDeleteModal(false);
    setTrainingEvaluationToDelete(null);
  };

  const confirmDeleteTraining = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/qms/training-evaluation/${trainingEvaluationToDelete.id}/update/`
      );
      setTrainingAssignments(
        trainingEmployees.filter(
          (trainingEvaluation) => trainingEvaluation.id !== trainingEvaluationToDelete.id
        )
      );
      setShowDeleteModal(false);
      setShowDeleteTrainingEvaluationSuccessModal(true);
      setTimeout(() => {
        setShowDeleteTrainingEvaluationSuccessModal(false);
      }, 2000);
    } catch (err) {
      console.error("Error deleting training evaluation:", err);
      let errorMsg = err.message;
      if (err.response) {
        errorMsg = err.response.data.date?.[0] || err.response.data.detail || err.response.data.message || errorMsg;
      }
      setError(errorMsg);
      setShowDeleteModal(false);
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 2000);
    }
  };

  const openEvaluationModal = (trainingEvaluation) => {
    setEvaluationModal({
      isOpen: true,
      employee: trainingEvaluation,
      trainingEvaluationId: trainingEvaluation.id,
    });
  };

  const openQuestionsModal = (trainingEvaluationId) => {
    setQuestionsModal({ isOpen: true, trainingEvaluationId });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");
  };

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTrainingEvaluations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTrainingEvaluations.length / itemsPerPage);

  const currentUserId = getRelevantUserId();
  const isManager = sendMail.some((item) => String(item.manager?.id) === String(currentUserId));

  if (loading) {
    return (
      <div className="bg-[#1C1C24] not-found p-5 rounded-lg flex justify-center">
        Loading Training Evaluations...
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-center pb-5">
        <h1 className="employee-performance-head">List Training Evaluations</h1>
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-[#1C1C24] text-white px-[10px] h-[42px] rounded-md w-[180px] border border-[#383840] outline-none"
              value={searchTerm}
              onChange={(handleSearch)}
            />
            <div className="absolute right-[1px] top-[1px] text-white bg-[#24242D] p-[11px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center">
              <Search size={18} />
            </div>
          </div>
          <button
            className="flex items-center justify-center !w-[100px] add-manual-btn gap-[10px] duration-200 border border-[#858585] px-[10px] py-2 leading-[10px] text-[#808080] hover:bg-[#24242D] hover:text-white"
            onClick={() => handleDraftEmployeeTraining()}
          >
            <span>Draft</span>
            {draftCount > 0 && (
              <span className="bg-red-500 text-white rounded-full text-xs flex justify-center items-center h-[20px] w-[20px] absolute top-[10px] right-[242px]">
                {draftCount}
              </span>
            )}
          </button>
          <button
            className="flex items-center justify-center !px-[10px] py-2 leading-[10px] add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#808080] hover:bg-[#24242D] hover:text-white"
            onClick={() => handleAddEmployee()}
          >
            <span>Add Training Evaluation</span>
            <img
              src={plusIcon}
              alt="Add Icon"
              className="w-[18px] h-[18px] qms-add-plus"
            />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#24242D]">
            <tr className="h-[48px]">
              <th className="px-2 pl-4 pr-2 text-left add-manual-theads">List</th>
              <th className="px-2 text-left add-manual-theads">Title</th>
              <th className="px-2 text-left add-manual-theads">Valid Till</th>
              {!isManager && (
                <>
                  <th className="px-2 text-left add-manual-theads">Add Questions</th>
                  <th className="px-2 text-left add-manual-theads">Email</th>
                </>
              )}
              <th className="px-2 text-left add-manual-theads">See Result Graph</th>
              {isManager && currentUserId !== "14" && (
                <th className="px-2 text-left add-manual-theads">Training</th>
              )}
              <th className="px-2 text-center add-manual-theads">View</th>
              <th className="px-2 text-center add-manual-theads">Edit</th>
              <th className="px-2 text-center add-manual-theads">Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((trainingEvaluation, index) => (
                <tr
                  key={trainingEvaluation.id}
                  className="border-b border-[#383840] hover:bg-[#1a1a20] h-[36px] cursor-pointer"
                >
                  <td className="pl-5 pr-2 add-manual-datas">{indexOfFirstItem + index + 1}</td>
                  <td className="px-2 add-manual-datas">{trainingEvaluation.evaluation_title || "Anonymous"}</td>
                  <td className="px-2 add-manual-datas">{formatDate(trainingEvaluation.valid_till)}</td>
                  {!isManager && (
                    <>
                      <td className="px-2 add-manual-datas">
                        <button
                          className="text-[#1E84AF] hover:text-[#176d8e] transition-colors duration-100"
                          onClick={() => openQuestionsModal(trainingEvaluation.id)}
                        >
                          Add Questions
                        </button>
                      </td>
                      <td className="px-2 add-manual-datas">
                        <button
                          className="text-[#1E84AF] hover:text-[#176d8e] transition-colors duration-100"
                          onClick={() => openSendMailModal(trainingEvaluation.id)}
                        >
                          Send Mail
                        </button>
                      </td>
                    </>
                  )}
                  <td className="px-2 add-manual-datas">
                    <button
                      className="text-[#1E84AF] hover:text-[#176d8e] transition-colors duration-100"
                      onClick={() => handleResultGraph()}
                    >
                      See Result Graph
                    </button>
                  </td>
                  {isManager && currentUserId !== "14" && (
                    <td className="px-2 add-manual-datas">
                      <button
                        className="text-[#1E84AF] hover:text-[#176d8e] transition-colors duration-100"
                        onClick={() => openEvaluationModal(trainingEvaluation)}
                      >
                        Click to Evaluate
                      </button>
                    </td>
                  )}
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => handleView(trainingEvaluation.id)}>
                      <img src={viewIcon} alt="View Icon" className="action-btn" />
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => handleEdit(trainingEvaluation.id)}>
                      <img src={editIcon} alt="Edit Icon" className="action-btn" />
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button
                      onClick={() => openDeleteModal(trainingEvaluation)}
                    >
                      <img src={deleteIcon} alt="Delete Icon" className="action-btn" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isManager ? 7 : 10} className="text-center py-4 not-found">
                  No employee training evaluation found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {filteredTrainingEvaluations.length > 0 && (
        <div className="flex justify-between items-center mt-3">
          <div className="text-white total-text">Total-{filteredTrainingEvaluations.length}</div>
          <div className="flex items-center gap-5">
            <button
              className={`cursor-pointer swipe-text ${currentPage === 1 ? "opacity-50" : ""}`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(Math.min(4, totalPages))].map((_, i) => {
              const pageToShow =
                currentPage <= 2
                  ? i + 1
                  : currentPage >= totalPages - 1
                    ? totalPages - 3 + i
                    : currentPage - 2 + i;
              if (pageToShow <= totalPages && pageToShow > 0) {
                return (
                  <button
                    key={pageToShow}
                    className={`${currentPage === pageToShow ? "pagin-active" : "pagin-inactive"}`}
                    onClick={() => setCurrentPage(pageToShow)}
                  >
                    {pageToShow}
                  </button>
                );
              }
              return null;
            })}
            <button
              className={`cursor-pointer swipe-text ${currentPage === totalPages ? "opacity-50" : ""}`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
      <EvaluationModal
        isOpen={evaluationModal.isOpen}
        onClose={() => setEvaluationModal({ isOpen: false, employee: null, trainingEvaluationId: null })}
        employee={evaluationModal.employee}
        employeeList={employees}
        trainingEvaluationId={evaluationModal.trainingEvaluationId}
      />
      <QuestionsModal
        isOpen={questionsModal.isOpen}
        onClose={() => setQuestionsModal({ isOpen: false, trainingEvaluationId: null })}
        trainingEvaluationId={questionsModal.trainingEvaluationId}
      />
      <SendMailModalTraining
        isOpen={sendMailModal.isOpen}
        onClose={() => setSendMailModal({ isOpen: false, trainingEvaluationId: null })}
        trainingEvaluationId={sendMailModal.trainingEvaluationId}
      />
      <DeleteTrainingEvaluationConfirmModal
        showDeleteModal={showDeleteModal}
        onConfirm={confirmDeleteTraining}
        onCancel={cancelDeleteTraining}
      />
      <DeleteTrainingEvaluationSuccessModal
        showDeleteTrainingEvaluationSuccessModal={showDeleteTrainingEvaluationSuccessModal}
        onClose={() => setShowDeleteTrainingEvaluationSuccessModal(false)}
      />
      <ErrorModal
        showErrorModal={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={error}
      />
    </div>
  );
};

export default QmsTrainingEvaluation;