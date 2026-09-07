import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Player, type PlayerRef} from '@remotion/player';
import {Infographic, Glyph, type SceneId, DURATION, FPS, PHASE_FRAMES, getPhase} from './Infographic';
import scenes from '../../content/motion-scenes.json';

const mount = document.querySelector<HTMLElement>('[data-motion-scene]');
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');

function AnimatedWork({scene,host}:{scene:SceneId;host:HTMLElement}) {
  const player=useRef<PlayerRef>(null);
  const [paused,setPaused]=useState(preference.matches);
  const [phase,setPhase]=useState(0);
  const [visible,setVisible]=useState(false);
  const [foreground,setForeground]=useState(!document.hidden);
  const [failed,setFailed]=useState(false);
  const fallback=host.querySelector<HTMLElement>('.motion-fallback');
  const target=host.querySelector<HTMLElement>('.motion-player');
  const data=scenes[scene];
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting),{threshold:.12});
    observer.observe(host);
    const visibility=()=>setForeground(!document.hidden);
    const reduced=()=>setPaused(preference.matches);
    document.addEventListener('visibilitychange',visibility);
    preference.addEventListener('change',reduced);
    const current=player.current;
    const update=()=>{if(current)setPhase(getPhase(current.getCurrentFrame()));};
    current?.addEventListener('frameupdate',update);
    if(target)target.hidden=false;
    if(fallback)fallback.hidden=true;
    host.classList.add('motion-ready');
    return ()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility);preference.removeEventListener('change',reduced);current?.removeEventListener('frameupdate',update);host.classList.remove('motion-ready');if(fallback)fallback.hidden=false;};
  },[host,fallback,target]);
  useEffect(()=>{
    if(!player.current)return;
    if(visible&&foreground&&!paused&&!failed)player.current.play();
    else player.current.pause();
  },[visible,foreground,paused,failed]);
  useEffect(()=>{
    if(!failed)return;
    if(fallback)fallback.hidden=false;
    if(target)target.hidden=true;
    host.classList.remove('motion-ready');
  },[failed,fallback,target,host]);
  const errorFallback=React.useCallback(()=>{window.setTimeout(()=>setFailed(true),0);return null;},[]);
  const select=(index:number)=>{setPaused(true);player.current?.pause();player.current?.seekTo(index*PHASE_FRAMES+30);setPhase(index);};
  return <>
    <div className="infographic-visual">
      <div aria-hidden="true"><Player ref={player} component={Infographic} inputProps={{scene}} durationInFrames={DURATION} fps={FPS} compositionWidth={640} compositionHeight={560} style={{width:'100%',aspectRatio:'8 / 7'}} controls={false} autoPlay={false} loop initiallyMuted numberOfSharedAudioTags={0} clickToPlay={false} doubleClickToFullscreen={false} spaceKeyToPlayOrPause={false} errorFallback={errorFallback}/></div>
      <button className="infographic-motion-control" type="button" aria-label={paused?'Reproduzir infográfico':'Pausar infográfico'} aria-pressed={paused} onClick={()=>setPaused(value=>!value)}><Glyph name={paused?'play':'pause'} size={18}/></button>
    </div>
    <div className="infographic-controls">
      <div className="infographic-steps" role="group" aria-label="Etapas do exemplo">{data.phases.map(([label],i)=><button key={label} type="button" aria-pressed={i===phase} onClick={()=>select(i)}><span>{i+1}</span>{label}</button>)}</div>
    </div>
    <p className="infographic-caption">{data.phases[phase][1]}</p>
  </>;
}

if(mount) {
  const scene=mount.dataset.motionScene as SceneId;
  const target=mount.querySelector<HTMLElement>('.motion-player');
  if(target && Object.hasOwn(scenes,scene)) {
    const root=createRoot(target,{onUncaughtError:()=>{
      target.hidden=true;
      const fallback=mount.querySelector<HTMLElement>('.motion-fallback');
      if(fallback)fallback.hidden=false;
      mount.classList.remove('motion-ready');
    }});
    root.render(<AnimatedWork scene={scene} host={mount}/>);
    window.addEventListener('pagehide',event=>{if(!event.persisted)root.unmount();});
  }
}
