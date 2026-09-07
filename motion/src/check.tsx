import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import {InfographicFrame,getPhase,getDuration,PHASE_FRAMES, type SceneId} from './Infographic';
import scenes from '../../content/motion-scenes.json';
import {marks} from './marks';
assert.equal(getPhase(0),0);assert.equal(getPhase(69),0);assert.equal(getPhase(70),1);assert.equal(getPhase(139),1);assert.equal(getPhase(140),2);assert.equal(getPhase(209),2);
assert.deepEqual(scenes.creators.roles,['agent','human','agent','human','agent']);
assert.deepEqual(scenes.creators.phases.map(([label])=>label),['Roteiro','Gravação','Edição','Aprovação','Publicação']);
let states=0;
for(const scene of Object.keys(scenes) as SceneId[]) {
  const phaseCount=scenes[scene].phases.length;
  assert.equal(getDuration(scene),scene==='creators'?350:210);
  assert.equal(getPhase(-1,scene),0);
  assert.equal(getPhase(getDuration(scene),scene),phaseCount-1);
  const frames=Array.from({length:phaseCount},(_,phase)=>[0,30,69].map(offset=>phase*PHASE_FRAMES+offset)).flat();
  for(const frame of frames) {
    const phase=Math.floor(frame/PHASE_FRAMES);
    assert.equal(getPhase(frame,scene),phase,`${scene}: playback and selection must reach every phase`);
    const output=renderToStaticMarkup(<InfographicFrame scene={scene} frame={frame}/>);
    assert(!/NaN|Infinity|undefined/.test(output),`${scene}, frame ${frame}: invalid value`);
    assert(output.includes(scenes[scene].label),`${scene}: missing scene label`);
    assert(output.includes('perspective('),`${scene}: missing depth`);
    assert(output.includes('<svg'),`${scene}: missing marks`);
    if(scene==='creators') {
      assert.equal((output.match(/data-active="true"/g)||[]).length,1);
      assert(output.includes(`data-creator-stage="${phase}" data-active="true" data-role="${scenes.creators.roles[phase]}"`));
      assert(output.includes(`data-creator-delivery="${phase}"`));
      assert.equal(output.includes('Aprovou? Vai para o canal.'),phase===4,'Publication delivery follows approval');
      if(phase===2)for(const operation of ['Cortes e montagem','Remoção de silêncios','Ajuste de cor','Grafismos e animações','Melhoria do som','Legendas sincronizadas'])assert(output.includes(operation));
    }
    states++;
  }
}
for(const key of ['pencil-ruler','user-round','bot','youtube','instagram','googledocs','microsoftword','trello'])assert(marks[key],key);
console.log(`${states} composition states passed: all phase boundaries, creator roles, editing operations, approval before publication, finite styles and trusted marks.`);
