import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import {InfographicFrame,getPhase, type SceneId} from './Infographic';
import scenes from '../../content/motion-scenes.json';
import {marks} from './marks';
assert.equal(getPhase(0),0);assert.equal(getPhase(69),0);assert.equal(getPhase(70),1);assert.equal(getPhase(139),1);assert.equal(getPhase(140),2);assert.equal(getPhase(209),2);
for(const scene of Object.keys(scenes) as SceneId[]) {
  for(const frame of [0,30,69,70,100,139,140,170,209]) {
    const output=renderToStaticMarkup(<InfographicFrame scene={scene} frame={frame}/>);
    assert(!/NaN|Infinity|undefined/.test(output),`${scene}, frame ${frame}: invalid value`);
    assert(output.includes(scenes[scene].label),`${scene}: missing scene label`);
    assert(output.includes('perspective('),`${scene}: missing depth`);
    assert(output.includes('<svg'),`${scene}: missing marks`);
  }
}
for(const key of ['pencil-ruler','user-round','bot','youtube','instagram','googledocs','microsoftword','trello'])assert(marks[key],key);
console.log('54 composition states passed: six scenes, phase boundaries, finite styles, readable labels, depth and trusted marks.');
