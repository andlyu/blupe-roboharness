# Research mapping — November 3, 2026

Sources: [paper v1, sections 3.1–3.2](https://arxiv.org/html/2610.14018v1), [official upstream](https://github.com/BinceQu/RoboHarness/tree/d58e2defb25b9167a1ef14ab778995bf9e9de42f), and the shared BluPe `docs/API.md`.

The paper selects image keypoints, tracks them with optical flow, and back-projects matched depth. It separates movable gripper/held-object points from fixed scene points. Constraints select candidate poses before IK, planning and execution. Its forward/left/up coordinates require an explicit transform from YAM optical and robot-base frames.

| Component | YAM implementation | Evidence/status |
| --- | --- | --- |
| Image points | Exact frame identity; normalized 0–1000 to native pixels | Offline endpoint/shape tests |
| Tracking | Bidirectional optical flow; identity and occlusion rejection | Five actual tracker checks |
| Depth | Shared paired RGB-D sampler; fresh calibrated arm-base transforms | Real read-only RGB-D capture and stale/optical rejection checks |
| Constraints | Touch, line and plane relations plus pose/gripper tools | Both-arm real packet/validator/serializer gate |
| IK and motion | Exact station geometry, measured start, contact/joint/workspace limits | Offline gate; physical accuracy unverified |
| Execution | Canonical controller, queue/lease, matched feedback, Stop | Shared wrapper; deployed physical verification pending |
| Models | Delegated gpt-6-astra/low through Codex; approach RoboHarness | Three-image/schema inference passed in 6.60 seconds; immutable alias resolution unavailable |
| Chassis, torso, held-object attachment frames | Unsupported on stationary YAM variant | Explicitly excluded |

The paper identifies Qwen3.8-Flash-Next-FP8 with Claude Code 2.1.259 for its simulation results. This deployment is labelled a replacement-planner YAM adaptation. It does not claim identical model, embodiment, arbitrary attached-object constraint support or benchmark reproduction.

Initial read-only discovery found both stations connected but DISABLED and unavailable. YAM1 reported hardware_not_initialized, homed=false, settled=false and missing measured gripper fractions. Reread these transient states before any test. No hardware enable or robot session was requested.

The Session API did not supply CORS headers for this website origin. The website uses a strict same-origin server allowlist for public reads, with no arbitrary URL, session capability or private identity exposure. No simulation rollout has been executed; applicability is reviewed again when the full adapter exists.

## Implemented software, not physical acceptance

RoboHarnessControl now resolves touch, directed-line axis alignment, plane-normal alignment, incremental SE(3) pose adjustments and normalized grippers, with shared MuJoCo FK/IK/contact checks and the canonical Session API packet validator. It intersects conservative XYZ bounds with the hash-pinned controller workspace, applies station-specific joint limits, retains exact final gripper targets and preserves uninstructed measured joints/arms. The current 27-check offline gate passes through actual serialization with a transport spy. Numerical FK/IK is not a robot dynamics rollout.

KeypointTracker uses bidirectional Lucas–Kanade optical flow and the shared calibrated depth sampler, rejecting lost points, calibration changes and stale/noisy depth. RoboHarnessAdapter implements the LLM geometric-tool loop and fresh post-inference reconciliation. The existing private broker accepts a bounded numeric robot-decision envelope; an explicit allowlist maps its fields to the same named geometric primitives. No code, CLI flags or arbitrary endpoints are accepted from model outputs. Policy/tracking/parser integration tests pass; deployed physical acceptance remains pending.

The current public Robo-house calibration uses model binding 7b118417600209c7059f1456c740c8b5b5e7b11d83b320306eb5c791f06b149d and camera calibration 1eb254f29a7f3b13c681b80b8e3fe7d89f056ff581e201c2263743c3791edde2. Both must be pinned and matched, preserving their experimental/unverified physical-accuracy warnings. The older saved workspace's model-calibration label is historical; its hash-verified safety envelope is distinct from the exact execution model binding. Gateway workspace/contact safety remains authoritative on every packet.


### Selected depth camera variant (PR279; deployment pending)

Overhead-only grounding loses visible object features when the gripper approaches. The stationary YAM adapter now supports explicitly selecting one paired depth camera per run: overhead, left wrist or right wrist. The other two views remain RGB context. Wrist projection composes the registered native-grasp camera mount with FK of current measured settled joints into each arm base; it does not reinterpret the mounting matrix as a base pose or change the native API origin. This is a documented YAM adaptation, not a reproduction of the paper’s mobile R1Pro experiments. Missing/stale selected-camera depth stops observation without fallback; the three-image decision schema and model choice remain unchanged. Physical task acceptance is still open.
