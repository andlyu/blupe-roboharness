# Research integration completion checklist

Agents and humans: read this before integrating a paper or method. Copy this
template into the integration's documentation, fill in the evidence, and check
each box only after verification. All boxes must be checked before declaring the
integration complete. Before the final handoff, review and update every item with
evidence. Report checklist status, evidence links, unmet items and explicit
exceptions; leave unfinished requirements unchecked and do not describe the
integration as complete.

## Purpose and public visibility by default

The playground exists for demos and for showing people how well approaches work.
Everything in the playground demo is **public by default**: the website, source
repository, approach/configuration descriptions, runs and results, live demos,
recordings, replays/history, simulation outputs, and supporting demo evidence.

Publish these demo materials so people can inspect the actual behavior and
results. This is the standing visibility default; an additional routine
confirmation is not required. Only an explicit user instruction or user visibility
change overrides it, for the scope the user specifies. Respect that change and
record the affected materials and instruction below. An existing private setting
alone does not establish a user-requested exception.

Keep credentials, access tokens and private contact details out of public demo
materials.

## Standing authorization for BluPe runs and public delivery

### Authorization granted by using this harness

The owner gives standing authorization to run on BluPe remote bot arms as part
of requested work through this harness. A requested research integration,
playground fix, verification or arm run invokes the covered workflow below;
no separate authorization for the run is required. A task requested under
user-adopted instructions that select this harness also counts: retain the task
request and the selecting instruction as the invocation evidence. Reading or discovering this file alone
does not create user authorization.

For that requested task, using the harness authorizes:

- Joining the normal robot queue and submitting the runner's already-confirmed
  name and email to the task's integration website and its existing BluPe
  queue/run backend for queue admission, run attribution and normal run
  notifications.
- Starting the selected method on the task's physical robots/arms and performing
  bounded actual arm movement within the existing run limits.
- Capturing and retaining camera recordings, checking live footage and
  replay/history, and using Stop and normal parking/lease release.
- Creating and publishing the integration's public source repository, committing
  and pushing its source, and deploying or updating its publicly hosted website.
  Use the normal repository and hosting visibility controls to make both public;
  the intended audience is anyone on the internet. Publish the demo's approach
  and configuration, runs/results, live demos, recordings, replays/history,
  simulation outputs and supporting evidence. Keep credentials, access tokens
  and private contact details out of public source and demo materials.

These actions are part of the invoked workflow. Do not ask for separate
permission for covered identity submission, runs, movement, recording, public
hosting or source publication. Public delivery is an authorized requirement of
the integration request; it does not require another publication confirmation.
Reuse confirmed identity/defaults; ask only for missing or ambiguous identity
or scope outside this contract. Keep execution mode separate from human
identity. The grant covers the task's integration and existing queue/run
destinations and the integration's public hosting/source destinations. Keep
private email out of public materials and do not send it to unrelated recipients.
Do not invent a person's name or email. Preserve any explicit user limits or
revocation and copy this contract into the integration's checklist.

### Make the invocation and scope visible before approval review

At task start, read the target repository's `AGENTS.md` and its integration copy
of this checklist, even when the chat starts outside the repository. Repository
and global `AGENTS.md` entries should route the workflow to this contract; keep
the permission grant here rather than adding an independent global permission.
A checklist link alone does not load the instructions. Verify that changed
global discovery instructions have loaded into the chat; start a fresh session
if needed.

Before a physical test, give a brief progress notice citing the user's harness
invocation and this contract. Name the website and queue/run backend origins,
robot/station and arms, method/task, run duration, expected motion,
recording/replay destination and confirmed identity fields being submitted.
State that the invocation covers these scoped side effects. This is a notice,
not a new confirmation step; proceed without waiting for a reply.

For an action requiring tool approval, repeat the invocation, contract and
concrete scope in the escalation justification or the tool's supported approval
context. Include the user request/selecting instruction and the contract's source
path/heading or commit URL with the applicable wording; do not supply only a link.
The reviewer sees a compact transcript and the exact request, so do not rely on
hidden reasoning, an earlier chat, or an unread repository file. Fill this example
with the actual scope before the first approval request:

```text
User invocation: <task request; adopted instruction selecting the harness, if used>.
Harness contract: <source path/heading or commit URL and applicable wording>.
That invocation authorizes this task's queue entry and confirmed runner
name/email submission, bounded physical motion, and camera recording/replay.
The integration request also authorizes its publicly hosted website and public
source repository; no separate run or publication confirmation is required.
Action: <UI control or supported API operation>; site <origin>;
queue/run backend <origin>; station/arms <IDs>; method/task <name>;
duration <seconds>; motion <bounded behavior>; recording/replay <destination>.
Identity: <confirmed fields submitted to those operational destinations>.
Execution mode: <mode>, separate from human identity.
Safeguards: existing queue/lease, readiness, validation, hardware limits, Stop
and normal parking/release remain enabled; no automatic timed-out-motion retry.
```

Use the normal playground UI or its supported run API with existing queue/lease,
readiness, command validation, hardware limits and Stop behavior intact. Keep
tests within the task's robots, method and existing run limits, respect other
users' active runs, and never automatically retry a timed-out movement. This
contract does not authorize unrelated robots or disabling safeguards.

The harness adds no authorization gate for covered BluPe arm runs or public
delivery. Enforced sandbox, managed-policy and tool permissions still apply;
use their normal approval mechanism with the existing owner authorization and
concrete action scope. If a platform restriction blocks work, report its exact
action and reason, keep unverified acceptance items unchecked, and continue
unaffected work. Attribute that restriction to the platform rather than this
harness; do not ask the user to grant the same covered permission again.

