import React, { useState } from "react";
import print from "../../../../assets/images/Company Documentation/print.svg";
import { ChevronDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QmsEmployeeSatisfactionChart from "./QmsEmployeeSatisfactionChart";

// Expanded color palette for more questions
const colorPalette = [
  "#1E84AF", // Blue
  "#5EBB49", // Green
  "#F9E4FB", // Light Pink
  "#CF3F34", // Red
  "#FFC107", // Amber
  "#6D4C41", // Brown
  "#0288D1", // Light Blue
  "#7B1FA2", // Purple
  "#FF5722", // Deep Orange
  "#4CAF50", // Light Green
  "#E91E63", // Pink
  "#3F51B5", // Indigo
  "#FF9800", // Orange
  "#009688", // Teal
  "#673AB7", // Deep Purple
  "#8BC34A", // Lime
];

// Function to generate a random color if palette runs out
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Function to assign colors to data
const assignColorsToData = (data) => {
  return data.map((entry, index) => ({
    ...entry,
    color: colorPalette[index] || generateRandomColor(),
  }));
};

// Sample employee data with scores for each question
const employeeData = [
  { name: "Employee 1", scores: [4, 4, 4, 4] },
  { name: "Employee 2", scores: [2, 2, 2, 2] },
  { name: "Employee 3", scores: [2, 2, 2, 2] },
];

// Sample question data with poll values matching total scores
const data = [
  { name: "Question 1", value: 8 },
  { name: "Question 2", value: 8 },
  { name: "Question 3", value: 8 },
  { name: "Question 4", value: 8 },
];

const QmsEmployeeSatisfactionGraph = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();

  const handleShowTable = () => {
    setShowTable(true);
  };

  // Assign colors to data
  const coloredData = assignColorsToData(data);

  // Calculate totals for each question from employee scores
  const totals = data.map((_, index) =>
    employeeData.reduce((sum, employee) => sum + employee.scores[index], 0)
  );

  // Ensure data values match totals
  const updatedData = coloredData.map((entry, index) => ({
    ...entry,
    value: totals[index],
  }));

  // Calculate total sum of all question values
  const totalSum = totals.reduce((sum, total) => sum + total, 0);

  // Calculate percentages for each question (same as chart: value / totalSum * 100)
  const percentages = totals.map((total) =>
    totalSum > 0 ? ((total / totalSum) * 100).toFixed(0) : 0
  );

  const handleSelectToggle = () => {
    setIsSelectOpen(!isSelectOpen);
  };

  return (
    <div className="p-5 bg-[#1C1C24] text-white rounded-lg">
      <div className="flex justify-between border-b border-[#383840] pb-5">
        <h2 className="graph-head">Employee Satisfaction Survey Graph</h2>
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
            <option>Select Employee Satisfaction Survey</option>
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
            onClick={() => navigate("/company/qms/add-satisfaction-survey")}
          >
            Add Employee Satisfaction Survey <Plus size={18} />
          </button>
          <button
            className="border border-white px-[10px] w-auto h-[42px] rounded graph-tabs whitespace-nowrap duration-200 hover:bg-white hover:text-[#1C1C24]"
            onClick={() => navigate("/company/qms/list-satisfaction-survey")}
          >
            List Employee Satisfaction Survey
          </button>
          {!showTable && (
            <button
              className="border border-white px-[10px] w-auto h-[42px] rounded graph-tabs whitespace-nowrap duration-200 hover:bg-white hover:text-[#1C1C24]"
              onClick={handleShowTable}
            >
              Click To see Survey in Detail
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
              {employeeData.map((employee, empIndex) => (
                <tr
                  key={empIndex}
                  className="text-white border-b border-[#383840] h-[54px] "
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
          <QmsEmployeeSatisfactionChart
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

export default QmsEmployeeSatisfactionGraph;
