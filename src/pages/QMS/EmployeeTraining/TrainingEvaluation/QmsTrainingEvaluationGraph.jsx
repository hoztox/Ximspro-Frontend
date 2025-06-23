import React, { useState } from "react";
import print from "../../../../assets/images/Company Documentation/print.svg";
import QmsTrainingEvaluationChart from "./QmsTrainingEvaluationChart";
import { ChevronDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Expanded color palette
const colorPalette = [
  "#1E84AF",
  "#5EBB49",
  "#F9E4FB",
  "#CF3F34",
  "#FFC107",
  "#6D4C41",
  "#0288D1",
  "#7B1FA2",
  "#FF5722",
  "#4CAF50",
  "#E91E63",
  "#3F51B5",
  "#FF9800",
  "#009688",
  "#673AB7",
  "#8BC34A",
];

// Generate random color if palette runs out
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Assign colors to data
const assignColorsToData = (data) => {
  return data.map((entry, index) => ({
    ...entry,
    color: colorPalette[index] || generateRandomColor(),
  }));
};

// Sample training data with scores for each question
const trainingData = [
  { name: "Employee 1", scores: [4, 2, 2, 2] },
  { name: "Employee 2", scores: [2, 2, 2, 2] },
  { name: "Employee 3", scores: [2, 2, 2, 2] },
];

// Sample question data
const data = [
  { name: "Question 1", value: 8 },
  { name: "Question 2", value: 6 },
  { name: "Question 3", value: 6 },
  { name: "Question 4", value: 6 },
];

const QmsTrainingEvaluationGraph = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();

  const handleShowTable = () => {
    setShowTable(true);
  };

  // Assign colors to data
  const coloredData = assignColorsToData(data);

  // Calculate totals for each question from training scores
  const totals = data.map((_, index) =>
    trainingData.reduce((sum, employee) => sum + employee.scores[index], 0)
  );

  // Ensure data values match totals
  const updatedData = coloredData.map((entry, index) => ({
    ...entry,
    value: totals[index],
  }));

  // Calculate total sum of all question values
  const totalSum = totals.reduce((sum, total) => sum + total, 0);

  // Calculate percentages for each question
  const percentages = totals.map((total) =>
    totalSum > 0 ? ((total / totalSum) * 100).toFixed(0) : 0
  );

  const handleSelectToggle = () => {
    setIsSelectOpen(!isSelectOpen);
  };

  return (
    <div className="p-5 bg-[#1C1C24] text-white rounded-lg">
      <div className="flex justify-between border-b border-[#383840] pb-5">
        <h2 className="graph-head">Training Evaluation Graph</h2>
        <button className="border rounded-[4px] w-[46px] h-[42px] flex justify-center items-center">
          <img src={print} alt="Print" className="w-[18px] h-[18px]" />
        </button>
      </div>

      <div className="flex justify-between items-center pt-5 gap-5">
        <div className="relative">
          <select
            className="border border-[#1E84AF] bg-transparent px-[10px] pr-[30px] h-[42px] text-[#1E84AF] rounded graph-tabs appearance-none cursor-pointer truncate"
            onClick={handleSelectToggle}
            onBlur={() => setIsSelectOpen(false)}
            style={{ maxWidth: "300px" }}
          >
            <option>Select Training Evaluation</option>
          </select>
          <ChevronDown
            className={`absolute right-2 top-3 transform w-[16px] h-[16px] transition-transform duration-200 text-[#1E84AF] ${
              isSelectOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        <div className="flex gap-5">
          <button
            className="border border-white px-[10px] w-auto h-[42px] rounded graph-tabs flex items-center gap-2 whitespace-nowrap duration-200 hover:bg-white hover:text-[#1C1C24]"
            onClick={() => navigate("/company/qms/add-training-evaluation")}
          >
            Add Training Evaluation <Plus size={18} />
          </button>
          <button
            className="border border-white px-[10px] w-auto h-[42px] rounded graph-tabs whitespace-nowrap duration-200 hover:bg-white hover:text-[#1C1C24]"
            onClick={() => navigate("/company/qms/training-evaluation")}
          >
            List Training Evaluation
          </button>
          {!showTable && (
            <button
              className="border border-white px-[10px] w-auto h-[42px] rounded graph-tabs whitespace-nowrap duration-200 hover:bg-white hover:text-[#1C1C24]"
              onClick={handleShowTable}
            >
              Click To See Evaluation In Detail
            </button>
          )}
        </div>
      </div>

      {showTable && (
        <div>
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="bg-[#24242D] text-[#AAAAAA] h-[48px]">
                <th className="text-start graph-tabs px-5">Employee Name</th>
                {updatedData.map((question, index) => (
                  <th
                    key={index}
                    className="text-center graph-tabs px-5"
                    style={{ color: question.color }}
                  >
                    {question.name}
                  </th>
                ))}
                <th className="text-end graph-tabs px-5">Total</th>
              </tr>
            </thead>
            <tbody>
              {trainingData.map((employee, empIndex) => (
                <tr
                  key={empIndex}
                  className="text-white border-b border-[#383840] h-[54px]"
                >
                  <td className="text-start px-5 graph-tabs text-[#AAAAAA]">
                    {employee.name}
                  </td>
                  {employee.scores.map((score, scoreIndex) => (
                    <td
                      key={scoreIndex}
                      className="text-center graph-tabs"
                      style={{ color: updatedData[scoreIndex].color }}
                    >
                      {score}
                    </td>
                  ))}
                  <td className="text-end graph-tabs text-[#AAAAAA] pr-5">
                    {employee.scores.reduce((sum, score) => sum + score, 0)}
                  </td>
                </tr>
              ))}
              <tr className="text-white border-b border-[#383840] h-[54px]">
                <td className="text-start px-5 graph-tabs">Total</td>
                {totals.map((total, index) => (
                  <td
                    key={index}
                    className="text-center graph-tabs"
                    style={{ color: updatedData[index].color }}
                  >
                    {total}
                  </td>
                ))}
                <td className="text-end graph-tabs text-[#AAAAAA] pr-5">
                  {totals.reduce((sum, total) => sum + total, 0)}
                </td>
              </tr>
              <tr className="text-white border-b border-[#383840] h-[54px]">
                <td className="text-start px-5 graph-tabs">Percentage</td>
                {percentages.map((percentage, index) => (
                  <td
                    key={index}
                    className="text-center graph-tabs"
                    style={{ color: updatedData[index].color }}
                  >
                    {percentage}%
                  </td>
                ))}
                <td className="text-right graph-tabs text-[#AAAAAA] pr-5">
                  {percentages
                    .reduce(
                      (sum, percentage) => sum + parseFloat(percentage),
                      0
                    )
                    .toFixed(0)}
                  %
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-[#24242D] flex justify-center items-center rounded-lg h-[470px]">
          <QmsTrainingEvaluationChart
            data={updatedData}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
        </div>

        <div className="max-h-[470px] overflow-y-scroll">
          <div className="flex justify-between items-center bg-[#24242D] px-5 py-[15px] rounded">
            <span className="text-[#AAAAAA] graph-tabs">Question</span>
            <span className="text-[#AAAAAA] graph-tabs">Poll</span>
          </div>
          {updatedData.map((entry, index) => (
            <div
              key={index}
              className={`flex justify-between px-5 py-[18px] transition duration-200 border-b border-[#383840] cursor-pointer ${
                hoveredIndex === index ? "bg-[#17171c]" : ""
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="graph-tabs" style={{ color: entry.color }}>
                {entry.name}
              </span>
              <span className="graph-tabs" style={{ color: entry.color }}>
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QmsTrainingEvaluationGraph;
