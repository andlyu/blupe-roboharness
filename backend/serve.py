"""Host RoboHarness using the pinned shared runner and normal BluPe API."""
import argparse
import json
from pathlib import Path
import sys


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--runner-source',type=Path,required=True)
    parser.add_argument('--origin',required=True)
    parser.add_argument('--recording-root',type=Path,required=True)
    parser.add_argument('--preflight',type=Path,required=True)
    parser.add_argument('--port',type=int,default=8813)
    parser.add_argument('--model',default='gpt-6-astra')
    transport=parser.add_mutually_exclusive_group(required=True)
    transport.add_argument('--local-codex',action='store_true')
    transport.add_argument('--broker-socket')
    parser.add_argument('--hosting-app-source',type=Path)
    args=parser.parse_args();source=args.runner_source.resolve()
    if not (source/'roboharness_playground.py').is_file():parser.error('Select the published shared RoboHarness runner source')
    sys.path[:0]=[str(source),str(source/'src')]
    from roboharness_playground import RoboHarnessPlayground,verify_release
    verify_release(args.preflight)
    if args.local_codex:
        from remote_yam.codex_policy import codex_status
        attach=lambda provider:provider.use_local_codex()
        status=lambda:{'ready':codex_status().get('ready') is True}
    else:
        if not args.hosting_app_source:parser.error('Broker mode requires the existing hosting application source')
        hosting=args.hosting_app_source.resolve();sys.path[:0]=[str(hosting),str(hosting.parents[1])]
        from codex_sponsor import SponsoredCodex
        sponsor=SponsoredCodex(args.broker_socket);attach=sponsor.attach;status=sponsor.status
    from multi_robot import fleet
    import uvicorn
    calibration=json.loads((Path(__file__).parent/'calibration.json').read_text())
    robots=[{'id':'yam-1','name':'YAM1','hardware':'yam','joint_counts':[6,6]},
            {'id':'robot-ba8413962083809c','name':'Robo-house YAM','hardware':'yam','joint_counts':[6,6]}]
    api='https://yam-session-api.n5hthc3gj4cqy.us-east-1.cs.amazonlightsail.com'
    app=fleet(RoboHarnessPlayground,dict(public_origin=args.origin,session_api=api,camera_origin=api,
        hardware_control=True,development=args.origin.startswith('http://127.0.0.1:'),share_conversation=True,
        recording_root=args.recording_root,attach_model=attach,model_status=status,
        calibration_config=calibration,preflight_receipt=args.preflight,underlying_model=args.model),robots)
    uvicorn.run(app,host='127.0.0.1',port=args.port,access_log=False)


if __name__=='__main__':main()
