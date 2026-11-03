const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
const {renderToStaticMarkup}=require('react-dom/server');
const React=require('react');
function component(){
 const module={exports:{}};
 const code=ts.transpileModule(fs.readFileSync('components/launch-progress.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(code,{module,exports:module.exports,require,Date},{filename:'launch-progress.tsx'});
 return module.exports.LaunchProgress;
}
test('queue admission and real planning initialization remain distinct with completed readiness retained',()=>{
 const LaunchProgress=component();
 const start={id:1,timestamp:1001,kind:'model_preparation',message:'Initializing the planning session while normal queue admission proceeds'};
 const ready={id:2,timestamp:1004,kind:'model_preparation_ready',message:'Planning session initialized; fresh robot observations remain required'};
 function view(events,status='queued'){
  return renderToStaticMarkup(React.createElement(LaunchProgress,{state:{status,queue_position:2,interactions:{events},run_summary:{events:[{type:'queue_entry',timestamp:1000.5}]}},startedAt:1000000,uncertain:false,stopping:false}));
 }
 const waiting=view([start]);assert.match(waiting,/Waiting for queue admission/);assert.match(waiting,/Initializing the planning session/);assert.doesNotMatch(waiting,/Planning session ready|Lease admitted/);
 const initialized=view([start,ready]);assert.match(initialized,/Waiting for queue admission/);assert.match(initialized,/Planning session ready/);assert.doesNotMatch(initialized,/Lease admitted/);
 const failed=view([start,{id:3,timestamp:1005,kind:'model_preparation_failed',message:'Planning session initialization failed; stop this run before another attempt'}],'failed');
 assert.match(failed,/initialization failed/);assert.doesNotMatch(failed,/Planning session ready/);
});
