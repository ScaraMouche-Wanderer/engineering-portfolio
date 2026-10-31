"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, CheckCircle2, Clock, Sparkles, 
  BarChart3, LineChart, Calculator 
} from "lucide-react";


// ============================================================================
// 📊 B.TECH 8-SEMESTER SGPA CONFIGURATION (EASY TO EDIT IN FUTURE)
// Public demo: synthetic sample values, not an academic record.
// For upcoming semesters, set sgpa to null or a target number.
// ============================================================================
export interface SemesterRecord {
  semester: number;
  label: string;
  sgpa: number | null; // synthetic sample value, or null for upcoming
  status: "completed" | "ongoing" | "upcoming";
  academicYear: string;
  credits?: number;
  highlights?: string[];
}

export const BTECH_SEMESTER_GRADES: SemesterRecord[] = [
  {
    semester: 1,
    label: "Sem 1",
    sgpa: 7.5,
    status: "completed",
    academicYear: "2024 (Odd)",
    credits: 20,
    highlights: ["Engineering Physics", "Basic Electrical", "Engineering Math I", "Engineering Workshop"]
  },
  {
    semester: 2,
    label: "Sem 2",
    sgpa: 8.0,
    status: "completed",
    academicYear: "2025 (Even)",
    credits: 20,
    highlights: ["Engineering Chemistry", "Basic Electronics", "Programming in C", "Engineering Drawing"]
  },
  {
    semester: 3,
    label: "Sem 3",
    sgpa: 8.5,
    status: "completed",
    academicYear: "2025 (Odd)",
    credits: 22,
    highlights: ["Signals & Systems", "Digital Electronics", "Data Structures & C++", "Network Theory"]
  },
  {
    semester: 4,
    label: "Sem 4",
    sgpa: null, // <-- Edit here when Sem 4 results are published
    status: "ongoing",
    academicYear: "2026 (Even)",
    credits: 22,
    highlights: ["Microprocessors & Microcontrollers", "Analog Circuits", "Electromagnetic Fields", "Python Lab"]
  },
  {
    semester: 5,
    label: "Sem 5",
    sgpa: null, // <-- Edit here when Sem 5 results are published
    status: "upcoming",
    academicYear: "2026 (Odd)",
    credits: 22,
    highlights: ["Digital Signal Processing", "Control Systems", "VLSI Design", "Linear Integrated Circuits"]
  },
  {
    semester: 6,
    label: "Sem 6",
    sgpa: null, // <-- Edit here when Sem 6 results are published
    status: "upcoming",
    academicYear: "2027 (Even)",
    credits: 22,
    highlights: ["Embedded System Design", "Antenna & Wave Propagation", "IoT Protocols", "RTOS Applications"]
  },
  {
    semester: 7,
    label: "Sem 7",
    sgpa: null, // <-- Edit here when Sem 7 results are published
    status: "upcoming",
    academicYear: "2027 (Odd)",
    credits: 20,
    highlights: ["Wireless Sensor Networks", "Major Project Phase I", "Machine Learning in DSP", "Fiber Optics"]
  },
  {
    semester: 8,
    label: "Sem 8",
    sgpa: null, // <-- Edit here when Sem 8 results are published
    status: "upcoming",
    academicYear: "2028 (Even)",
    credits: 18,
    highlights: ["Industrial Smelting Internship", "Major Project Phase II", "System Architecture Defense"]
  }
];

