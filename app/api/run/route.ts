export async function POST() {
  // Fail before queue admission or dispatch while model/adapter are unverified.
  return Response.json({ state: 'not_submitted', approach: 'RoboHarness', outbound_actuator_submissions: 0,
    error: 'Choose underlying models and verify the YAM control adapter before joining the robot queue.' }, { status: 503 });
}
