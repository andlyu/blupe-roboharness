"""Non-actuating production configuration regression; no network or model calls."""
import argparse
import json
import os
from pathlib import Path
import sys
import tempfile
from unittest.mock import patch

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--runner-source',type=Path,required=True)
args=parser.parse_args();source=args.runner_source.resolve()
sys.path[:0]=[str(source),str(source/'src')]
from roboharness_playground import RoboHarnessPlayground
from remote_yam.session import MockSessionAPI

with tempfile.TemporaryDirectory() as directory:
    storage=Path(directory)
    settings={key:str(storage/(key.lower()+'.sqlite3')) for key in ('YAM_RUN_NAMES_DATABASE','YAM_SUBMISSION_DATABASE','YAM_SOCIAL_DATABASE','YAM_ASSESSMENT_DATABASE','YAM_TASK_CLOUD_DATABASE')}
    with patch.dict(os.environ,settings),patch('remote_yam.session.request.urlopen',side_effect=AssertionError('Unexpected network')) as wire:
        app=RoboHarnessPlayground(public_origin='https://roboharness.54.209.185.15.sslip.io',
            session_api='https://yam-session-api.n5hthc3gj4cqy.us-east-1.cs.amazonlightsail.com',
            camera_origin='https://yam-session-api.n5hthc3gj4cqy.us-east-1.cs.amazonlightsail.com',
            hardware_control=True,api_factory=MockSessionAPI,attach_model=lambda p:p,
            model_status=lambda:{'ready':False},calibration_config={},preflight_receipt=storage/'not-executed.json')
        assert app.retain_recordings is False
        assert app.hardware_control is True
        assert set(app.extra_providers)=={'roboharness'}
        wire.assert_not_called()
        try:
            RoboHarnessPlayground(public_origin=app.origin,session_api=app.origin,camera_origin=app.origin,
                hardware_control=True,api_factory=MockSessionAPI,attach_model=lambda p:p,model_status=lambda:{'ready':False},
                calibration_config={},preflight_receipt=storage/'not-executed.json',recording_root=storage/'frames')
        except ValueError as exc:
            assert 'loopback' in str(exc)
        else:raise AssertionError('Local-only durable-frame guard was bypassed')
        print(json.dumps({'status':'passed','scope':'public startup configuration; local-only durable-frame guard preserved',
            'queue_entries':0,'actuator_submissions':0,'model_requests':0}))
