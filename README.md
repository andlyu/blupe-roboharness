# RoboHarness × BluPe

A stationary YAM adaptation of [RoboHarness](https://arxiv.org/abs/2610.14018), with live robot cameras, task controls and retained run replay. **Physical acceptance is pending.**

User invocation, November 3, 2026: “Lets setup a website that integrates this appraoch with blepe remote bots. We should use the harness, and only finish wehn all the checks are done.” This and the adopted repository instructions select the [harness contract](docs/BLUPE-HARNESS-CONTRACT.md). The [working checklist](docs/COMPLETION-CHECKLIST.md) determines completion. Public delivery is authorized by that invocation; private email and credentials stay out of demo materials.

[Website](https://roboharness-blupe.andlyu.chatgpt.site) · [Integration source](https://github.com/andlyu/blupe-roboharness) · [Shared runner PR](https://github.com/andlyu/blupe-remote-bots/pull/268) · [Research mapping](docs/RESEARCH-MAPPING.md)

Official upstream revision inspected: `d58e2defb25b9167a1ef14ab778995bf9e9de42f`. This adaptation implements the paper’s keypoint/tracking/depth/geometric-tool pattern on the canonical BluPe control stack. It supports tracked scene points, gripper-axis line/plane alignment, touch offsets, incremental pose adjustment and grippers; mobile-base, torso and arbitrary held-object attachment-frame constraints are excluded. No paper benchmark result is claimed.

The researcher delegated current compatible planning/vision model selection and confirmed **Model/approach: RoboHarness**. The requested underlying model is `gpt-6-astra`, low reasoning, through the existing Codex subscription transport. An immutable resolved model version is not exposed and remains explicitly unresolved. There is no fallback. [The non-actuating image/schema check](docs/evidence/model-transport.json) passed in 6.60 seconds with Andrew as the runner, separately from execution mode; it created no robot session. Dream1 is retained as the preference if a VLA role is added; this variant uses no VLA.

## Development

Use the supplied Sites/Vinext runtime. `npm run dev -- --host 127.0.0.1 --port 8803` starts the website. `node --test tests/*.cjs` checks the real public-read and runner gateway modules; `npx tsc --noEmit` checks the UI. The camera displays actual published images and retains a clearly labelled last image through interruptions. Image-point inspection is pixel-only and does not send motion.

Shared runner/UI/model control code lives in [blupe-remote-bots/codex-runner](https://github.com/andlyu/blupe-remote-bots/tree/main/codex-runner), with no bundled editable copy here. `backend/serve.py` is the hosting bootstrap. It requires a clean source-hash-bound preflight receipt, exact per-station calibration IDs and the existing supported model transport. `backend/deploy/` contains the isolated loopback service and HTTPS route. No credential is copied or embedded.

Run and Stop use the normal BluPe visitor cookie/CSRF, queue/lease, measured Home readiness, controller, calibrated limits, workspace/contact checks and parking. Confirmed name/email are editable and sent only to this integration and the existing BluPe operational backend when Run is clicked. Execution mode is separate from the human runner. An uncertain submission or timed-out movement is never retried automatically.

Every deployed backend must pass the required offline command preflight. Completion additionally requires a representative physical object task through the deployed UI, every-run visual onset timing, live footage, immediate replay with seeking, historical replay and public evidence for every checklist item. Numerical FK/IK/contact checks are not a dynamics simulation rollout or evidence of physical task success.
