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

const EvaluationModal = ({
  isOpen,
  onClose,
  employee,
  employeeList,
  performanceId,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState(
    employee ? employee.id || "Select Employee" : "Select Employee"
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [performances, setPerformances] = useState([]);
  const navigate = useNavigate();

  const [showAddRatingSuccessModal, setShowAddRatingSuccessModal] =
    useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // New state to track changes before submitting
  const [updatedAnswers, setUpdatedAnswers] = useState({});
  // Track which question is currently showing the rating selector
  const [activeRatingQuestion, setActiveRatingQuestion] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const companyId = getUserCompanyId();

        const response = await axios.get(
          `${BASE_URL}/qms/training-evaluation/${companyId}/evaluation/${performanceId}/`
        );
        setUsers(response.data);
        console.log("uuuuuuuuuuuuuuuuuu", response.data);
      } catch (error) {
        console.error("Error fetching unsubmitted users:", error);
      }
    };

    if (isOpen && performanceId) {
      fetchUsers();
    }
  }, [isOpen, performanceId]);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      setLoading(true);
      try {
        const companyId = getUserCompanyId();
        if (!companyId) {
          setError("Company ID not found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/qms/training-evaluation/${companyId}/`
        );
        setPerformances(response.data);
        setError(null);
      } catch (err) {
        let errorMsg =  err.message;

        if (err.response) {
          // Check for field-specific errors first
          if (err.response.data.date) {
            errorMsg = err.response.data.date[0];
          }
          // Check for non-field errors
          else if (err.response.data.detail) {
            errorMsg = err.response.data.detail;
          } else if (err.response.data.message) {
            errorMsg = err.response.data.message;
          }
        } else if (err.message) {
          errorMsg = err.message;
        }

        setError(errorMsg);
        console.error("Error fetching employee performance data:", err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch employees for dropdown
    fetchPerformanceData();
  }, []);

  // Fetch questions when modal opens
  useEffect(() => {
    if (isOpen && performanceId) {
      fetchQuestions();
    }
  }, [isOpen, performanceId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/qms/training-evaluation/${performanceId}/questions/`
      );
      setQuestions(response.data);
      console.log("Fetched questions:", response.data);
    } catch (err) {
      console.error("Error fetching questions:", err);
      let errorMsg = err.message;

      if (err.response) {
        // Check for field-specific errors first
        if (err.response.data.date) {
          errorMsg = err.response.data.date[0];
        }
        // Check for non-field errors
        else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Toggle the rating selector for a specific question
  const toggleRatingSelector = (questionId) => {
    if (selectedEmployee === "Select Employee") {
      setError("Please select an employee first");
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
      return;
    }

    setActiveRatingQuestion(
      activeRatingQuestion === questionId ? null : questionId
    );
  };

  // Handle when a rating is selected
  const handleAnswerChange = (questionId, rating) => {
    if (selectedEmployee === "Select Employee") {
      setError("Please select an employee first");
      return;
    }

    // Update local state for UI
    const updatedQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, answer: rating } : q
    );
    setQuestions(updatedQuestions);

    // Store the changes to be submitted later
    setUpdatedAnswers({
      ...updatedAnswers,
      [questionId]: rating,
    });

    // Close rating selector after selection
    setActiveRatingQuestion(null);
  };

  // Submit all answers when Save button is clicked
  const handleSubmitAllAnswers = async () => {
    if (selectedEmployee === "Select Employee") {
      setError("Please select an employee first");
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
      return;
    }

    if (Object.keys(updatedAnswers).length === 0) {
      // No answers to submit
      onClose();
      return;
    }

    setLoading(true);
    try {
      // Submit all updated answers
      const promises = Object.entries(updatedAnswers).map(
        ([questionId, rating]) => {
          console.log("Submitting answer with data:", {
            questionId,
            answer: rating,
            user_id: selectedEmployee,
          });

          return axios.patch(
            `${BASE_URL}/qms/training-evaluation/question/answer/${questionId}/`,
            {
              answer: rating,
              user_id: selectedEmployee,
            }
          );
        }
      );

      await Promise.all(promises);

      setShowAddRatingSuccessModal(true);
      setTimeout(() => {
        setShowAddRatingSuccessModal(false);
        navigate("/company/qms/training-evaluation");
      }, 1500);
    } catch (err) {
      console.error("Error updating answers:", err);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
      let errorMsg = err.message;

      if (err.response) {
        // Check for field-specific errors first
        if (err.response.data.date) {
          errorMsg = err.response.data.date[0];
        }
        // Check for non-field errors
        else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const combinedOptions = [...(employeeList || []), ...(users || [])].reduce(
    (unique, item) => {
      const exists = unique.find((x) => x.id === item.id);
      if (!exists) {
        unique.push(item);
      }
      return unique;
    },
    []
  );

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
                  onClose={() => {
                    setShowAddRatingSuccessModal(false);
                  }}
                />

                <ErrorModal
                  errorMessege={error}
                  showErrorModal={showErrorModal}
                  onClose={() => {
                    setShowErrorModal(false);
                  }}
                />

                <div className="p-5 pt-6">
                  <div className="flex relative items-center gap-3">
                    <label className="block evaluate-modal-head">
                      Select Employee
                    </label>
                    <select
                      className="w-[215px] h-[49px] bg-[#24242D] p-2 rounded-md appearance-none cursor-pointer border-none px-3 select-employee-dropdown"
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      onFocus={() => setIsDropdownOpen(true)}
                      onBlur={() => setIsDropdownOpen(false)}
                    >
                      <option value="Select Employee">Select Employee</option>
                      {combinedOptions.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.first_name && item.last_name
                            ? `${item.first_name} ${item.last_name}`
                            : item.first_name ||
                              item.last_name ||
                              item.username ||
                              item.email}
                        </option>
                      ))}
                    </select>

                    <div className="absolute -top-[9px] right-[145px] flex items-center pr-2 pointer-events-none mt-6">
                      <ChevronDown
                        size={20}
                        className={`transition-transform duration-300 text-[#AAAAAA] ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-6">Loading questions...</div>
                ) : (
                  <div className="max-h-[320px] overflow-y-auto">
                    <table className="min-w-full">
                      <thead className="bg-[#24242D]">
                        <tr className="h-[48px]">
                          <th className="px-4 text-left employee-evaluation-theads w-16">
                            No
                          </th>
                          <th className="px-4 text-left employee-evaluation-theads">
                            Question
                          </th>
                          <th className="px-4 text-right employee-evaluation-theads w-32">
                            Answer
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {questions.length > 0 ? (
                          questions.map((question, index) => (
                            <React.Fragment key={question.id}>
                              <tr className="bg-[#1C1C24] border-b border-[#383840] cursor-pointer h-[54px]">
                                <td className="px-4 whitespace-nowrap employee-evaluate-data">
                                  {index + 1}
                                </td>
                                <td className="px-4 whitespace-nowrap employee-evaluate-data">
                                  {question.question_text}
                                </td>
                                <td className="px-4 whitespace-nowrap text-right">
                                  {question.answer ? (
                                    <div className="bg-[#24242D] rounded-md px-[10px] flex items-center justify-center w-[78px] h-[30px] ml-auto rating-data">
                                      {question.answer}
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        toggleRatingSelector(question.id)
                                      }
                                      className="!text-[#1E84AF] employee-evaluate-data"
                                    >
                                      {activeRatingQuestion === question.id ? (
                                        <X
                                          size={18}
                                          className="ml-auto text-[#AAAAAA]"
                                        />
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
                                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                        (rating) => (
                                          <button
                                            key={rating}
                                            onClick={() =>
                                              handleAnswerChange(
                                                question.id,
                                                rating
                                              )
                                            }
                                            className={`w-[33px] h-[26px] rounded-md flex items-center justify-center employee-evaluate-data ${
                                              rating === 10
                                                ? "border border-[#1E84AF] !text-[#1E84AF]"
                                                : "border border-[#5B5B5B] !text-[#5B5B5B]"
                                            } hover:border-[#1E84AF] hover:!text-[#1E84AF] duration-200`}
                                          >
                                            {rating}
                                          </button>
                                        )
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="3"
                              className="text-center py-4 not-found"
                            >
                              No questions available
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
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Save"}
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

const QuestionsModal = ({ isOpen, onClose, performanceId }) => {
  const [formData, setFormData] = useState({
    question: "",
  });
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showAddQuestionSuccessModal, setShowAddQuestionSuccessModal] =
    useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  // Delete related states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [showDeleteQuestionSuccessModal, setShowDeleteQuestionSuccessModal] =
    useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (performanceId) {
        setLoading(true);
        try {
          const response = await axios.get(
            `${BASE_URL}/qms/training-evaluation/${performanceId}/questions/`
          );
          console.log("aaaaaaaaaaa", response.data);

          setQuestions(response.data);
        } catch (err) {
          console.error("Error fetching questions:", err);
          let errorMsg = err.message;

          if (err.response) {
            // Check for field-specific errors first
            if (err.response.data.date) {
              errorMsg = err.response.data.date[0];
            }
            // Check for non-field errors
            else if (err.response.data.detail) {
              errorMsg = err.response.data.detail;
            } else if (err.response.data.message) {
              errorMsg = err.response.data.message;
            }
          } else if (err.message) {
            errorMsg = err.message;
          }

          setError(errorMsg);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isOpen) {
      fetchQuestions();
    }
  }, [isOpen, performanceId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting formData:", formData);
    if (!formData.question.trim()) {
      setError("Question is required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/qms/training-evaluation/question-add/`,
        {
          emp_training_eval: performanceId,
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
      let errorMsg =  err.message;

      if (err.response) {
        // Check for field-specific errors first
        if (err.response.data.date) {
          errorMsg = err.response.data.date[0];
        }
        // Check for non-field errors
        else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (question) => {
    setQuestionToDelete(question);
    setShowDeleteModal(true);
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowDeleteQuestionSuccessModal(false);
    setShowErrorModal(false);
    setShowAddQuestionSuccessModal(false);
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    if (!questionToDelete) return;

    setLoading(true);
    try {
      await axios.delete(
        `${BASE_URL}/qms/training-evaluation/question/${questionToDelete.id}/delete/`
      );

      // Remove the deleted question from state
      setQuestions(
        questions.filter((question) => question.id !== questionToDelete.id)
      );
      setShowDeleteModal(false);
      setShowDeleteQuestionSuccessModal(true);
      setTimeout(() => {
        setShowDeleteQuestionSuccessModal(false);
      }, 1500);
    } catch (err) {
      console.error("Error deleting question:", err);
      setShowDeleteModal(false);
      let errorMsg = err.message;

      if (err.response) {
        // Check for field-specific errors first
        if (err.response.data.date) {
          errorMsg = err.response.data.date[0];
        }
        // Check for non-field errors
        else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-[#1C1C24] rounded-lg w-[528px] max-h-[505px]"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
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
                    onClick={() => {
                      handleCancel();
                      onClose();
                    }}
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
              <div className="text-center py-4">Loading questions...</div>
            ) : (
              questions.length > 0 && (
                <div className="mb-4">
                  <table className="w-full text-left">
                    <thead className="bg-[#24242D]">
                      <tr className="h-[48px]">
                        <th className="px-4 add-question-theads text-left w-[10%]">
                          No
                        </th>
                        <th className="px-4 add-question-theads text-left w-[70%]">
                          Question
                        </th>
                        <th className="px-4 pr-8 add-question-theads text-right">
                          Delete
                        </th>
                      </tr>
                    </thead>
                  </table>
                  <div className="max-h-[148px] overflow-y-auto">
                    <table className="w-full text-left">
                      <tbody>
                        {questions.map((question, index) => (
                          <tr
                            key={question.id}
                            className="border-b border-[#383840] h-[42px] last:border-b-0"
                          >
                            <td className="px-4 add-question-data w-[10%]">
                              {index + 1}
                            </td>
                            <td className="px-4 add-question-data w-[70%]">
                              {question.question_text}
                            </td>
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
                </div>
              )
            )}
          </motion.div>
        </motion.div>
      )}

      <QuestionAddSuccessModal
        showAddQuestionSuccessModal={showAddQuestionSuccessModal}
        onClose={() => {
          setShowAddQuestionSuccessModal(false);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteQuestionConfirmModal
        showDeleteModal={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={closeAllModals}
      />

      {/* Question Added Success Modal */}
      <DeleteQuestionSuccessModal
        showDeleteQuestionSuccessModal={showDeleteQuestionSuccessModal}
        onClose={() => setShowDeleteQuestionSuccessModal(false)}
      />

      {/* Error Modal */}
      <ErrorModal
        showErrorModal={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={error}
      />
    </AnimatePresence>
  );
};

const QmsTrainingEvaluation = () => {
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [draftCount, setDraftCount] = useState(0);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  // Modal states
  const [evaluationModal, setEvaluationModal] = useState({
    isOpen: false,
    employee: null,
  });
  const [questionsModal, setQuestionsModal] = useState({ isOpen: false });

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [trainingEvaluationToDelete, setTrainingEvaluationToDelete] =
    useState(null);
  const [
    showDeleteTrainingEvaluationSuccessModal,
    setShowDeleteTrainingEvaluationSuccessModal,
  ] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

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
    const userRole = localStorage.getItem("role");

    if (userRole === "user") {
      const userId = localStorage.getItem("user_id");
      if (userId) return userId;
    }

    const companyId = localStorage.getItem("company_id");
    if (companyId) return companyId;

    return null;
  };

  // Fetch employee performance data
  useEffect(() => {
    const fetchPerformanceData = async () => {
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
        console.log("count......", draftResponse);

        setPerformances(response.data);
        setError(null);
      } catch (err) {
        let errorMsg = err.message;

        if (err.response) {
          // Check for field-specific errors first
          if (err.response.data.date) {
            errorMsg = err.response.data.date[0];
          }
          // Check for non-field errors
          else if (err.response.data.detail) {
            errorMsg = err.response.data.detail;
          } else if (err.response.data.message) {
            errorMsg = err.response.data.message;
          }
        } else if (err.message) {
          errorMsg = err.message;
        }

        setError(errorMsg);
        console.error("Error fetching training evaluation data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter performances based on search term
  const filteredPerformances = performances.filter((performance) =>
    performance.evaluation_title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Add new employee performance evaluation
  const handleAddEmployee = () => {
    navigate("/company/qms/add-training-evaluation");
  };

  // Go to drafts
  const handleDraftEmployeePerformance = () => {
    navigate("/company/qms/drafts-training-evaluation");
  };

  // View performance
  const handleView = (id) => {
    navigate(`/company/qms/views-training-evaluation/${id}`);
  };

  // Edit performance
  const handleEdit = (id) => {
    navigate(`/company/qms/edits-training-evaluation/${id}`);
  };

  const handleResultGraph = () => {
    navigate("/company/qms/training-evaluation-graph");
  };

  // Open delete confirmation modal
  const openDeleteModal = (performance) => {
    setTrainingEvaluationToDelete(performance);
    setShowDeleteModal(true);
  };

  const cancelDeleteTrainingEvaluation = () => {
    setShowDeleteModal(false);
    setTrainingEvaluationToDelete(null);
  };

  // Delete performance after confirmation
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/qms/training-evaluation/${trainingEvaluationToDelete.id}/update/`
      );
      setPerformances(
        performances.filter(
          (performance) => performance.id !== trainingEvaluationToDelete.id
        )
      );
      setShowDeleteModal(false);
      setShowDeleteTrainingEvaluationSuccessModal(true);
      setTimeout(() => {
        setShowDeleteTrainingEvaluationSuccessModal(false);
      }, 2000);
    } catch (err) {
      console.error("Error deleting performance evaluation:", err);
      let errorMsg = err.message;

      if (err.response) {
        // Check for field-specific errors first
        if (err.response.data.date) {
          errorMsg = err.response.data.date[0];
        }
        // Check for non-field errors
        else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
      setShowDeleteModal(false);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 2000);
    }
  };

  // Send email
  const handleSendEmail = async (performanceId) => {
    // try {
    //   await axios.post(
    //     `${BASE_URL}/qms/performance/send-email/${performanceId}/`
    //   );
    //   alert("Email sent successfully");
    // } catch (err) {
    //   console.error("Error sending email:", err);
    //   alert("Failed to send email");
    // }
  };

  // Open evaluation modal
  const openEvaluationModal = (performance) => {
    setEvaluationModal({
      isOpen: true,
      employee: performance,
      performanceId: performance.id,
    });
  };

  // Open questions modal
  const openQuestionsModal = (performanceId) => {
    setQuestionsModal({ isOpen: true, performanceId });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/(\d+)\/(\d+)\/(\d+)/, "$2-$1-$3");
  };

  // Pagination
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPerformances.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPerformances.length / itemsPerPage);

  if (loading) {
    return (
      <div className="bg-[#1C1C24] text-white p-5 rounded-lg flex justify-center">
        Loading...
      </div>
    );
  }

  // if (error) {
  //   return <div className="bg-[#1C1C24] text-white p-5 rounded-lg">Error: {error}</div>;
  // }

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      {/* Header and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center pb-5">
        <h1 className="employee-performance-head">List Training Evaluation</h1>

        <div className="flex w-full md:w-auto gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#1C1C24] text-white px-[10px] h-[42px] rounded-md w-[180px] border border-[#383840] outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="absolute right-[1px] top-[1px] text-white bg-[#24242D] p-[11px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center">
              <Search size={18} />
            </div>
          </div>

          <button
            className="flex items-center justify-center !w-[100px] add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleDraftEmployeePerformance}
          >
            <span>Draft</span>
            {draftCount > 0 && (
              <span className="bg-red-500 text-white rounded-full text-xs flex justify-center items-center w-[20px] h-[20px] absolute top-[114px] right-[242px]">
                {draftCount}
              </span>
            )}
          </button>

          <button
            className="flex items-center justify-center !px-[10px] add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleAddEmployee}
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#24242D]">
            <tr className="h-[48px]">
              <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
              <th className="px-2 text-left add-manual-theads">Title</th>
              <th className="px-2 text-left add-manual-theads">Valid Till</th>
              <th className="px-2 text-left add-manual-theads">Email</th>
              <th className="px-2 text-left add-manual-theads">Evaluation</th>
              <th className="px-2 text-left add-manual-theads">
                See Result Graph
              </th>
              <th className="px-2 text-left add-manual-theads">
                Add Questions
              </th>
              <th className="px-2 text-center add-manual-theads">View</th>
              <th className="px-2 text-center add-manual-theads">Edit</th>
              <th className="px-2 text-center add-manual-theads">Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((performance, index) => (
                <tr
                  key={performance.id}
                  className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
                >
                  <td className="pl-5 pr-2 add-manual-datas">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {performance.evaluation_title || "Anonymous"}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {formatDate(performance.valid_till)}
                  </td>
                  <td className="px-2 add-manual-datas">
                    <button
                      className="text-[#1E84AF]"
                      onClick={() => handleSendEmail(performance.id)}
                    >
                      Send Mail
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas">
                    <button
                      className="text-[#1E84AF] hover:text-[#176d8e] transition-colors"
                      onClick={() => openEvaluationModal(performance)}
                    >
                      Click to Evaluate
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas">
                    <button
                      className="text-[#1E84AF]"
                      onClick={handleResultGraph}
                    >
                      See Result Graph
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas">
                    <button
                      className="text-[#1E84AF] hover:text-[#176d8e] transition-colors"
                      onClick={() => openQuestionsModal(performance.id)}
                    >
                      Add Questions
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => handleView(performance.id)}>
                      <img
                        src={viewIcon}
                        alt="View Icon"
                        className="action-btn"
                      />
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => handleEdit(performance.id)}>
                      <img
                        src={editIcon}
                        alt="Edit Icon"
                        className="action-btn"
                      />
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => openDeleteModal(performance)}>
                      <img
                        src={deleteIcon}
                        alt="Delete Icon"
                        className="action-btn"
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4 not-found">
                  No employee performance evaluations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredPerformances.length > 0 && (
        <div className="flex justify-between items-center mt-3">
          <div className="text-white total-text">
            Total-{filteredPerformances.length}
          </div>
          <div className="flex items-center gap-5">
            <button
              className={`cursor-pointer swipe-text ${
                currentPage === 1 ? "opacity-50" : ""
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
              // Show pages around current page
              const pageToShow =
                currentPage <= 2
                  ? i + 1
                  : currentPage >= totalPages - 1
                  ? totalPages - 3 + i
                  : currentPage - 2 + i;

              if (pageToShow <= totalPages) {
                return (
                  <button
                    key={pageToShow}
                    className={`${
                      currentPage === pageToShow
                        ? "pagin-active"
                        : "pagin-inactive"
                    }`}
                    onClick={() => setCurrentPage(pageToShow)}
                  >
                    {pageToShow}
                  </button>
                );
              }
              return null;
            })}

            <button
              className={`cursor-pointer swipe-text ${
                currentPage === totalPages ? "opacity-50" : ""
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <EvaluationModal
        isOpen={evaluationModal.isOpen}
        onClose={() => setEvaluationModal({ isOpen: false, employee: null })}
        employee={evaluationModal.employee}
        employeeList={employees}
        performanceId={evaluationModal.performanceId}
      />

      <QuestionsModal
        isOpen={questionsModal.isOpen}
        onClose={() => setQuestionsModal({ isOpen: false })}
        performanceId={questionsModal.performanceId}
      />

      {/* Delete Confirmation Modal */}
      <DeleteTrainingEvaluationConfirmModal
        showDeleteModal={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDeleteTrainingEvaluation}
      />

      {/* Success Modal */}
      <DeleteTrainingEvaluationSuccessModal
        showDeleteTrainingEvaluationSuccessModal={
          showDeleteTrainingEvaluationSuccessModal
        }
        onClose={() => setShowDeleteTrainingEvaluationSuccessModal(false)}
      />

      {/* Error Modal */}
      <ErrorModal
        showErrorModal={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={error}
      />
    </div>
  );
};

export default QmsTrainingEvaluation;
