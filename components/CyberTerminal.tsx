"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  X, 
  CornerDownLeft, 
  Cpu, 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Play, 
  RotateCcw,
  Sparkles,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";

interface HistoryItem {
  id: string;
  type: "input" | "output" | "error" | "success" | "system" | "code";
  content: string | React.ReactNode;
}

const QUICK_COMMANDS = [
  "help",
  "probe",
  "build",
  "test",
  "hack",
  "telemetry",
  "rtos",
  "sensors",
  "can-dump",
  "neofetch",
  "whoami",
  "projects",
  "matrix",
  "theme",
  "clear"
];

export default function CyberTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: "init-1", type: "system", content: "⚡ ScaraMouche-Wanderer-OS // Embedded Firmware & Kernel Diagnostics Architecture v5.18.2" },
    { id: "init-2", type: "system", content: "Target: ARM Cortex-M4 (STM32F405) + Linux POSIX Daemon | FreeRTOS Kernel Online" },
    { id: "init-3", type: "system", content: "Type 'help' or click any quick command chip below to execute interactive hardware probes." },
  ]);
  const [cmdIndex, setCmdIndex] = useState<number>(-1);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const idCounter = useRef(100);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getNextId = () => {
    idCounter.current += 1;
    return `cmd-${idCounter.current}`;
  };

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName);

      if ((e.ctrlKey && e.key.toLowerCase() === "k") || (!isInput && e.key === "/")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, history]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setCmdHistory((prev) => [...prev, trimmed]);
    setCmdIndex(-1);

    const newHistory: HistoryItem[] = [
      ...history,
      { id: getNextId(), type: "input", content: `visitor@ScaraMouche-Wanderer-mcu:~$ ${trimmed}` }
    ];

    const cmd = trimmed.toLowerCase();
    const args = cmd.split(" ").filter(Boolean);
    const root = args[0];
    const subArg = args[1];

    switch (root) {
      case "help":
        newHistory.push({
          id: getNextId(),
          type: "output",
          content: (
            <div className="flex flex-col gap-2 font-mono text-xs">
              <span className="text-[var(--cyan)] font-bold tracking-wider">⚡ ScaraMouche-Wanderer-OS INTERACTIVE COMMAND CATALOG:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-200">
                <div className="p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-lime-300 font-bold block cursor-pointer hover:underline" onClick={() => handleCommand("probe facegate")}>probe &lt;project&gt;</span>
                  <span className="text-slate-400 text-xs">Hardware register & kernel subsystem dump</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-lime-300 font-bold block cursor-pointer hover:underline" onClick={() => handleCommand("build")}>build</span>
                  <span className="text-slate-400 text-xs">Simulate ARM Cortex-M4 GCC compilation & ELF binary map</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-lime-300 font-bold block cursor-pointer hover:underline" onClick={() => handleCommand("test")}>test</span>
                  <span className="text-slate-400 text-xs">Run 101 unit tests & mathematical verification matrix</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-lime-300 font-bold block cursor-pointer hover:underline" onClick={() => handleCommand("hack")}>hack</span>
                  <span className="text-slate-400 text-xs">Simulate buffer overflow exploit vs FreeRTOS defense</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-lime-300 font-bold block cursor-pointer hover:underline" onClick={() => handleCommand("telemetry")}>telemetry</span>
                  <span className="text-slate-400 text-xs">Live I2C, SPI, DMA & ADC voltage telemetry</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-lime-300 font-bold block cursor-pointer hover:underline" onClick={() => handleCommand("rtos")}>rtos</span>
                  <span className="text-slate-400 text-xs">FreeRTOS Task Control Blocks (TCBs) & stack watermarks</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-lime-300 font-bold block cursor-pointer hover:underline" onClick={() => handleCommand("sensors")}>sensors</span>
                  <span className="text-slate-400 text-xs">HZL 4-20mA current loop ADC SCADA stream</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-lime-300 font-bold block cursor-pointer hover:underline" onClick={() => handleCommand("can-dump")}>can-dump</span>
                  <span className="text-slate-400 text-xs">Automotive CAN Bus 2.0B frame stream</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-lime-300 font-bold block cursor-pointer hover:underline" onClick={() => handleCommand("neofetch")}>neofetch</span>
                  <span className="text-slate-400 text-xs">Embedded hardware specs & toolchain information</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-lime-300 font-bold block cursor-pointer hover:underline" onClick={() => handleCommand("goto projects")}>goto &lt;section&gt;</span>
                  <span className="text-slate-400 text-xs">Smooth glide to any portfolio section or deep dive</span>
                </div>
              </div>
            </div>
          )
        });
        break;

      case "probe":
        if (!subArg || subArg === "list") {
          newHistory.push({
            id: getNextId(),
            type: "output",
            content: (
              <div className="flex flex-col gap-2 font-mono text-xs">
                <span className="text-[var(--cyan)] font-bold">AVAILABLE SYSTEM PROBES:</span>
                <div className="flex flex-wrap gap-2">
                  {["facegate", "codewriter", "prag", "hzl", "aeromesh"].map((sys) => (
                    <button
                      key={sys}
                      onClick={() => handleCommand(`probe ${sys}`)}
                      className="px-2.5 py-1 bg-white/10 hover:bg-cyan-500/20 hover:text-cyan-300 text-white rounded border border-white/15 cursor-pointer transition-all"
                    >
                      probe {sys}
                    </button>
                  ))}
                </div>
              </div>
            )
          });
        } else if (subArg === "facegate") {
          newHistory.push({
            id: getNextId(),
            type: "output",
            content: (
              <div className="flex flex-col gap-1.5 font-mono text-xs text-purple-200">
                <span className="text-purple-400 font-bold">[PROBE: FaceGate-Linux Biometric Daemon]</span>
                <div>&bull; Kernel Interceptor: POSIX SIGSTOP / SIGCONT signal controller</div>
                <div>&bull; V4L2 Device Stream: /dev/video0 (640x480 @ 30FPS YUYV)</div>
                <div>&bull; Neural Engine: ONNX Runtime (buffalo_l embedding 512-D vector)</div>
                <div>&bull; RAM Key Vault: AES-256-GCM located at /run/user/1000/tmpfs (Zero disk plaintext)</div>
                <div>&bull; Tamper-Evident DB: ~/.local/share/facegate/audit.db (SHA-256 HMAC verified)</div>
                <div className="mt-1 text-slate-400">Jump: <span className="text-cyan-300 underline cursor-pointer" onClick={() => handleCommand("goto project/proj-facegate")}>Open Full FaceGate Deep Dive &rarr;</span></div>
              </div>
            )
          });
        } else if (subArg === "codewriter") {
          newHistory.push({
            id: getNextId(),
            type: "output",
            content: (
              <div className="flex flex-col gap-1.5 font-mono text-xs text-cyan-200">
                <span className="text-cyan-400 font-bold">[PROBE: CodeWriter Linux /dev/uinput Driver]</span>
                <div>&bull; Kernel Interface: /dev/uinput low-level EV_KEY hardware virtual keyboard</div>
                <div>&bull; Typing Humanizer: Gaussian distribution cadence engine (μ=65ms, σ=18ms)</div>
                <div>&bull; Clipboard Contamination: 0.00% (Strict hardware scancode injection)</div>
                <div>&bull; Test Suite: 101/101 Pytests passed (100% test coverage)</div>
                <div className="mt-1 text-slate-400">Jump: <span className="text-cyan-300 underline cursor-pointer" onClick={() => handleCommand("goto project/proj-codewriter")}>Open Full CodeWriter Deep Dive &rarr;</span></div>
              </div>
            )
          });
        } else if (subArg === "prag") {
          newHistory.push({
            id: getNextId(),
            type: "output",
            content: (
              <div className="flex flex-col gap-1.5 font-mono text-xs text-indigo-200">
                <span className="text-indigo-400 font-bold">[PROBE: PRAG Offline RAG Engine]</span>
                <div>&bull; AST Calculus Engine: Deterministic sympy evaluation (&lt;3ms latency, 0% hallucination)</div>
                <div>&bull; Vector Storage: SQLite-vec on local flash storage</div>
                <div>&bull; Reranker Model: bge-reranker-base CrossEncoder (2-stage distillation)</div>
                <div>&bull; Memory Efficiency: Dynamic load &amp; unload back to 0.0 MB idle RSS</div>
                <div className="mt-1 text-slate-400">Jump: <span className="text-cyan-300 underline cursor-pointer" onClick={() => handleCommand("goto project/proj-prag")}>Open Full PRAG Deep Dive &rarr;</span></div>
              </div>
            )
          });
        } else if (subArg === "hzl") {
          newHistory.push({
            id: getNextId(),
            type: "output",
            content: (
              <div className="flex flex-col gap-1.5 font-mono text-xs text-amber-200">
                <span className="text-amber-400 font-bold">[PROBE: HZL Smelter 4-20mA Industrial Unit]</span>
                <div>&bull; Current Loop Interface: 4-20mA instrumentation loops with 0mA broken-wire interlock</div>
                <div>&bull; MCU Sampling: 12-Bit ADC continuous circular DMA buffer @ 50Hz</div>
                <div>&bull; Field Deployment: Vedanta Hindustan Zinc Ltd (Chanderiya Smelting Complex)</div>
                <div>&bull; Verified Impact: 40% reduction in manual high-temperature furnace walk-throughs</div>
                <div className="mt-1 text-slate-400">Jump: <span className="text-cyan-300 underline cursor-pointer" onClick={() => handleCommand("goto project/proj-hzl")}>Open Full HZL Deep Dive &rarr;</span></div>
              </div>
            )
          });
        } else if (subArg === "aeromesh") {
          newHistory.push({
            id: getNextId(),
            type: "output",
            content: (
              <div className="flex flex-col gap-1.5 font-mono text-xs text-lime-200">
                <span className="text-lime-400 font-bold">[PROBE: AeroMesh Autonomous Quadcopter Swarm]</span>
                <div>&bull; RTOS Scheduling: 1kHz FreeRTOS PID flight control loop (&lt;180μs motor update)</div>
                <div>&bull; Radio Protocol: 868MHz LoRa mesh decentralized peer-to-peer heartbeat</div>
                <div>&bull; Sensor Fusion: MPU-6050 6-DOF IMU + BMP280 Barometer Kalman Filter</div>
                <div>&bull; Fail-safe: Auto-corridor hold upon packet loss without base station</div>
                <div className="mt-1 text-slate-400">Jump: <span className="text-cyan-300 underline cursor-pointer" onClick={() => handleCommand("goto project/proj-rtos-swarm")}>Open Full AeroMesh Deep Dive &rarr;</span></div>
              </div>
            )
          });
        }
        break;

      case "build":
      case "compile":
        newHistory.push({
          id: getNextId(),
          type: "output",
          content: (
            <div className="flex flex-col gap-1.5 font-mono text-xs text-slate-200">
              <div className="text-[var(--cyan)] font-bold">$ arm-none-eabi-gcc -mcpu=cortex-m4 -mthumb -mfloat-abi=hard -mfpu=fpv4-sp-d16 -O3 -Wall -Wextra -T STM32F405_FLASH.ld -o build/firmware.elf</div>
              <div className="text-slate-400">[1/4] Compiling Core/Src/main.c ... OK</div>
              <div className="text-slate-400">[2/4] Compiling Drivers/STM32F4xx_HAL_Driver/Src/stm32f4xx_hal_dma.c ... OK</div>
              <div className="text-slate-400">[3/4] Compiling Middlewares/Third_Party/FreeRTOS/tasks.c ... OK</div>
              <div className="text-slate-400">[4/4] Linking build/firmware.elf ... OK</div>
              <div className="p-3 bg-black/60 rounded-lg border border-white/10 my-1 font-mono text-xs">
                <div className="text-emerald-400 font-bold mb-1">ELF BINARY MEMORY MAP (STM32F405RGT6 1024KB Flash / 192KB SRAM):</div>
                <div>&bull; .text (Code Execution)   :  48,392 bytes [==================&gt;     ] 4.7% of 1MB Flash</div>
                <div>&bull; .rodata (Const String)   :   9,420 bytes</div>
                <div>&bull; .data (Initialized RAM)  :   2,180 bytes</div>
                <div>&bull; .bss (Uninitialized RAM) :  14,840 bytes [====&gt;                  ] 8.8% of 192KB SRAM</div>
                <div className="text-lime-300 font-bold mt-1">BUILD STATUS: SUCCESS (0 errors, 0 warnings) [Compilation time: 382ms]</div>
              </div>
            </div>
          )
        });
        break;

      case "test":
      case "pytest":
        newHistory.push({
          id: getNextId(),
          type: "output",
          content: (
            <div className="flex flex-col gap-1.5 font-mono text-xs">
              <div className="text-[var(--cyan)] font-bold">$ pytest -v --cov=firmware_core --cov-report=term-missing tests/</div>
              <div className="text-slate-300">collected 101 items</div>
              <div className="text-emerald-400">tests/test_uinput_scancodes.py::test_ev_key_mapping .................. [ 18%] PASSED</div>
              <div className="text-emerald-400">tests/test_gaussian_cadence.py::test_jitter_variance ................. [ 39%] PASSED</div>
              <div className="text-emerald-400">tests/test_facegate_sigstop.py::test_posix_signal_interception ...... [ 62%] PASSED</div>
              <div className="text-emerald-400">tests/test_ast_calculus.py::test_exact_derivative_evaluation ........ [ 85%] PASSED</div>
              <div className="text-emerald-400">tests/test_freertos_watchdog.py::test_1khz_deadline_guarantee ...... [100%] PASSED</div>
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-emerald-300 font-bold mt-1">
                ✔ 101 passed in 1.48s &bull; TOTAL TEST COVERAGE: 100.0%
              </div>
            </div>
          )
        });
        break;

      case "hack":
      case "attack":
        newHistory.push({
          id: getNextId(),
          type: "output",
          content: (
            <div className="flex flex-col gap-1.5 font-mono text-xs text-rose-200">
              <span className="text-rose-400 font-bold">[SIMULATING RED-TEAM EXPLOIT ATTEMPT]</span>
              <div className="text-slate-300">&gt; Injecting 512-byte malicious shellcode into /dev/video0 input pipe...</div>
              <div className="text-amber-400 font-bold">&gt; Intercepting: FaceGate Centroid Liveness Engine active...</div>
              <div className="text-emerald-400">&gt; [DEFENSE 1] Optical flow vector deviation detected (Static Photo Spoof: CONFIDENCE 0.12) &rarr; BLOCKED!</div>
              <div className="text-emerald-400">&gt; [DEFENSE 2] Stack Canary Token 0xDEADC0DE verified intact &rarr; Zero memory corruption!</div>
              <div className="text-emerald-400">&gt; [DEFENSE 3] POSIX SIGSTOP issued to target process PID 8392 &rarr; Intruder snapshot saved to ~/.local/share/facegate/intruders/</div>
              <div className="p-2 bg-emerald-950/50 border border-emerald-500/50 rounded-lg text-emerald-300 font-bold mt-1">
                SYSTEM INTEGRITY: 100% UNCOMPROMISED
              </div>
            </div>
          )
        });
        break;

      case "telemetry":
        newHistory.push({
          id: getNextId(),
          type: "output",
          content: (
            <div className="font-mono text-xs text-lime-300 leading-relaxed">
              <div className="text-cyan-300 font-bold">[STM32F405 HARDWARE BUS &amp; POWER TELEMETRY]:</div>
              <div>&bull; [I2C1 BUS @ 400kHz] 0x3C (OLED Display) &bull; 0x68 (MPU-6050 IMU) &bull; 0x76 (BMP280 Barometer) : OK</div>
              <div>&bull; [SPI2 DMA STREAM] LoRa SX1276 @ 10MHz &bull; TX Buffer: 64 bytes &bull; RSSI: -68 dBm</div>
              <div>&bull; [ADC1 CHANNELS] CH0=3.28V | CH1=1.42V | CH2=0.88V | CH3=2.91V (12-bit Continuous Scan)</div>
              <div>&bull; [CORE POWER] VDD = 3.31V &bull; Core Temp = 34.2 °C &bull; SysTick Jitter = ±12ns @ 1000Hz</div>
              <div>&bull; [FREERTOS HEAP] 48,220 bytes free / 65,536 total</div>
            </div>
          )
        });
        break;

      case "rtos":
        newHistory.push({
          id: getNextId(),
          type: "output",
          content: (
            <div className="font-mono text-xs text-lime-300 leading-relaxed">
              <div className="text-cyan-300 font-bold">FREERTOS v10.4.3 KERNEL TASK CONTROL BLOCK (TCB) DUMP:</div>
              <div>[TCB 0x20000410] PID_LOOP_1KHZ   | Pri: 4 (Realtime) | State: Running | Stack: 1.4KB free | CPU: 38.2%</div>
              <div>[TCB 0x20000550] SENSOR_FUSION   | Pri: 3 (High)     | State: Ready   | Stack: 2.1KB free | CPU: 22.4%</div>
              <div>[TCB 0x20000690] LORA_MESH_ROUT  | Pri: 2 (Normal)   | State: Blocked | Stack: 3.8KB free | CPU: 12.1%</div>
              <div>[TCB 0x200007D0] BLACKBOX_SD_LOG | Pri: 1 (Low)      | State: Blocked | Stack: 4.2KB free | CPU:  4.6%</div>
              <div className="text-slate-400 mt-1">Idle Task CPU: 22.7% &bull; Tick Rate: 1000 Hz &bull; Preemption: Enabled</div>
            </div>
          )
        });
        break;

      case "sensors":
        newHistory.push({
          id: getNextId(),
          type: "output",
          content: (
            <div className="font-mono text-xs text-amber-300 leading-relaxed">
              <div className="text-amber-400 font-bold">4-20mA CURRENT LOOP ADC SCADA (HZL CHANDERIYA SMELTER):</div>
              <div>&bull; Roaster Kiln Temp  : 918.4 °C  (18.2 mA loop current) [NOMINAL]</div>
              <div>&bull; Gas Duct SO₂ Level : 432 ppm   (14.8 mA loop current) [NOMINAL]</div>
              <div>&bull; Blower Vibration  : 1.82 mm/s (11.2 mA loop current) [NOMINAL]</div>
              <div>&bull; Main Steam Press  : 4.28 bar  (16.5 mA loop current) [NOMINAL]</div>
              <div className="text-slate-400 mt-1">Broken-Wire Protection: ACTIVE (0mA trigger threshold &lt; 3.6mA)</div>
            </div>
          )
        });
        break;

      case "can-dump":
        newHistory.push({
          id: getNextId(),
          type: "output",
          content: (
            <div className="font-mono text-xs text-cyan-200 leading-relaxed">
              <div className="text-cyan-400 font-bold">CAN BUS 2.0B FRAME LOGGER (500 kbps Baud):</div>
              <div>[12:04:18.102] ID: 0x18F00400 DLC: 8 DATA: [ 0x82 0x1F 0x00 0x9A 0x00 0x00 0x04 0x12 ] (Engine RPM)</div>
              <div>[12:04:18.122] ID: 0x18F00500 DLC: 8 DATA: [ 0x48 0x02 0xFF 0x10 0x00 0x00 0x00 0x00 ] (Coolant Temp)</div>
              <div>[12:04:18.142] ID: 0x0CF00400 DLC: 8 DATA: [ 0x00 0x7D 0x84 0x00 0x00 0x00 0x00 0x00 ] (Torque Demand)</div>
              <div className="text-emerald-400 mt-1">Bus Error Counters: TEC=0, REC=0 (Error Active Mode)</div>
            </div>
          )
        });
        break;

      case "neofetch":
      case "uname":
        newHistory.push({
          id: getNextId(),
          type: "output",
          content: (
            <div className="font-mono text-xs text-slate-200 leading-relaxed">
              <div className="text-cyan-300 font-bold">visitor@ScaraMouche-Wanderer-embedded-rig</div>
              <div>----------------------------------------</div>
              <div><strong className="text-lime-400">OS:</strong> ScaraMouche-Wanderer-RTOS / Arch Linux ARM64 (Kernel 6.8.0)</div>
              <div><strong className="text-lime-400">Host:</strong> Custom STM32F405 + ESP32-S3 Dual-Core Hybrid</div>
              <div><strong className="text-lime-400">Toolchain:</strong> arm-none-eabi-gcc 13.2.1, Rust 1.77, Next.js 16</div>
              <div><strong className="text-lime-400">Architecture:</strong> ARM Cortex-M4F @ 168 MHz (Hardware FPU)</div>
              <div><strong className="text-lime-400">Memory:</strong> 192 KB SRAM + 1024 KB Flash</div>
              <div><strong className="text-lime-400">Uptime:</strong> 99.98% High-Availability</div>
            </div>
          )
        });
        break;

      case "whoami":
      case "bio":
        newHistory.push({
          id: getNextId(),
          type: "output",
          content: "ScaraMouche-Wanderer — Electronics & Communication Engineer specializing in RTOS firmware, embedded hardware prototyping, deterministic control loops, and modern web software integrations."
        });
        break;

      case "projects":
        newHistory.push({
          id: getNextId(),
          type: "output",
          content: (
            <div className="flex flex-col gap-2 font-mono text-xs">
              <span className="text-[var(--cyan)] font-bold">ENGINEERED PRODUCTION SYSTEMS:</span>
              <div className="flex flex-col gap-1.5 text-slate-200">
                <div><strong className="text-[#c084fc] cursor-pointer hover:underline" onClick={() => handleCommand("goto project/proj-facegate")}>1. FaceGate-Linux:</strong> Local Biometric Desktop Locker with POSIX SIGSTOP Interceptor</div>
                <div><strong className="text-cyan-300 cursor-pointer hover:underline" onClick={() => handleCommand("goto project/proj-codewriter")}>2. CodeWriter:</strong> Low-Level Linux /dev/uinput USB HID Keystroke Automation</div>
                <div><strong className="text-indigo-300 cursor-pointer hover:underline" onClick={() => handleCommand("goto project/proj-prag")}>3. PRAG Offline Engine:</strong> High-Precision AST Mathematical RAG with 0% Hallucination</div>
                <div><strong className="text-amber-300 cursor-pointer hover:underline" onClick={() => handleCommand("goto project/proj-hzl")}>4. HZL Smelter Monitor:</strong> 4-20mA Current Loop ADC SCADA Industrial Unit</div>
                <div><strong className="text-lime-300 cursor-pointer hover:underline" onClick={() => handleCommand("goto project/proj-rtos-swarm")}>5. AeroMesh Drone Swarm:</strong> 1kHz FreeRTOS Decentralized Flight Mesh</div>
              </div>
            </div>
          )
        });
        break;

      case "goto":
        if (args[1]) {
          const target = args[1].replace("#", "").replace("/", "");
          newHistory.push({
            id: getNextId(),
            type: "success",
            content: `Navigating to ${args[1]}...`
          });
          setIsOpen(false);
          if (target.startsWith("project") || target.startsWith("education") || target.startsWith("certification")) {
            router.push(`/${args[1].replace(/^\//, "")}`);
          } else {
            const el = document.getElementById(target);
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            } else {
              router.push(`/#${target}`);
            }
          }
        } else {
          newHistory.push({
            id: getNextId(),
            type: "error",
            content: "Usage: goto <home|about|skills|education|experience|projects|contact>"
          });
        }
        break;

      case "matrix":
        newHistory.push({
          id: getNextId(),
          type: "output",
          content: (
            <div className="text-emerald-400 font-mono text-xs leading-tight tracking-widest animate-pulse">
              01000101 01001101 01000010 01000101 01000100 01000100 01000101 01000100<br />
              01010011 01011001 01010011 01010100 01000101 01001101 01010011 00100000<br />
              01000001 01010010 01000011 01001000 01001001 01010100 01000101 01000011<br />
              01010100 01010101 01010010 01000101 00100000 01010010 01001111 01000011<br />
              <span className="text-lime-300 font-bold">&gt;&gt; REALITY SILICON MATRIX ACTIVE // HARDWARE TO FULL-STACK</span>
            </div>
          )
        });
        break;

      case "sudo":
        newHistory.push({
          id: getNextId(),
          type: "error",
          content: "visitor is not in the sudoers file. This incident has been logged and reported to ScaraMouche-Wanderer."
        });
        break;

      case "theme": {
        const isLight = document.documentElement.classList.contains("light");
        if (isLight) {
          document.documentElement.classList.remove("light");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.add("light");
          localStorage.setItem("theme", "light");
        }
        newHistory.push({
          id: getNextId(),
          type: "success",
          content: `Theme switched to ${isLight ? "Dark" : "Light"} mode.`
        });
        break;
      }

      case "clear":
        setHistory([]);
        setInputVal("");
        return;

      default:
        newHistory.push({
          id: getNextId(),
          type: "error",
          content: `Command '${trimmed}' not found. Type 'help' or click any quick chip to view valid commands.`
        });
    }

    setHistory(newHistory);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = QUICK_COMMANDS.find((cmd) => cmd.startsWith(inputVal.toLowerCase()));
      if (match) setInputVal(match);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = cmdIndex === -1 ? cmdHistory.length - 1 : Math.max(0, cmdIndex - 1);
        setCmdIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdHistory.length > 0 && cmdIndex !== -1) {
        const nextIdx = cmdIndex + 1;
        if (nextIdx < cmdHistory.length) {
          setCmdIndex(nextIdx);
          setInputVal(cmdHistory[nextIdx]);
        } else {
          setCmdIndex(-1);
          setInputVal("");
        }
      }
    }
  };

  return (
    <>
      {/* Floating HUD Trigger Pill with Live Pulse */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[var(--panel-strong)] border border-[var(--cyan)] hover:border-cyan-300 rounded-full px-4 py-2.5 flex items-center gap-2.5 text-xs font-mono font-bold text-[var(--foreground)] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(111,255,233,0.25)] cursor-pointer hover:scale-105 transition-all laser-sweep-overlay"
        aria-label="Open Cyber Terminal"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_10px_#adff6a]" />
        <Terminal size={15} className="text-[var(--cyan)]" />
        <span className="tracking-wider text-white">FIRMWARE CLI</span>
        <span className="text-[10px] bg-cyan-400/20 text-[var(--cyan)] px-1.5 py-0.5 rounded border border-cyan-400/40">
          Ctrl+K
        </span>
      </button>

      {/* Terminal Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl h-[520px] bg-[#070f14] border border-[var(--cyan)]/60 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(56,189,248,0.2)] flex flex-col overflow-hidden font-mono"
            >
              {/* Header Title Bar */}
              <div className="px-4 py-3 bg-[#0b1720] border-b border-cyan-500/20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/90" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/90" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
                  </div>
                  <span className="text-xs text-[var(--cyan)] font-bold tracking-wider flex items-center gap-1.5">
                    <Cpu size={14} />
                    visitor@ScaraMouche-Wanderer-os:~ (firmware-cli-v5.18)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ● RTOS TICK: 1000Hz
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/60 hover:text-white transition-colors p-1"
                    aria-label="Close terminal"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Quick Command Suggestions Bar */}
              <div className="px-4 py-2 bg-[#081219] border-b border-white/10 flex gap-1.5 flex-wrap items-center">
                <span className="text-[10px] text-white/50 uppercase tracking-wider mr-1 font-bold">QUICK:</span>
                {QUICK_COMMANDS.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleCommand(cmd)}
                    className="text-[11px] bg-white/5 hover:bg-cyan-500/25 hover:text-[var(--cyan)] hover:border-cyan-500/50 text-white/80 px-2.5 py-0.5 rounded-md border border-white/10 transition-all cursor-pointer font-semibold"
                  >
                    {cmd}
                  </button>
                ))}
              </div>

              {/* Terminal Output Stream */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2.5 text-xs leading-relaxed text-slate-100 font-mono">
                {history.map((item) => (
                  <div key={item.id} className={
                    item.type === "error" ? "text-rose-400" :
                    item.type === "success" ? "text-emerald-400" :
                    item.type === "system" ? "text-[var(--cyan)]" :
                    "text-slate-200"
                  }>
                    {item.content}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Command Input Bar */}
              <div className="p-3.5 bg-[#0a151d] border-t border-white/10 flex items-center gap-2">
                <span className="text-[var(--cyan)] font-bold text-base">&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a firmware command ('help', 'probe facegate', 'build', 'hack')..."
                  className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs placeholder:text-white/30"
                  autoFocus
                />
                <button
                  onClick={() => handleCommand(inputVal)}
                  className="bg-cyan-500/20 hover:bg-cyan-500/35 border border-[var(--cyan)] text-[var(--cyan)] rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer transition-colors font-bold"
                >
                  <CornerDownLeft size={13} /> Enter
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
