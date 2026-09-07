import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import {InfographicFrame,getPhase, type SceneId} from './Infographic';
import scenes from '../../content/motion-scenes.json';
import {marks} from './marks';
assert.equal(getPhase(0),0);assert.equal(getPhase(149),0);assert.equal(getPhase(150),1);assert.equal(getPhase(299),1);assert.equal(getPhase(300),2);assert.equal(getPhase(449),2);
for(const scene of Object.keys(scenes) as SceneId[]) {
  for(const frame of [0,70,149,150,220,299,300,370,449]) {
    const output=renderToStaticMarkup(<InfographicFrame scene={scene} frame={frame}/>);
    assert(!/NaN|Infinity|undefined/.test(output),`${scene}, frame ${frame}: invalid value`);
    assert(output.includes(scenes[scene].label),`${scene}: missing scene label`);
    assert(output.includes('perspective('),`${scene}: missing depth`);
    assert(output.includes('<svg'),`${scene}: missing marks`);
  }
}
for(const key of ['pencil-ruler','user-round','bot','youtube','instagram','googledocs','microsoftword','trello'])assert(marks[key],key);
console.log('54 composition states passed: six scenes, phase boundaries, finite styles, readable labels, depth and trusted marks.');