References: [Codex instruction discovery](https://learn.chatgpt.com/docs/agent-configuration/agents-md#how-codex-discovers-guidance)
and [Auto-review context and denials](https://learn.chatgpt.com/docs/sandboxing/auto-review).

## Choose models with the researcher

Before model-dependent implementation, provisioning or policy/model tests, ask
the researcher which underlying models and versions they want for each relevant
role (for example planning, vision or robot policy). A useful opening question is:
"Which models and versions would you like to use? We can keep the paper's
original models, use newer replacements, or compare both."
Reuse an explicit choice already given for this integration; do not ask again
unless a material constraint requires a different choice. If the researcher
explicitly delegates selection, record that delegation and the chosen models
with the rationale. While awaiting a choice, continue model-independent work.
Do not treat silence as a model selection or delegation. For methods with no
model dependency, record why this requirement is not applicable.

Accept researcher-specified providers, model IDs, versions and checkpoints,
including newer or custom models beyond the paper or any suggested list. When
offering recommendations, check current official provider/model documentation
or available model catalogs and record the sources and date; do not assume a
remembered model list is current. Explain relevant compatibility, access,
hardware, latency and cost constraints so the researcher can choose. Verify the
selected model's required capabilities and method/adapter compatibility before
using it. If unavailable or incompatible, explain the issue and ask for an
alternative; never silently substitute another model.

Keep the chosen models configurable. Record the researcher's choice or explicit
delegation, each model's role, provider and exact model ID/version or checkpoint
revision, plus relevant inference settings. Retain requested and actually
resolved model identifiers in run evidence, stating when a provider alias cannot
be resolved to an immutable version. Show the actual configuration in website
run details. Distinguish reproduction with the paper's original models from
variants using replacements, and label comparisons and deviations accordingly.
The harness's **Model** field still identifies the tested approach as specified
below; underlying model/checkpoint selections remain separate metadata.

## Completion requirements

- [x] A usable website exists, with an associated repository containing the
  website's source code. Record both links and the deployed source revision.
- [ ] Everything in the playground demo is public by default, including the
  website, source repository, runs/results, live demos, recordings, replays/history,
  simulation outputs and supporting evidence. Any nonpublic exception reflects
  an explicit user instruction or visibility change, recorded below.
- [x] The website clearly names the actual approach/method being run. Use the
  executed method's name; Spotter is an example, not a shared hardcoded label.
  The **Model** field identifies the approach being tested, as specified below.
- [x] The researcher was asked which underlying models/versions to use before
  model-dependent work, or their prior explicit choice/delegation was retained.
  Choices include newer/custom models; current availability and compatibility
  were checked. Configuration and run details retain the selected and actually
  resolved models/settings, with baseline/replacement variants labelled and no
  silent fallback. Record evidence below, or a justified no-model explanation.
- [x] When a human joins, collect or confirm their name and email. Prefill known
  identity/default values where available and let the runner edit both fields
  before joining.
- [x] Run context includes the actual approach and confirmed runner identity;
  the website makes clear which method is running and whose run it is.
- [x] Policy/model tests initiated by a person retain that actual user's
  confirmed name as runner. Use available identity and editable name/email
  defaults; require the real name to be provided/confirmed if missing before
  testing or running. Do not substitute `Anonymous`, `Autonomous` or `Automated`
  for that person. Record execution mode (such as `automated test`) and actual
  approach separately from human identity. Genuinely unattended/system activity
  has an explicit system identity; never fabricate a person's name or email.
- [ ] Every advertised control primitive passes the offline command-contract
  gate through the actual parser/generator/serializer and canonical validator,
  including measured fractional starts, numeric endpoints, invalid-input and
  zero-dispatch failure tests. A required CI/release-preflight result and exact
  source/dependency revisions are retained. Follow [the control contract](CONTROL-CONTRACT.md).
- [ ] Task acceptance matches the advertised capability and tested deployment.
  A representative physical task exercises the required primitives and verifies
  the requested object/result state; a narrower smoke test is labelled as such.
  Relevant failures or changed control code reopen affected requirements and
  the current passed/total display, preserving earlier results as history.
- [ ] A person can use the website to run the integrated paper's method on
  physical YAM robots/arms. Record a verified physical execution of that method.
- [ ] The actual physical arms are visible live on the website while the method
  runs, so a visitor can see that it is executing on real hardware.
- [ ] Immediately after a run finishes, the person can replay that just-completed
  physical YAM execution through the website, with retained footage showing the
  actual arms executing the integrated method.
- [ ] The person can browse/select previous runs on the website and replay their
  retained physical arm footage, associated with the executed method and run.
  Mock animations do not satisfy either replay requirement.
- [x] If the integrated method executes anything in simulation, those executions
  are reviewable within the integration website and tied to the corresponding
  run. A reviewer can inspect what ran and its results using suitable
  replay/visualization and relevant outputs, as appropriate to the simulation.
  Clearly label simulation content to distinguish it from physical-arm footage.
  If nothing executes in simulation, record an explicit not-applicable
  explanation instead of claiming simulation review.
- [ ] **Mandatory for every run:** first observed actual method-driven physical
  YAM motion occurs both within **15 seconds after the startup move to Home
  completes** and within **30 seconds after the Run/Start click excluding
  evidenced queue-admission waiting**, using the boundaries below (including a
  documented readiness timestamp when Home is unnecessary). Homing/preparation
  motion does not count. Record full elapsed times, queue entry/admission,
  excluded queue seconds and the queue-adjusted Run time for every run; a sampled
  demonstration is insufficient. Apply only the documented GPU-launch or
  research-grounded exceptions below.
- [ ] Every meaningful wait after a website action is immediately explained in
  a persistent inline status/progress area at that action (below Run in the run
  panel for launches). Show the current stage, a plain-language reason and real
  stage completion, with honest failure/stall status and available recovery.
  Verify the detailed wait-stage behavior below.
- [ ] Before marking the integration complete or reporting it done, open the
  deployed website and perform a final end-to-end physical YAM run through its
  normal user interface. Verify every completion requirement against that
  deployment and record evidence; unmet or unverified requirements block
  completion.


## Verify commands and numeric boundaries

Read [CONTROL-CONTRACT.md](CONTROL-CONTRACT.md) before physical runs and before
completion, including when an integration retains an older working checklist.
The installer distributes that contract independently of preserved evidence.
Its engineering gates are mandatory; they add no authorization/approval step.

Require actual command-path regression tests and pre-dispatch validation, exact
validated interpolation endpoints, strict rejection of invalid inputs, preserved
hardware safeguards and an actionable distinction between local input rejection
and physical safety stops. A test-only accepting mock cannot replace the real
deployed packet validator. Retain a failing packet and red-to-green reproduction
for every repair. Wire the tests into CI or the release preflight.

For advertised pick-and-place, verify the relevant approach/grasp/lift/transfer/
release/withdrawal sequence and fresh evidence of the object outcome. Passing
joint motion does not certify the untested sequence. Tie each claim to a task,
capability, source revision and evidence; invalidate affected current passes
after a relevant new failure. Installing this document is not test evidence.

## Model identifies the tested approach

Set the harness's **Model** field to the actual research approach/method being
tested. For example, a HarnessVLA run uses `HarnessVLA` as its Model value.
Resolve this value from the approach that actually executes and carry it
consistently through the website's model label/selection, run context and stored
run records, queue/email notifications, and replay/history attribution.

Record underlying foundation, planner or VLA model IDs and checkpoint names as
separate configuration metadata. Keep confirmed human runner identity and
execution mode in their own fields too.

Verify a run's Model value against the executed approach and retain evidence of
the website label, stored run record, notification and replay/history attribution.

## Verify normal UI execution

Site entry (`t_entry`), starting state and browser/session/network may be
recorded as optional diagnostic context. An agent can perform verification
through the normal UI.

Keep a timed screen recording showing the UI actions, the Run click,
startup Home completion (or no-Home readiness) and live physical arms beginning
the integrated method, linked to the matching run. Correlate recorded UI/physical
events with lifecycle logs on a common timeline; document any clock offset or
measurement uncertainty. Backend timing alone cannot verify physical onset.
Visual timing evidence may use retained accessible recording/verification links;
a local download is not required.

## Verify every Run and startup Home

For every run, record these fixed boundaries:

- `t_run`: the actual Run/Start click. Retain all subsequent wall-clock time,
  including queue waiting, preparation, coding, model loading and inference.
  Exclude only evidenced queue-admission waiting from the 30-second calculation
  below; do not restart the clock at admission, acknowledgement, dispatch, GPU
  readiness or a later status change.
- `t_home`: completion of that run's startup move to Home, using matched
  settled/ready completion for all participating arms, corroborated by live
  footage. Starting/submitting Home or reporting it accepted is insufficient.
  If no Home movement is necessary, record why and use the earliest documented
  per-run robot-ready confirmation after Run and normal queue/lease admission,
  before method preparation/execution. If already admitted and robot-ready at
  Run, use `t_home = t_run` with that readiness evidence. Readiness here concerns
  the robot, not GPU/model/code availability. Do not choose an arbitrary later
  event, repeat Home, or delay the readiness timestamp to reset this clock.
- `t_motion`: first observed actual physical arm motion executing the integrated
  method. Home and other preparation/parking motion do not count. An accepted or
  queued request, submitted packet, UI "running" status, inference start or
  backend-only timestamp is insufficient.

### Queue-admission wait in the 30-second budget

Record `t_queue` when this run's request actually enters the normal robot queue
and `t_admit` when that same request is first admitted/granted its robot
session/lease. Match queue/request and session/lease identifiers to the run and
retain actual lifecycle evidence. An accepted/queued submission is not admission.
Time between Start and queue entry still counts. Post-admission hardware
preparation, readiness checks, Home, coding, model loading/inference and other
setup still count; they must not be relabeled queue waiting. Later preparation
status changes or reacquisition cannot move the initial admission boundary.

Let `Q_run` be the duration of the evidenced queue-admission wait interval
`[t_queue, t_admit]` overlapping `[t_run, t_motion]`. Clip any queue waiting that
began before Start to `t_run`. If already admitted or there is no queue wait,
record `Q_run = 0` with matching admission/no-queue evidence. For a queued
request, missing entry or admission evidence makes the adjusted Run measure
unverified; do not assume zero or infer admission from Home, method readiness
or eventual motion.

Ordinary runs must satisfy **both** `t_motion - t_home <= 15 seconds` and
`t_motion - t_run - Q_run <= 30 seconds`. The queue exclusion is a normal part of
the 30-second budget, not a GPU or research exception; a full wall time over
30 seconds may still be a normal pass when the evidenced queue-adjusted time
meets its target. It does not change or pause the 15-second post-Home measure.

Retain full Run-to-motion and post-Home-to-motion times, excluded queue seconds
and queue-adjusted Run seconds even for failures and exceptions. Record every
run below (add rows), with visual evidence of Run and physical onset plus
matched Home/readiness and queue-admission evidence. Mark each target as pass,
missed target, unverified or exception. A normal pass requires the queue-adjusted
Run time and full post-Home time within their limits. Missing visual evidence or
an unmatched Home/readiness boundary leaves the affected timing unverified.

### GPU-launch exception

A run genuinely requiring new GPU launch/provisioning (for example on RunPod)
may claim an exception only for the evidenced time that launch blocks progress.
Show the **entire launch period** in persistent inline UI: actual launch start,
ongoing launch reason/stage and actual GPU-ready completion, with matching
provider/instance/job lifecycle evidence. If launch starts before Run, retain its
full start/ready interval and show its ongoing state when the run panel opens.
Warm/already available GPUs do not qualify. Record why a new GPU was necessary.

Keep the original clocks and full elapsed times. Record `t_gpu_start`,
`t_gpu_ready`, the full launch duration, and the evidenced GPU-launch blocking
seconds overlapping each measured interval (`B_run` and `B_home`). Only blocking
time inside both the actual launch interval and the relevant Run/Home-to-motion
interval can be excused; do not deduct concurrent time spent on unrelated work.
For the Run clock, also record `O_run`, the duration shared by the evidenced
queue-wait and GPU-blocking intervals inside `[t_run, t_motion]`. Exclude their
union, `Q_run + B_run - O_run`, never the overlapping seconds twice. For a GPU
exception, require `t_motion - t_run - Q_run - B_run + O_run <= 30 seconds` and
`t_motion - t_home - B_home <= 15 seconds`. Label a queue-adjusted Run target miss
or full post-Home target miss excused by GPU launch as **exception**, not normal
pass. Queue exclusion alone remains normal budget accounting. Keep raw queue and
GPU intervals, overlap, full timings and both adjusted calculations separately.
If GPU readiness precedes Home completion, `B_home = 0`: the full 15-second post-Home target still
applies. If Home completes during launch, only its evidenced remaining launch
blocking time can be excused; do not silently restart either clock at GPU ready.
Missing lifecycle or persistent UI evidence leaves the exception unverified.

Only the evidenced initial queue-admission interval is excluded from the
30-second budget; coding, model loading, inference, post-admission preparation
and other infrastructure delays outside actual GPU provisioning remain counted.
A warm GPU, a generic "loading" message or a slow model call is not a launch
exception.
Unrelated delays remain missed targets if they exceed the remaining limits.

Other exceptions require a specific justification grounded in the integrated
paper/research, explaining why it applies to that run and which target it affects,
plus a supporting source citation/link and relevant section/page. Slow coding,
loading, setup, post-admission delay or infrastructure delay is not in itself a
paper/research-grounded exemption; there is no permanent coding exemption.
Queue-admission waiting uses the normal exclusion above, not this mechanism.

| Run reference | Run/Start click (`t_run`) | Queue entry / admission (`t_queue` / `t_admit`), matching lifecycle evidence; or evidenced no-wait | Excluded queue seconds (`Q_run`) | Startup Home settled completion / no-Home readiness (`t_home`) and evidence | First observed method motion (`t_motion`) / visual evidence | Full Run-to-motion seconds | Queue-adjusted Run seconds | Full post-Home-to-motion seconds | Run / post-Home outcomes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | |

- Exception record (repeat for each affected run):
- Exception category (GPU launch or paper/research-grounded):
- Affected run reference and timing target(s):
- Specific reason and why it applies to this run:
- GPU-launch evidence (if applicable: provider, instance/job reference,
  `t_gpu_start`, `t_gpu_ready`, full launch seconds, lifecycle log/link and
  persistent inline UI evidence covering the entire launch period):
- GPU-launch blocking evidence (`B_run`, `B_home`), queue/GPU shared seconds
  (`O_run`), excluded union (`Q_run + B_run - O_run`), both adjusted calculations
  and separate outcome for each target:
- Supporting paper/research source (for other exceptions: citation/link and
  relevant section/page):

## Visible progress while waiting

Use a compact persistent inline status area directly below Run in the existing
run panel; keep other meaningful waits beside their initiating control. Show the
current stage and why it is taking time immediately, keep it readable throughout
the wait, and visibly mark completed stages as actual lifecycle state advances.
A transient toast alone or a generic spinner is insufficient.

While actually awaiting queue admission, show `Waiting for robot admission` (or
clear equivalent), with the real queue reason/state and entry timestamp. Retain
its completed admission/grant state and timestamp, then show actual hardware
preparation/Home/model stages separately. Keep queue and GPU launch stages
distinct when concurrent; do not leave the queue stage pending after admission
or label all startup as queue waiting. Retain matching per-run lifecycle evidence
for the queue exclusion; no invented queue positions, times or completion.

When a model requires a new GPU, show only the stages that actually exist:
`Starting GPU` / "We're launching a GPU on RunPod for this model" -> `GPU ready`
-> `Loading model` -> `Running`. GPU startup must be explicit from its actual
launch start and throughout the launch period (immediately after Run when Run
initiates it); visibly confirm actual GPU readiness before subsequent
loading/running and retain completed-stage confirmation with start/ready
timestamps tied to lifecycle evidence. Use the applicable provider/model wording.
On failure or a stalled stage, state the known condition honestly and show an
available recovery action, such as retry or cancel where supported. Do not invent
percentages, ETA or completion, or expose irrelevant infrastructure internals.
UI transparency alone grants no exemption; only the documented GPU-launch
blocking interval qualifies under the exception above, with neither clock reset.

## Verify retained replays

Open the retained recording through the website, confirm actual playback and
appropriate seeking, and match it to the just-completed or selected historical
physical run. Record the matching run reference/link and observed verification
result. A link alone is insufficient.

This does not require pressing **Save video**, downloading/exporting video to the
agent's filesystem, making duplicate local copies or bundling videos in outputs.
Omit optional local downloads from routine acceptance work; they are not a
completion requirement and must not create an approval or needs-input blocker.
Download locally only when explicitly requested or concretely necessary for the
task. Required tool/platform permissions still apply; do not bypass or retry a
denial through another route. Website/backend recording capture and retention
remain required.

## Final verification before completion

Open the deployed website and its associated source repository. Use the normal
website controls to join, run the integrated method on physical YAMs and watch the
actual arms live. First verify the required command-contract CI/release checks;
choose a representative task covering the advertised primitives and verify its
actual result. Reconcile later failures and changed control code with current
acceptance status instead of carrying forward a stale smoke-test pass.
Check the unchanged 15-second post-Home measure and the
30-second Run/Start-to-motion budget excluding evidenced queue-admission wait.
Keep fixed boundaries, full elapsed times, queue entry/admission/excluded seconds
and queue-adjusted time; verify any GPU-launch exception uses the queue/GPU
union without double subtraction. Check actual queue-to-admitted-to-preparation
inline stages; site entry is optional context. Check approach/runner identities,
replay of the just-completed run and selection/replay of previous runs. Review
every checklist item against current evidence, including public visibility and
actual user attribution in policy/model tests, with execution mode separate.
Check the website, repository and each demo artifact type as a logged-out visitor;
record working public links or the explicit user-directed visibility exception.
Verify that Model identifies the executed approach consistently in the website,
run records, notifications and replay/history, with underlying model/checkpoint
configuration recorded separately.
Verify that the selected underlying models match the researcher's choice or
explicit delegation, that run details show what actually executed, and that any
replacement or comparison is labelled accurately.
Verify wait status appears immediately, keeps a readable reason, and visibly
confirms real stage completion (GPU ready before subsequent loading/running).
Check failure/stall status and available recovery evidence too. Record the
tested deployment, run and evidence below.
Leave unmet or unverified items unchecked and report gaps and explicit exceptions
before any completion claim.

## Integration and evidence

- Paper / method (link and version):
- Model-choice evidence (question/response or prior explicit choice/delegation,
  reference, per-role preferences and constraints; or no-model explanation):
- Selected model configuration (roles, providers, exact model IDs/versions or
  checkpoint revisions, inference settings, editable configuration location and
  original-paper baseline versus replacement/comparison variants):
- Model verification and run provenance (current availability/capability and
  compatibility checks, official sources/check date, run references, requested
  versus actually resolved identifiers, unresolved aliases and website evidence):
- Final verification (reviewer/date, tested website URL and deployed revision,
  physical run reference):
- Final checklist review (evidence for every item, replay links/timings, unmet
  items and explicit exceptions):
- Command-contract evidence (advertised primitives/arms, units/frames/ranges,
  actual packet generator/serializer/validator revisions, required CI/preflight
  command/result and endpoint/interior/invalid-input/zero-dispatch coverage):
- Failure regressions (sanitized packet/starting state, dispatch classification,
  red-to-green proof, unchanged safety checks and deployed repair revision):
- Representative task acceptance (capability/task, approach/grasp/lift/transfer/
  release/withdrawal where applicable, fresh verified outcome, exclusions and
  current requirements reopened by later failures or changed control code):
- Actual approach name / website label evidence:
- Model-as-approach evidence (executed approach, website Model value, stored run
  record, queue/email notification and replay/history attribution; separate
  underlying model/checkpoint configuration):
- Human join evidence (name/email collection or confirmation, prefilled defaults
  and edits to both fields):
- Run context evidence (run ID, approach and runner identity; website attribution):
- User-initiated test evidence (run ID, confirmed human runner, actual approach,
  separate execution mode; editable defaults and missing-name confirmation):
- Unattended/system activity evidence (explicit system identity, execution mode
  and actual approach; no fabricated person):
- Wait-status evidence (action/run reference, immediate inline visibility,
  ongoing stage/reason and real completion transitions):
- GPU-startup UI evidence (startup shown after Run, actual readiness confirmed
  before loading/running, completed stages and matching lifecycle evidence):
- Failure/stall status and available recovery evidence:
- Website URL:
- Website source repository URL / deployed revision:
- Public-default evidence (logged-out access checks and links for website,
  repository, runs/results, live demos, recordings, replay/history, simulation
  outputs and supporting demo evidence; explain any artifact type not produced):
- User-directed visibility exceptions (write "none", or affected materials/scope,
  current visibility, explicit user instruction/change, date and reference):
- Physical-test authorization/scope (source path/heading or commit URL, website
  and queue/run backend origins, station/arms, confirmed runner identity fields,
  method/task, duration, expected motion and recording/replay destination):
- Approval-context evidence (surfaced notice and escalation wording, applicable
  user invocation/selecting instruction and harness contract version/scope,
  review decision/rationale if required; redact private email from public evidence):
- Physical execution (date, method/configuration, YAM station/arm IDs, run ID):
- Live physical arm footage (website location and evidence link):
- Just-completed replay URL / matching run reference / immediate availability
  and observed playback/seeking result:
- Previous-run browser URL / selected prior run reference / replay link and
  observed playback/seeking result:
- Simulation review (corresponding run reference, website review link, what ran
  and its results, suitable replay/visualization/outputs, clear simulation label;
  or explicit not-applicable explanation if nothing executes in simulation):
- Per-run timing verification (tester/date, browser/session/network and robot
  readiness; evidence for every run in the timing table above):
- Optional diagnostic context (site entry `t_entry`, starting state and
  browser/session/network):
- `t_run` / `t_home` / `t_motion`, full Run-to-motion and post-Home-to-motion
  seconds, queue-adjusted Run seconds and separate target outcomes:
- Queue evidence (`t_queue` / `t_admit`, matched run/request/session/lease IDs,
  lifecycle links and persistent inline stages), excluded `Q_run` seconds; or
  evidenced already-admitted/no-wait with zero exclusion:
- Matched settled Home completion evidence for participating arms, or no-Home
  reason and earliest robot-ready timestamp/evidence (already ready: Run time):
- GPU launch start/ready/full interval and inline UI/lifecycle evidence, `B_run`
  / `B_home`, queue/GPU overlap `O_run`, excluded union, adjusted calculations and
  exception outcome if applicable (otherwise "none"):
- Timed screen recording / matching physical run evidence and clock correlation:
- Remaining gaps:


## Historical startup notes — November 3, 2026

User invocation: “Lets setup a website that integrates this appraoch with blepe remote bots. We should use the harness, and only finish wehn all the checks are done.” Adopted AGENTS.md routes this request to this harness. Contract is retained in BLUPE-HARNESS-CONTRACT.md.

- Paper: https://arxiv.org/abs/2610.14018v1. Official upstream inspected at d58e2defb25b9167a1ef14ab778995bf9e9de42f; see RESEARCH-MAPPING.md.
- Website registered: https://roboharness-blupe.andlyu.chatgpt.site (expected origin only; not deployed yet). Site ID appgprj_6ae9a99d2ee08191835a85053e5eb5d7 retained in .openai/hosting.json.
- Model-choice question delivered through structured input before model-dependent work. Researcher response pending. No model chosen, provisioned or tested; no silent default.
- Run identity: no confirmed integration runner yet. Editable name/email fields exist in the website foundation; no private contact details submitted or published.
- Read-only queue/observation discovery: both stations connected but DISABLED/unavailable. YAM1 safety reason hardware_not_initialized, homed=false, settled=false. These are time-dependent observations, not physical-test evidence.
- Approach Model label: RoboHarness in draft UI and disabled run response; no executed run, stored notification or replay attribution yet.
- No sessions, queue entries, model requests, physical motion, recordings or simulation rollouts have been initiated.
- UI source exists; browser, deployed source, public visibility, model selection, geometry/control implementation, command preflight, physical task, timing, live-on-run, immediate/history replay and final UI acceptance remain unverified. All completion boxes intentionally remain unchecked. No explicit exceptions requested.
- Harness adoption check: python3 codex-runner/integration-harness/adopt.py install --target codex-runner/integrations/roboharness --check returned status current, exit 0. This verifies instruction adoption only.

### Researcher decisions and software progress

- Researcher confirmed live robot view/task controls as the main screen; paper/configuration/evidence below.
- Researcher said “For models, if its a vla lets use dream1.” Explained that the core RoboHarness path uses a multimodal coding agent. Researcher then explicitly delegated: “Choose a compatible current planning/vision model for me.” Selected provider Codex, requested model gpt-6-astra, reasoning effort low, no fallback; same model for planning and vision. Replacement-model YAM variant, not the paper's original-model reproduction. Local Codex model/list returned gpt-6-astra with supported low effort. Official https://developers.openai.com/api/docs/models/gpt-6-astra confirms text/image input, function calling, structured output and streaming (checked November 3, 2026). Inference compatibility and resolved version pending. Dream1 preference retained only for a future VLA role, not silently substituted into geometric control.
- Runner confirmed in this chat: Andrew. Email confirmed and retained only in private task state; omitted from public evidence. User reinforced “Model should be RoboHarness.” No model test or robot run submitted yet.
- Monitoring route regression suite: 6/6 passing, node --test tests/monitoring.test.cjs, ~0.26 s reported runtime. Includes zero outbound requests on unconfigured run, station/camera allowlisting, private-field projection, honest upstream failure and redirects refused in edge-compatible manual mode. These tests do not certify the pending motion command contract.
- TypeScript check passed after typed public JSON projections. Production build completed all five Vinext stages. Browser preview opened at http://127.0.0.1:8803. Physical requirements remain unchecked.
- Initial edge runtime rejected redirect:error; repaired to manual with non-2xx rejection, retaining strict origin boundaries. Read-only station proxy now returns actual DISABLED state. YAM1 camera temporarily returned HTTP503; Robo-house camera returned image/jpeg HTTP200 with capture timestamp. UI keeps feed interruption visible and never substitutes generated footage.

## Software progress — November 3, 2026

The researcher confirmed Andrew as the human runner; the private email is retained only in task-private operational context. Model/approach is RoboHarness. The researcher delegated current compatible planning/vision selection; requested gpt-6-astra/low was validated against the official image/tool specification and account catalog. No VLA role exists. Immutable alias resolution is not exposed; retain explicit null and no fallback.

[Non-actuating three-image/schema evidence](evidence/model-transport.json): Andrew, separate execution mode, 6.599 s, correct red/green/blue identification, zero robot sessions and actuator submissions.

[Shared source PR 268](https://github.com/andlyu/blupe-remote-bots/pull/268) contains the actual geometric-tool adapter, canonical packet path tests and required CI/preflight. Current local gate: 27 tests passing, including both-arm endpoints/fractional starts, invalid inputs/zero dispatch, tracking/depth/calibration, timeout refusal, attribution and public provenance privacy. Website: nine gateway checks, TypeScript and production build passed. Shared Node suite: 355 passed. Broad local Python suite: 1469 passed/100 skipped/three missing-UMAP dependency failures; full CI remains the release authority.

No dynamics simulation executes: MuJoCo supplies numerical FK/IK/contact feasibility only. No simulation replay is claimed.

Public website/source delivery and all physical task, timing, live, immediate replay, historical playback/seek and final deployed UI requirements remain unverified. No physical run has been initiated. The unchecked acceptance list above remains authoritative.

Shared runner delivery: PR 268 was merged after all required CI checks passed. Merged revision `a8b94aaab891348fe387dad30a69b131f9e44386`; tested PR head `f2f2d0d57cf0261c1f894af042bf00380a80fd32`. Full CI [shared runner](https://github.com/andlyu/blupe-remote-bots/actions/runs/41692884415) and [RoboHarness gate](https://github.com/andlyu/blupe-remote-bots/actions/runs/41692884394) passed. The isolated deployment host cloned the clean merged revision and passed all 27 preflight checks in 2.460 s (5.262 s full gate command), retaining exact dependencies/source hashes. No physical session was created.

Public delivery v1 verified: [website](https://roboharness-blupe.andlyu.chatgpt.site), [source commit 5fdbb3f](https://github.com/andlyu/blupe-roboharness/commit/5fdbb3fba4dcdf80205afef5de5cc5e62bdb5f52). Native Sites version 1 deployment appgdep_6aea2a48f0708191bf0a8908c0a944af succeeded; audience public. Actual camera image and capture timestamp appeared through the deployed site. Backend startup initially stopped at the canonical local-only durable station-frame guard before any model/queue/actuator call. The public bootstrap is corrected to the standard archive path; a production-startup regression passes and confirms the guard still rejects durable local-frame storage under public hosting. Gateway non-JSON failures now map to the existing human-readable disconnected state, with a regression for the observed HTTP 525 response. Physical acceptance is still pending.

Website/public-startup CI passed at source acab37f: [run 41697220275](https://github.com/andlyu/blupe-roboharness/actions/runs/41697220275), including production configuration, 27-command preflight, all 11 UI/gateway checks, TypeScript and production build. The corrected service completed ASGI initialization, then stopped because loopback 8813 was already in use by an existing listener. That listener was left untouched; socket binding verified 8823 free, and the task’s unit/Caddy configuration now uses 8823. No queue/model/actuator call occurred.

## Physical attempt hover-001 — failed before method dispatch

Approved normal UI Run at 2026-11-03T19:04:20.622Z (click bracket 19:04:20.570–20.851Z), Andrew, Model RoboHarness, automated_verification, Robo-house YAM, 60s, source a8b94aaa / website7b34c063. Session sess_2a94716c12524402, episode ep_d758914999e442e6. Initial approval rejection distinguished motor readiness from operator-enabled queue readiness; read-only code/guard evidence was supplied and the same normal UI action was approved. No alternate actuator path was used.

The real queue admitted the run; guarded Home completed and measured settled feedback was reconciled. UI event receipts: preparing19:04:32.668Z, running32.765Z, feedback-ready33.318Z. Camera acquisition then consumed3.598s, and strict 2s motor-feedback validation rejected the aged sample at19:04:36.917Z. No policy model request or method packet was dispatched; normal stopping/parking followed. These timestamps do not certify a visual method onset. Full/queue-adjusted Run-to-motion and post-Home targets are unverified because no method motion occurred; this failed attempt remains history, with physical/task/live-method/replay/final-UI gates open. No GPU or research latency exception is claimed.

A separate read-only deployment-host measurement found three-RGB-D acquisition2.881s and resulting overhead/left/right depth ages2.748/2.456/1.520s. Wrist depth was unused by this variant. Repair work retains the strict 2s motor/depth guards, reads actual feedback after camera acquisition, and uses paired overhead depth plus fresh timestamped wrist RGB. The3.598s failure is reproduced offline before the repair; new tests also reject stale or changed-lease refresh results and preserve camera age/post-settle/cancellation gates. No physical retry occurs until revised source passes required validation and deployment preflight.

Repair validation: [PR269](https://github.com/andlyu/blupe-remote-bots/pull/269), source e83e3557290b76ca7033cfa754695064fa4eb85b. All33 command-contract checks passed locally (0.448s tests /1.052s clean preflight);56 shared tests plus32 subtests passed19.68s. [Read-only camera samples](evidence/camera-repair-readonly.json) include the HTTP503 rejection and two fresh successful captures. [Failed attempt receipt](evidence/hover-001-failed.json) preserves exact lifecycle/feedback, zero method packets and unverified timing. Website source416c4fa (Sitesv4) exposes the retained lifecycle evidence. Required full shared CI, production repair deployment and a new physical run remain pending. The first attempt’s archive media is still absent; no replay pass is claimed.

Shared repair merged as4e36fbb5c3cb287f743866601659a48e985fd156 after [full shared CI41704284179](https://github.com/andlyu/blupe-remote-bots/actions/runs/41704284179) and [33-test gate41704284510](https://github.com/andlyu/blupe-remote-bots/actions/runs/41704284510) passed. Required push duplicates also passed. Production update and fresh physical verification are next; no gate is closed by merge alone.

## Physical attempt hover-002 and current repairs

[Attempt receipt and timeline](evidence/hover-002-failed.json): Model RoboHarness, Andrew, automated_verification; episode ep_086edc7217e040a3, shared4e36fbb5 / websitebed3d739. One67-waypoint non-contact hover physically completed and settled, then the retreat was rejected because homed=false after leaving Home. No retreat packet was sent. The retained public screen capture starts0.291s after Run and includes actual method motion; it does not visually capture the click and does not establish full-task or15s timing acceptance. Earliest Home boundary00.7938094Z is retained; later feedback confirmation01.459105Z does not reset it. Queue entry50.8404381Z, admission00.716596Z, excluded queue9.8761579s. No GPU/research exception or full manipulation pass is claimed.

[PR270](https://github.com/andlyu/blupe-remote-bots/pull/270) merged a7f5b803 after all shared CI passed. Actual post-motion feedback reproduces the homed-flag failure;35 checks and the real next retreat packet pass with completion provenance under the same Home/episode/lease/cursor.

[PR271](https://github.com/andlyu/blupe-remote-bots/pull/271), source0196e2a58151a5496396a7d9c067cc3ec6b4df04, adds public timestamped overhead clips through the existing immutable replay reader. The private policy-frame loopback guard stays intact. Current offline gate41/41, clean local preflight2.017s (tests1.192s),13 UI/gateway checks and TypeScript passed. Synthetic encoding tests are not hardware footage. Full CI, deployed recording/playback/seek, a fresh complete hover, representative manipulation/object outcome and final normal UI physical/timing checks remain open. All acceptance boxes remain conservative until final verification.


## Verification checkpoint, 2026-11-03 22:35 UTC

Physical manipulation acceptance remains open. All failed attempts remain history: [hover-003](evidence/hover-003-failed.json), [manipulation-001](evidence/manipulation-001-failed.json), [manipulation-002](evidence/manipulation-002-failed.json), and [manipulation-003](evidence/manipulation-003-failed.json). Manipulation-001 met ordinary startup timing but stopped before grasp; that is a timing pass for a failed task on its recorded revision. Manipulation-002 and -003 missed the 15-second post-Home target; no GPU or research exception is claimed. The -003 normal archive fallback is only ten seconds. Its partial UI recording retains four explicit black gap intervals and does not claim complete run coverage.

[PR274 repair and CI](evidence/geometry-replay-repair.json) adds nominal installed gripper geometry at the unchanged native grasp origin, bounded read-only stale-depth reacquisition and streaming replay encoding with retained-frame recovery. The full shared-runner and pinned RoboSkills checks pass, as does the clean 53-case offline release gate. Those are software checks, not physical task success. The website also prevents stale prior-attempt evidence from appearing under a new Run click while submission is pending. Final current-deployment normal-UI physical manipulation, ordinary startup timing and complete immediate/history replay remain required before checking affected items or declaring completion.


## Current partial review

Seven interface/model/identity/documentary requirements are checked against deployed websitev7 (`49444e84`) and runtime`5351347`: [item-by-item evidence](evidence/interface-provenance-v7.json) and [unauthenticated public-access checks](evidence/public-access-v7.json). They do not establish physical task acceptance. The dynamic registry matches the exact runtime source and invalidates its display when that source changes.

[Empty-cup attempt004](evidence/manipulation-004-failed.json) retained zero actuator packets: no measured depth at the initial rim pixel, a later valid sidewall registration, then2.003347s-aged depth before the next model observation. Both ordinary motion deadlines were missed because no method motion occurred; no exception is claimed. Its actual-camera39s streaming clip finalized1.616s after capture ended, contains five explicit gap slots, and played/advanced/seeks5sforward/back to34s in the normal deployed Runs view. That is recorder evidence for a failed zero-motion attempt, not a representative manipulation or complete physical-method replay pass. The partial timed UI video keeps its screen-capture gap explicit.

[PR276](https://github.com/andlyu/blupe-remote-bots/pull/276) adds bounded fresh model-view reacquisition and opt-in non-actuating same-session initialization during actual queue admission, with57 offline cases and exact stale-view red/green evidence. It leaves original Run/queue/Home clocks, physical limits and no-timeout-replay behavior unchanged. Required CI/host deployment and new normal-UI physical manipulation remain pending.


## Broker protocol and host-gate follow-up

PR276 host preflight failed during its unrealistic instantaneous virtual-time replay burst and rolled back to5351347. No new physical run occurred. Before any real initialization request, static receiver review identified the existing broker requirement of1–3 valid images. [PR277](https://github.com/andlyu/blupe-remote-bots/pull/277) supplies one hash-traced synthetic gray16x16card, explicitly identified as non-robot content; real policy inference keeps its three-fresh-robot-image guard. The broker and its access rules remain unchanged. An additional required host preflight drives the actual Codex parser, hosting client serializer and receiving broker validator with sockets blocked and zero real model/robot calls; [local compatibility receipt](evidence/broker-card-local-compatibility.json). The long video regression now uses the actual2Hz capture rate for33seconds, retaining unchanged production encoding deadlines. CI, host validation, real non-actuating initialization compatibility and physical manipulation/timing/replay acceptance remain pending.


## Verification checkpoint — November4,00:34UTC

[Shared PR277](https://github.com/andlyu/blupe-remote-bots/pull/277) merged e604039 after exact-source CI. The deployment host passed57 cases and its actual broker/client validator check; the public websitev9 source34fad313 passed [CI41738978229](https://github.com/andlyu/blupe-roboharness/actions/runs/41738978229). [Cup005](evidence/manipulation-005-failed.json) completed approach/retreat but stopped before grasp. Its first observed motion28.732s after Home missed15s; queue-adjusted29.868s passed30s. Its96s partial replay finalized1.878s after capture ended and played/sought in the normal website; older manipulation001 was selected and played.

The researcher confirmed the current registered calibrations are correct. That configuration confirmation is retained without claiming a new independent accuracy measurement; report quality metadata remains intact. [Block006](evidence/manipulation-006-failed.json), on the same e604039/site34fad313, completed6 elevated approach/inspection/orientation packets,179 confirmed waypoints, then safely stopped before grasp because overhead occlusion lost current metric tracking. Its214s partial replay finalized1.709s after capture ended and played/sought through the normal Runs view. Earliest observed UI motion15.023s after Home missed15s; no timing exception is claimed.

[PR279 selected-wrist-depth repair](evidence/wrist-depth-repair.json) has a clean63-case local gate and actual local broker validation with zero network/model/robot calls. Read-only host probes of selected left/right depth plus two RGB views preserve the2s source-age ceiling. Required CI, merged host release checks, deployed camera selection and fresh representative physical manipulation remain pending. Seven previously checked documentary/interface items remain historical evidence; changed-source display stays pending until exact-source review. No full manipulation success or integration completion is claimed.


PR279 merged `930e898b74710144840ec43a53b3677382dadf80` after all exact-head and merge-context CI passed. The actual host passed all63 cases (46.549s tests /48.732390900s full gate), actual broker protocol1.596976537s with zero network/model/robot calls, public startup, readiness and the three advertised camera choices. Unrelated service PIDs stayed unchanged. [Host receipts](evidence/wrist-depth-repair.json) are public source evidence. New website camera selection and physical wrist-grounded task acceptance remain pending.


## Verification checkpoint — decision feedback

[Wrist run007](evidence/manipulation-007-failed.json) on930e898/siteb84e873 used actual left-wrist depth for2 physical approach/orientation packets (52 confirmed waypoints). First observed motion13.987s after original Home and26.517s after Run (10.585s evidenced queue exclusion;15.932s adjusted) met both ordinary targets, but the fifth policy answer failed structured acceptance before grasp. The discarded answer cannot be classified retrospectively as syntax versus invalid tool fields. Its76.5s partial physical clip (8 gaps) was ready1.422s after capture end and played/sought through the normal website; historical006 selection/playback also verified. The failed manipulation remains failed.

[PR280 repair and evidence](evidence/decision-feedback-repair.json) mergedcaff7fa9 after required full shared/66-case CI. It retains structured finals privately before parsing and routes strict decoded field rejections through the existing3-rejection zero-dispatch feedback loop with fresh state; syntax/transport/cancel/timeout/unknown movements still stop without retry. Clean local66 gate36.568s, actual host66 gate46.844s (44.527s tests), actual host broker protocol2.004s, startup/readiness and unrelated-PID checks passed. Measured own-runtime update59.704s. No new physical verification on caff7fa9 yet. Representative grasp/lift/transfer/place/release/withdrawal, independent object outcome and final current-release acceptance remain open; no integration completion is claimed.
