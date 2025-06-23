// QmsEmployeePerformanceChart.jsx
import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";

const renderCustomizedLabel = () => null;

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    midAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);

  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 40) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 30;
  const ey = my;

  const textAnchor = cos >= 0 ? "start" : "end";
  const textOffsetX = textAnchor === "start" ? 9 : -9;

  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const fadeInStyle = {
    opacity: visible ? 1 : 0,
    transition: "opacity 0.3s ease, transform 0.3s ease",
    transform: visible ? "translateX(0px)" : `translateX(${cos * 10}px)`,
  };

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke="#fff"
        fill="none"
      />
      <circle cx={ex} cy={ey} r={3} fill="#fff" stroke={fill} strokeWidth={2} />
      <text
        x={ex + textOffsetX}
        y={ey - 0}
        textAnchor={textAnchor}
        fill="#fff"
        fontSize={25}
        fontFamily="Switzer Light"
        style={fadeInStyle}
      >
        {(percent * 100).toFixed(0)}%
      </text>
      <text
        x={ex + textOffsetX}
        y={ey + 20}
        textAnchor={textAnchor}
        fill="#ccc"
        fontSize={12}
        fontFamily="Switzer Light"
        style={fadeInStyle}
      >
        {payload.name}: {value}
      </text>
    </g>
  );
};

const QmsEmployeeSatisfactionChart = ({ data, hoveredIndex, setHoveredIndex }) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <ResponsiveContainer width="100%">
      <PieChart>
        <defs>
          {data.map((entry, index) => (
            <radialGradient
              key={`grad-${index}`}
              id={`grad-${index}`}
              cx="50%"
              cy="50%"
              r="100%"
              fx="50%"
              fy="50%"
            >
              <stop offset="30%" stopColor={entry.color} />
              <stop offset="100%" stopColor={entry.color} stopOpacity={0.2} />
            </radialGradient>
          ))}
        </defs>
        <Pie
          data={data.map((d) => ({ ...d, total }))}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={130}
          dataKey="value"
          paddingAngle={5}
          cornerRadius={10}
          stroke="none"
          activeIndex={hoveredIndex} // Use hoveredIndex directly
          activeShape={renderActiveShape}
          onMouseEnter={(_, index) => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`url(#grad-${index})`} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default QmsEmployeeSatisfactionChart