export default function SGPAGraph({ isCompact = false }: { isCompact?: boolean }) {
  const [viewMode, setViewMode] = useState<"curve" | "bars" | "predictor">("curve");
  const [hoveredSem, setHoveredSem] = useState<SemesterRecord | null>(null);
  const [selectedSemCard, setSelectedSemCard] = useState<number | null>(3);
  
  // Interactive Target Predictor State for Sem 4 target
  const [predictedSem4, setPredictedSem4] = useState<number>(9.2);

  // Compute live statistics
  const completedSemesters = BTECH_SEMESTER_GRADES.filter((s) => s.sgpa !== null && s.sgpa > 0);
  const totalCompleted = completedSemesters.length;
  const sumSgpa = completedSemesters.reduce((acc, curr) => acc + (curr.sgpa || 0), 0);
  const currentCGPA = totalCompleted > 0 ? (sumSgpa / totalCompleted).toFixed(2) : "N/A";
  const peakSGPA = totalCompleted > 0 ? Math.max(...completedSemesters.map((s) => s.sgpa || 0)).toFixed(2) : "N/A";
  const latestSGPA = completedSemesters[completedSemesters.length - 1]?.sgpa?.toFixed(2) || "N/A";

  // Predicted CGPA calculation
  const predictedTotalCompleted = totalCompleted + 1;
  const predictedSumSgpa = sumSgpa + predictedSem4;
  const predictedCGPA = (predictedSumSgpa / predictedTotalCompleted).toFixed(2);
  const cgpaDelta = (Number(predictedCGPA) - Number(currentCGPA)).toFixed(2);

  // SVG Chart Geometry Constants
  const width = 840;
  const height = 250;
  const paddingX = 55;
  const paddingTop = 38;
  const paddingBottom = 48;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  // Scale (Min: 6.0, Max: 10.0)
  const minVal = 6.0;
  const maxVal = 10.0;
  const getY = (val: number) => paddingTop + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
  const getX = (index: number) => paddingX + (index / (BTECH_SEMESTER_GRADES.length - 1)) * chartWidth;

  // Compute SVG Points for Completed Path
  const completedPoints = completedSemesters.map((s, idx) => ({
    x: getX(idx),
    y: getY(s.sgpa!),
    record: s
  }));

  const completedPathString = completedPoints.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, "");

  // Area under curve fill path
  const areaPathString = completedPoints.length > 0
    ? `${completedPathString} L ${completedPoints[completedPoints.length - 1].x},${paddingTop + chartHeight} L ${completedPoints[0].x},${paddingTop + chartHeight} Z`
    : "";

  return (
    <div 
      className="sgpa-graph-container"
      style={{
        background: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: "1.25rem",
        padding: isCompact ? "1.5rem" : "2.25rem",
        boxShadow: "var(--shadow)",
        backdropFilter: "blur(16px)",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        fontFamily: "var(--font-sans, sans-serif)"
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Dynamic Background Aura */}
      <div 
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "320px",
          height: "320px",
          background: "radial-gradient(circle, rgba(88, 196, 182, 0.14) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      <div 
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-10%",
          width: "280px",
          height: "280px",
          background: "radial-gradient(circle, rgba(127, 186, 114, 0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.25rem", marginBottom: "1.75rem", position: "relative", zIndex: 1 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
            <TrendingUp size={18} color="var(--cyan)" />
            <span style={{ 
              color: "var(--cyan)", 
              fontFamily: "var(--font-mono, monospace)", 
              fontSize: "0.8rem", 
              letterSpacing: "2px", 
              fontWeight: 700, 
              textTransform: "uppercase" 
            }}>
              Sample Academic Trajectory &bull; B.Tech ECE (2024 - 2028)
            </span>
          </div>
          <h3 style={{ 
            fontSize: "1.55rem", 
            color: "var(--foreground)", 
            margin: "0 0 0.4rem 0", 
            fontWeight: 700,
            letterSpacing: "-0.01em"
          }}>
            Semester Grade Performance (SGPA)
          </h3>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.94rem", lineHeight: 1.5 }}>
            Progression across 8 semesters with latest <strong style={{ color: "var(--lime)" }}>{latestSGPA} SGPA</strong> (Sem 3) and cumulative <strong style={{ color: "var(--cyan)" }}>{currentCGPA} CGPA</strong>.
          </p>
        </div>

        {/* View Mode Switcher Pills */}
        <div style={{
          display: "flex",
          background: "rgba(0, 0, 0, 0.25)",
          border: "1px solid var(--line)",
          padding: "0.3rem",
          borderRadius: "0.75rem",
          gap: "0.3rem"
        }}>
          <button
            onClick={() => setViewMode("curve")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.45rem 0.85rem",
              borderRadius: "0.5rem",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: "none",
              background: viewMode === "curve" ? "var(--cyan)" : "transparent",
              color: viewMode === "curve" ? "#0c1014" : "var(--muted)"
            }}
          >
            <LineChart size={14} /> Trajectory Curve
          </button>
          <button
            onClick={() => setViewMode("bars")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.45rem 0.85rem",
              borderRadius: "0.5rem",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: "none",
              background: viewMode === "bars" ? "var(--cyan)" : "transparent",
              color: viewMode === "bars" ? "#0c1014" : "var(--muted)"
            }}
          >
            <BarChart3 size={14} /> Metric Bars
          </button>
          <button
            onClick={() => setViewMode("predictor")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.45rem 0.85rem",
              borderRadius: "0.5rem",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: "none",
              background: viewMode === "predictor" ? "var(--lime)" : "transparent",
              color: viewMode === "predictor" ? "#0c1014" : "var(--muted)"
            }}
          >
            <Calculator size={14} /> CGPA Predictor
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.85rem", marginBottom: "1.75rem", position: "relative", zIndex: 1 }}>
        <div style={{
          background: "rgba(88, 196, 182, 0.08)",
          border: "1px solid rgba(88, 196, 182, 0.3)",
          padding: "0.75rem 1rem",
          borderRadius: "0.85rem",
          display: "flex",
          flexDirection: "column"
        }}>
          <span style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-mono, monospace)" }}>Cumulative CGPA</span>
          <span style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--cyan)" }}>{currentCGPA} <small style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 400 }}>/ 10</small></span>
        </div>

        <div style={{
          background: "rgba(127, 186, 114, 0.08)",
          border: "1px solid rgba(127, 186, 114, 0.3)",
          padding: "0.75rem 1rem",
          borderRadius: "0.85rem",
          display: "flex",
          flexDirection: "column"
        }}>
          <span style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-mono, monospace)" }}>Peak SGPA (Sem 3)</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--lime)" }}>{peakSGPA}</span>
            <Sparkles size={14} color="var(--lime)" />
          </div>
        </div>

        <div style={{
          background: "rgba(212, 165, 116, 0.08)",
          border: "1px solid rgba(212, 165, 116, 0.3)",
          padding: "0.75rem 1rem",
          borderRadius: "0.85rem",
          display: "flex",
          flexDirection: "column"
        }}>
          <span style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-mono, monospace)" }}>Semesters Done</span>
          <span style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--amber)" }}>{totalCompleted} / 8</span>
        </div>

        <div style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid var(--line)",
          padding: "0.75rem 1rem",
          borderRadius: "0.85rem",
          display: "flex",
          flexDirection: "column"
        }}>
          <span style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-mono, monospace)" }}>Recent Jump</span>
          <span style={{ fontSize: "1.45rem", fontWeight: 800, color: "#38bdf8" }}>+1.55 <small style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 400 }}>in Sem 3</small></span>
        </div>
      </div>

      {/* VIEW MODE 1: TRAJECTORY CURVE (SVG) */}
      {viewMode === "curve" && (
        <div style={{ width: "100%", overflowX: "auto", position: "relative", zIndex: 1, paddingBottom: "0.5rem" }}>
          <div style={{ minWidth: "620px", position: "relative" }}>
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              style={{ width: "100%", height: "auto", display: "block" }}
            >
              <defs>
                <linearGradient id="sgpaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--cyan)" />
                  <stop offset="60%" stopColor="var(--lime)" />
                  <stop offset="100%" stopColor="var(--lime)" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Horizontal Gridlines & Y-Axis Labels */}
              {[6.0, 7.0, 8.0, 9.0, 10.0].map((val) => {
                const y = getY(val);
                return (
                  <g key={val}>
                    <line 
                      x1={paddingX - 10} 
                      y1={y} 
                      x2={width - paddingX + 10} 
                      y2={y} 
                      stroke="var(--line)" 
                      strokeDasharray={val === 10.0 ? "none" : "4 4"} 
                      strokeWidth={val === 10.0 ? "1.5" : "1"}
                    />
                    <text 
                      x={paddingX - 18} 
                      y={y + 4} 
                      fill="var(--muted)" 
                      fontSize="11" 
                      fontFamily="var(--font-mono, monospace)" 
                      textAnchor="end"
                      fontWeight="600"
                    >
                      {val.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Target 10.0 Reference Line Banner */}
              <text 
                x={width - paddingX} 
                y={getY(10.0) - 8} 
                fill="var(--muted)" 
                fontSize="9" 
                fontFamily="var(--font-mono, monospace)" 
                textAnchor="end"
                letterSpacing="1px"
              >
                MAX SCALE: 10.0 SGPA
              </text>

              {/* Area Under Curve Fill */}
              {areaPathString && (
                <path 
                  d={areaPathString} 
                  fill="url(#sgpaGradient)" 
                />
              )}

              {/* Projected Future Path */}
              {completedPoints.length > 0 && completedPoints.length < BTECH_SEMESTER_GRADES.length && (
                <line 
                  x1={completedPoints[completedPoints.length - 1].x} 
                  y1={completedPoints[completedPoints.length - 1].y} 
                  x2={getX(completedPoints.length)} 
                  y2={getY(8.8)} 
                  stroke="var(--cyan)" 
                  strokeDasharray="6 6" 
                  strokeWidth="2" 
                  strokeOpacity="0.4"
                />
              )}

              {/* Completed Trajectory Line */}
              {completedPathString && (
                <path 
                  d={completedPathString} 
                  fill="none" 
                  stroke="url(#lineGrad)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  filter="url(#glow)"
                />
              )}

              {/* Semester Nodes (All 8 Semesters) */}
              {BTECH_SEMESTER_GRADES.map((sem, idx) => {
                const x = getX(idx);
                const isDone = sem.sgpa !== null;
                const y = isDone ? getY(sem.sgpa!) : paddingTop + chartHeight;
                const isSelected = hoveredSem?.semester === sem.semester;

                return (
                  <g 
                    key={sem.semester} 
                    style={{ cursor: "pointer" }} 
                    onMouseEnter={() => setHoveredSem(sem)} 
                    onMouseLeave={() => setHoveredSem(null)}
                    onClick={() => setSelectedSemCard(sem.semester)}
                  >
                    {/* Vertical Guide Line */}
                    <line 
                      x1={x} 
                      y1={paddingTop} 
                      x2={x} 
                      y2={paddingTop + chartHeight} 
                      stroke={isSelected ? "var(--cyan)" : "var(--line)"} 
                      strokeWidth={isSelected ? "1.5" : "1"} 
                      strokeDasharray={isSelected ? "none" : "2 4"}
                      strokeOpacity={isSelected ? 0.8 : 0.4}
                    />

                    {/* Node Point */}
                    {isDone ? (
                      <>
                        {/* Pulse Ring for Peak */}
                        {sem.sgpa === 8.5 && (
                          <circle 
                            cx={x} 
                            cy={y} 
                            r={isSelected ? "14" : "10"} 
                            fill="none" 
                            stroke="var(--lime)" 
                            strokeWidth="2" 
                            opacity="0.4" 
                            className="animate-ping"
                            style={{ transformOrigin: `${x}px ${y}px`, animationDuration: "2s" }}
                          />
                        )}
                        
                        {/* Outer Glow */}
                        <circle 
                          cx={x} 
                          cy={y} 
                          r={isSelected ? "8" : "6"} 
                          fill={sem.sgpa && sem.sgpa > 9.0 ? "var(--lime)" : "var(--cyan)"} 
                          filter="url(#glow)"
                        />

                        {/* Inner Dot */}
                        <circle 
                          cx={x} 
                          cy={y} 
                          r="3.5" 
                          fill="#0c1014" 
                          stroke={sem.sgpa && sem.sgpa > 9.0 ? "var(--lime)" : "var(--cyan)"} 
                          strokeWidth="2"
                        />

                        {/* SGPA Value Badge directly above point */}
                        <g transform={`translate(${x}, ${y - 14})`}>
                          <rect 
                            x="-22" 
                            y="-16" 
                            width="44" 
                            height="18" 
                            rx="9" 
                            fill={sem.sgpa && sem.sgpa > 9.0 ? "rgba(127, 186, 114, 0.25)" : "rgba(88, 196, 182, 0.25)"} 
                            stroke={sem.sgpa && sem.sgpa > 9.0 ? "var(--lime)" : "var(--cyan)"} 
                            strokeWidth="1"
                          />
                          <text 
                            x="0" 
                            y="-3.5" 
                            fill="var(--foreground)" 
                            fontSize="11" 
                            fontWeight="700" 
                            fontFamily="var(--font-mono, monospace)" 
                            textAnchor="middle"
                          >
                            {sem.sgpa?.toFixed(2)}
                          </text>
                        </g>
                      </>
                    ) : (
                      /* Future Semester Placeholder Node */
                      <>
                        <circle 
                          cx={x} 
                          cy={paddingTop + chartHeight / 2} 
                          r={isSelected ? "6" : "4.5"} 
                          fill="transparent" 
                          stroke="var(--muted)" 
                          strokeDasharray="2 2"
                          strokeWidth="1.5"
                        />
                        <text 
                          x={x} 
                          y={paddingTop + chartHeight / 2 - 10} 
                          fill="var(--muted)" 
                          fontSize="9" 
                          fontFamily="var(--font-mono, monospace)" 
                          textAnchor="middle"
                          opacity="0.6"
                        >
                          TBD
                        </text>
                      </>
                    )}

                    {/* X-Axis Semester Label */}
                    <text 
                      x={x} 
                      y={paddingTop + chartHeight + 24} 
                      fill={isDone ? "var(--foreground)" : "var(--muted)"} 
                      fontSize="12" 
                      fontWeight={isDone ? "700" : "500"} 
                      fontFamily="var(--font-mono, monospace)" 
                      textAnchor="middle"
                    >
                      {sem.label}
                    </text>

                    {/* Status Indicator under label */}
                    <text 
                      x={x} 
                      y={paddingTop + chartHeight + 36} 
                      fill={isDone ? "var(--cyan)" : sem.status === "ongoing" ? "var(--amber)" : "var(--muted)"} 
                      fontSize="8.5" 
                      letterSpacing="0.5px"
                      style={{ textTransform: "uppercase" }}
                      fontFamily="var(--font-mono, monospace)" 
                      textAnchor="middle"
                      opacity={isDone ? 0.9 : 0.5}
                    >
                      {isDone ? "GRADED" : sem.status === "ongoing" ? "IN PROGRESS" : "UPCOMING"}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Floating Hover Tooltip HUD */}
            <AnimatePresence>
              {hoveredSem && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--panel-strong)",
                    border: "1px solid var(--cyan)",
                    borderRadius: "0.75rem",
                    padding: "0.75rem 1.25rem",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.5), 0 0 15px rgba(88,196,182,0.15)",
                    zIndex: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    pointerEvents: "none"
                  }}
                >
                  <div style={{ borderRight: "1px solid var(--line)", paddingRight: "1rem" }}>
                    <div style={{ fontSize: "0.85rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-mono, monospace)", fontWeight: 600 }}>
                      {hoveredSem.academicYear}
                    </div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--foreground)" }}>
                      Semester {hoveredSem.semester}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.82rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>
                      Status / Score
                    </span>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: hoveredSem.sgpa ? (hoveredSem.sgpa > 9.0 ? "var(--lime)" : "var(--cyan)") : "var(--amber)" }}>
                      {hoveredSem.sgpa ? `${hoveredSem.sgpa.toFixed(2)} SGPA` : "In Progress / Upcoming"}
                    </div>
                  </div>

                  {hoveredSem.highlights && hoveredSem.highlights.length > 0 && (
                    <div style={{ borderLeft: "1px solid var(--line)", paddingLeft: "1rem", maxWidth: "260px" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--cyan)", textTransform: "uppercase", letterSpacing: "1px", display: "block", fontWeight: 700 }}>
                        Key Subjects
                      </span>
                      <span style={{ fontSize: "0.88rem", color: "var(--foreground)", fontWeight: 600, lineHeight: 1.4 }}>
                        {hoveredSem.highlights.join(", ")}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: METRIC BARS */}
      {viewMode === "bars" && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(8, 1fr)", 
          gap: "0.75rem", 
          height: "220px", 
          alignItems: "flex-end",
          padding: "1rem 0",
          position: "relative",
          zIndex: 1
        }}>
          {BTECH_SEMESTER_GRADES.map((sem) => {
            const isDone = sem.sgpa !== null;
            const heightPercent = isDone ? ((sem.sgpa! - 5.0) / 5.0) * 100 : 25;

            return (
              <div 
                key={sem.semester} 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  height: "100%", 
                  justifyContent: "flex-end",
                  cursor: "pointer"
                }}
                onClick={() => setSelectedSemCard(sem.semester)}
              >
                {isDone && (
                  <span style={{ 
                    fontSize: "0.92rem", 
                    fontWeight: 800, 
                    color: sem.sgpa! > 9.0 ? "var(--lime)" : "var(--cyan)", 
                    fontFamily: "var(--font-mono, monospace)",
                    marginBottom: "0.4rem"
                  }}>
                    {sem.sgpa?.toFixed(2)}
                  </span>
                )}
                
                <div style={{
                  width: "100%",
                  height: `${Math.max(15, heightPercent)}%`,
                  background: isDone 
                    ? (sem.sgpa! > 9.0 ? "linear-gradient(180deg, var(--lime), rgba(74, 222, 128, 0.2))" : "linear-gradient(180deg, var(--cyan), rgba(56, 189, 248, 0.2))")
                    : "rgba(255, 255, 255, 0.05)",
                  border: isDone 
                    ? (sem.sgpa! > 9.0 ? "1px solid var(--lime)" : "1px solid var(--cyan)") 
                    : "1px dashed var(--line)",
                  borderRadius: "0.5rem 0.5rem 0.2rem 0.2rem",
                  transition: "all 0.3s ease",
                  boxShadow: isDone ? "0 4px 15px rgba(0,0,0,0.2)" : "none"
                }} />

                <span style={{ 
                  fontSize: "0.88rem", 
                  fontWeight: 700, 
                  color: isDone ? "var(--foreground)" : "var(--muted)", 
                  fontFamily: "var(--font-mono, monospace)",
                  marginTop: "0.6rem"
                }}>
                  {sem.label}
                </span>
                <span style={{ 
                  fontSize: "0.78rem", 
                  color: isDone ? "var(--cyan)" : "var(--muted)", 
                  fontFamily: "var(--font-mono, monospace)",
                  fontWeight: 600
                }}>
                  {isDone ? `${sem.credits} Cr` : "TBD"}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 3: INTERACTIVE CGPA PREDICTOR */}
      {viewMode === "predictor" && (
        <div style={{ 
          background: "rgba(0, 0, 0, 0.3)", 
          border: "1px solid var(--line)", 
          borderRadius: "1rem", 
          padding: "1.5rem",
          position: "relative",
          zIndex: 1
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <h4 style={{ fontSize: "1.1rem", color: "var(--foreground)", margin: "0 0 0.25rem 0", fontWeight: 700 }}>
                🔮 Target SGPA Simulator (Semester 4 Prediction)
              </h4>
              <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.88rem" }}>
                Drag the target slider to calculate your projected cumulative CGPA.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>Projected CGPA</span>
                <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--lime)", fontFamily: "var(--font-mono, monospace)" }}>
                  {predictedCGPA} <small style={{ fontSize: "0.85rem", color: Number(cgpaDelta) >= 0 ? "var(--lime)" : "var(--orange)" }}>({Number(cgpaDelta) >= 0 ? `+${cgpaDelta}` : cgpaDelta})</small>
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "240px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--foreground)", fontWeight: 600 }}>Simulate Sem 4 SGPA Target:</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--cyan)", fontFamily: "var(--font-mono, monospace)" }}>
                  {predictedSem4.toFixed(2)} SGPA
                </span>
              </div>
              <input 
                type="range" 
                min="7.0" 
                max="10.0" 
                step="0.05" 
                value={predictedSem4}
                onChange={(e) => setPredictedSem4(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "var(--cyan)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.3rem", fontFamily: "var(--font-mono, monospace)" }}>
                <span>7.00 SGPA</span>
                <span>8.50 SGPA</span>
                <span>10.00 SGPA</span>
              </div>
            </div>

            <div style={{ 
              background: "rgba(127, 186, 114, 0.08)", 
              border: "1px solid rgba(127, 186, 114, 0.3)", 
              padding: "0.85rem 1.25rem", 
              borderRadius: "0.75rem",
              maxWidth: "280px"
            }}>
              <span style={{ fontSize: "0.75rem", color: "var(--lime)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "0.2rem" }}>
                Trajectory Outcome
              </span>
              <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--foreground)", lineHeight: 1.4 }}>
                Scoring <strong style={{ color: "var(--lime)" }}>{predictedSem4.toFixed(2)}</strong> in Sem 4 will boost your overall B.Tech CGPA from <strong>{currentCGPA}</strong> to <strong style={{ color: "var(--lime)" }}>{predictedCGPA}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 8-Semester Detailed Grid Cards */}
      <div style={{ marginTop: "2rem", borderTop: "1px solid var(--line)", paddingTop: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--foreground)", letterSpacing: "0.5px" }}>
            All 8 Semesters Breakdown &bull; Click to Inspect
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "var(--font-mono, monospace)" }}>
            Easily editable in <code style={{ color: "var(--cyan)" }}>components/SGPAGraph.tsx</code>
          </span>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", 
          gap: "0.75rem" 
        }}>
          {BTECH_SEMESTER_GRADES.map((sem) => {
            const isCompleted = sem.status === "completed";
            const isOngoing = sem.status === "ongoing";
            const isSelected = selectedSemCard === sem.semester;

            return (
              <div 
                key={sem.semester}
                onClick={() => setSelectedSemCard(sem.semester)}
                style={{
                  background: isSelected
                    ? "rgba(88, 196, 182, 0.12)"
                    : isCompleted 
                    ? (sem.sgpa && sem.sgpa > 9.0 ? "rgba(127, 186, 114, 0.06)" : "rgba(88, 196, 182, 0.04)") 
                    : isOngoing ? "rgba(212, 165, 116, 0.05)" : "rgba(255, 255, 255, 0.01)",
                  border: isSelected
                    ? "1px solid var(--cyan)"
                    : isCompleted 
                    ? (sem.sgpa && sem.sgpa > 9.0 ? "1px solid rgba(127, 186, 114, 0.4)" : "1px solid rgba(88, 196, 182, 0.3)") 
                    : isOngoing ? "1px dashed rgba(212, 165, 116, 0.4)" : "1px solid var(--line)",
                  borderRadius: "0.85rem",
                  padding: "0.85rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  transform: isSelected ? "translateY(-2px)" : "none",
                  boxShadow: isSelected ? "0 8px 20px rgba(88, 196, 182, 0.2)" : "none"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--foreground)", fontFamily: "var(--font-mono, monospace)" }}>
                      {sem.label}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 size={13} color={sem.sgpa && sem.sgpa > 9.0 ? "var(--lime)" : "var(--cyan)"} />
                    ) : isOngoing ? (
                      <Clock size={13} color="var(--amber)" className="animate-spin" style={{ animationDuration: "6s" }} />
                    ) : (
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--muted)", opacity: 0.3 }} />
                    )}
                  </div>
                  <span style={{ fontSize: "0.68rem", color: "var(--muted)", display: "block" }}>
                    {sem.academicYear}
                  </span>
                </div>

                <div style={{ marginTop: "0.75rem" }}>
                  {sem.sgpa ? (
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                      <span style={{ 
                        fontSize: "1.25rem", 
                        fontWeight: 800, 
                        color: sem.sgpa > 9.0 ? "var(--lime)" : "var(--cyan)",
                        fontFamily: "var(--font-mono, monospace)"
                      }}>
                        {sem.sgpa.toFixed(2)}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>SGPA</span>
                      {sem.sgpa > 9.0 && <Sparkles size={12} color="var(--lime)" style={{ marginLeft: "auto" }} />}
                    </div>
                  ) : (
                    <span style={{ 
                      fontSize: "0.75rem", 
                      color: isOngoing ? "var(--amber)" : "var(--muted)", 
                      fontWeight: 600,
                      fontFamily: "var(--font-mono, monospace)"
                    }}>
                      {isOngoing ? "Ongoing" : "Upcoming"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Semester Focus Card */}
        {selectedSemCard && (
          <div style={{ 
            marginTop: "1rem", 
            background: "rgba(255, 255, 255, 0.02)", 
            border: "1px solid var(--line)", 
            borderRadius: "0.75rem", 
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem"
          }}>
            <div>
              <span style={{ fontSize: "0.72rem", color: "var(--cyan)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-mono, monospace)", fontWeight: 700 }}>
                Semester {selectedSemCard} Highlighted Curriculum
              </span>
              <div style={{ fontSize: "0.88rem", color: "var(--foreground)", fontWeight: 500, marginTop: "0.25rem" }}>
                {BTECH_SEMESTER_GRADES[selectedSemCard - 1]?.highlights?.join(" • ") || "Curriculum details pending."}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ 
                fontSize: "0.75rem", 
                color: "var(--muted)", 
                background: "rgba(255, 255, 255, 0.05)", 
                padding: "0.3rem 0.75rem", 
                borderRadius: "1rem",
                fontFamily: "var(--font-mono, monospace)" 
              }}>
                Credits: {BTECH_SEMESTER_GRADES[selectedSemCard - 1]?.credits || "TBD"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
