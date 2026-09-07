import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import scenes from '../../content/motion-scenes.json';
import {marks} from './marks';

export type SceneId = keyof typeof scenes;
export const DURATION = 210;
export const PHASE_FRAMES = 70;
const STORY_FRAMES = 450;
const MotionFrame = createContext(0);
export const FPS = 30;
export const getDuration = (scene: SceneId) => scenes[scene].phases.length * PHASE_FRAMES;
export const getPhase = (frame: number, scene: SceneId = 'home') => Math.min(scenes[scene].phases.length - 1, Math.max(0, Math.floor(frame / PHASE_FRAMES)));
const storyPhase = (frame: number) => Math.min(2, Math.floor(frame / 150));
const ease = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.22,1,.36,1)} as const;
const ink = '#1B1930', amber = '#F2B84B', mint = '#6FD9C9', white = '#FBFAFD';
const serif = "'Fraunces', Georgia, serif";

export const Glyph: React.FC<{name: string; size?: number; color?: string}> = ({name, size=40, color='currentColor'}) =>
  <span aria-hidden="true" style={{display:'inline-flex', flexShrink:0, width:size, height:size, color, fill:'currentColor'}} dangerouslySetInnerHTML={{__html:marks[name] || ''}} />;

const Paper: React.FC<{children: React.ReactNode; x: number; y: number; w?: number; h?: number; color?: string; angle?: number; depth?: number; opacity?: number}> = ({children,x,y,w=290,h=245,color=white,angle=0,depth=0,opacity=1}) => {
  const frame=useContext(MotionFrame);
  const offset=(x+y)*.012;
  return <div style={{position:'absolute',left:x,top:y,width:w,height:h,padding:w<190?20:27,background:color,border:'1px solid #1B193024',borderRadius:12,boxShadow:'0 2px 0 #c9c3cf, 0 5px 0 #d8d2df, 0 26px 40px #1b193019',transform:`perspective(950px) translateY(${Math.sin(frame*.085+offset)*6}px) rotateY(${angle+Math.sin(frame*.055+offset)*4}deg) rotateX(${8+Math.cos(frame*.07+offset)*2}deg) translateZ(${depth}px)`,transformStyle:'preserve-3d',opacity,color:ink}}>{children}</div>;
};
const Small: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{fontSize:25,lineHeight:1.3,marginTop:15,color:'#625F72'}}>{children}</div>;
const Heading: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{fontFamily:serif,fontWeight:500,fontSize:39,lineHeight:1.08,letterSpacing:'-.035em',marginTop:18}}>{children}</div>;
const Approval: React.FC<{label?: string; color?: string; frame: number}> = ({label='Sua revisão',color=amber,frame}) =>
  <div style={{position:'absolute',bottom:33,left:38,display:'flex',alignItems:'center',gap:13,padding:'12px 19px',background:color,borderRadius:30,fontSize:25,color:ink,opacity:interpolate(frame,[303,328],[0,1],ease),translate:interpolate(frame,[303,328],['0px 14px','0px 0px'],ease)}}><Glyph name="user-round" size={29}/>{label}</div>;
const Agent: React.FC<{frame:number; x?:number; y?:number; label?:string}> = ({frame,x=275,y=240,label='Preparação'}) =>
  <div style={{position:'absolute',left:x,top:y,textAlign:'center',opacity:interpolate(frame,[140,166,280,307],[0,1,1,0],ease),translate:interpolate(frame,[140,166],['0px 20px','0px 0px'],ease)}}><div style={{width:88,height:88,display:'grid',placeItems:'center',borderRadius:25,background:mint,boxShadow:'0 8px 0 #3a9e8f, 0 18px 25px #1b19301c',transform:`perspective(600px) rotateY(${Math.sin(frame/24)*18}deg)`}}><Glyph name="bot" size={45}/></div><div style={{fontSize:23,marginTop:19,fontWeight:500}}>{label}</div></div>;
const Connector: React.FC<{frame:number;y?:number}> = ({frame,y=292}) =>
  <svg viewBox="0 0 540 40" style={{position:'absolute',top:y,left:50,width:540,height:40,overflow:'visible'}} aria-hidden="true"><path d="M 0 20 H 540" fill="none" stroke="#9CACA4" strokeWidth="2" strokeDasharray="6 8"/><circle cx={interpolate(frame,[145,295],[0,540],ease)} cy="20" r="7" fill={mint} opacity={interpolate(frame,[140,160,288,302],[0,1,1,0],ease)}/></svg>;

function Founder({frame}:{frame:number}) {
  return <>
    <Connector frame={frame}/>
    <Paper x={interpolate(frame,[115,165],[156,27],ease)} y={interpolate(frame,[115,165],[125,139],ease)} w={275} h={270} angle={interpolate(frame,[0,150,300],[-12,-20,-7],ease)} opacity={interpolate(frame,[280,312],[1,.28],ease)}>
      <Glyph name="whatsapp" size={43} color="#17813C"/><Heading>Um cliente.<br/>Um pedido.</Heading><Small>Pedido + contexto</Small>
    </Paper>
    <Agent frame={frame} x={290} y={202} label="Organizar"/>
    <Paper x={interpolate(frame,[255,326],[700,266],ease)} y={116} w={323} h={309} angle={interpolate(frame,[270,350],[22,3],ease)} color="#FFF9ED">
      <Glyph name="googledocs" size={40} color="#356AC3"/><Heading>Proposta<br/>comercial</Heading><Small>Objetivo<br/>Escopo<br/>Próximo passo</Small>
    </Paper>
    <Approval frame={frame} label="Você decide o próximo passo"/>
  </>;
}

function Creator({frame}:{frame:number}) {
  const phase=getPhase(frame,'creators');
  const local=frame-phase*PHASE_FRAMES;
  const human=scenes.creators.roles[phase]==='human';
  const colour=human?amber:mint;
  const cards=[
    {title:'Um roteiro com a sua voz.',items:['Pauta e referências','Gancho e sequência','Texto para gravar']},
    {title:'Você entra em cena.',items:['Sua presença','Suas histórias','Seu jeito de contar']},
    {title:'A edição ganha ritmo.',items:['Cortes e montagem','Remoção de silêncios','Ajuste de cor','Grafismos e animações','Melhoria do som','Legendas sincronizadas']},
    {title:'O vídeo passa por você.',items:['Assista à versão','Peça os ajustes','Aprove para publicar']},
    {title:'Aprovou? Vai para o canal.',items:['YouTube','TikTok','Instagram']},
  ];
  const current=cards[phase];
  return <>
    <div style={{position:'absolute',left:48,top:97,width:2,height:356,background:'#665C78'}}/>
    {scenes.creators.phases.map(([title],i)=>{
      const person=scenes.creators.roles[i]==='human';
      const active=i===phase;
      const tint=person?amber:mint;
      return <div key={title} data-creator-stage={i} data-active={active} data-role={person?'human':'agent'} style={{position:'absolute',left:30,top:89+i*76,width:220,height:66,padding:'10px 12px',display:'flex',alignItems:'center',gap:12,borderRadius:12,border:`1px solid ${active?tint:'#645A77'}`,background:active?'#3A344B':'#282238',transform:`translateX(${active?interpolate(local,[0,15],[0,7],ease):0}px)`,boxShadow:active?`0 3px 0 ${tint}40`:'none'}}>
        <Glyph name={person?'user-round':'bot'} color={tint} size={30}/><div><div style={{fontSize:27,fontWeight:500}}>{title}</div><div style={{fontSize:20,color:tint}}>{person?'Pessoa':'Agente'}</div></div>
      </div>;
    })}
    <div data-creator-delivery={phase} style={{position:'absolute',left:278,top:90,width:330,height:374,padding:24,borderRadius:15,background:'#FBFAFD',color:ink,borderBottom:`5px solid ${colour}`,boxShadow:'0 8px 0 #51445e, 0 24px 35px #0003',transform:`perspective(1000px) rotateY(${Math.sin(frame*.06)*4}deg) rotateX(4deg) translateY(${Math.sin(frame*.085)*4}px)`}}>
      <div style={{display:'flex',alignItems:'center',gap:10,fontSize:22,fontWeight:500,color:'#51465E'}}><Glyph name={human?'user-round':'bot'} size={28}/>{human?'Você decide':'Seu agente executa'}</div>
      <div style={{fontFamily:serif,fontSize:34,lineHeight:1.08,letterSpacing:'-.03em',marginTop:16,minHeight:74}}>{current.title}</div>
      <div style={{marginTop:14}}>{current.items.map((item,i)=><div key={item} style={{display:'flex',alignItems:'center',gap:10,fontSize:phase===2?23:24,lineHeight:1.18,marginTop:phase===2?3:14,translate:`${interpolate(local,[i*3,i*3+15],[9,0],ease)}px 0px`}}><span style={{width:7,height:7,borderRadius:'50%',background:human?'#936410':'#267369',flexShrink:0}}/>{item}</div>)}</div>
      {phase!==2&&<div aria-hidden="true" style={{display:'flex',gap:5,alignItems:'center',height:44,marginTop:22}}>{Array.from({length:27},(_,i)=><span key={i} style={{width:5,height:8+Math.abs(Math.sin(i*1.9+frame*.18))*30,borderRadius:3,background:i%4===0?amber:mint}}/>)}</div>}
    </div>
    <div style={{position:'absolute',left:36,right:36,top:497,display:'flex',gap:12,alignItems:'center',fontSize:23,color:'#E0D9EA'}}><Glyph name="user-round" size={25} color={amber}/>Publicação depois da sua aprovação.</div>
  </>;
}

function Consulting({frame}:{frame:number}) {
  const inputs=[['googlesheets','Dados'],['file-text','Entrevistas'],['googledocs','Documentos']];
  return <>
    {inputs.map(([icon,label],i)=><Paper key={label} x={interpolate(frame,[120,185],[100+i*54,22+i*10],ease)} y={104+i*65} w={340} h={154} angle={-9+i*4} opacity={interpolate(frame,[265,318],[1,.24],ease)}><div style={{display:'flex',alignItems:'center',gap:20,fontSize:31}}><Glyph name={icon} color="#246163"/>{label}</div></Paper>)}
    <Agent frame={frame} x={340} y={237} label="Conectar fontes"/>
    <Paper x={interpolate(frame,[268,327],[650,184],ease)} y={89} w={401} h={340} angle={interpolate(frame,[275,345],[18,2],ease)} color="#F8FCFA">
      <div style={{display:'flex',alignItems:'center',gap:15,fontSize:26,color:'#246163'}}><Glyph name="presentation" size={35}/>Caderno de projeto</div>
      <Heading>Base para<br/>a recomendação.</Heading>
      <div style={{marginTop:26,paddingTop:18,borderTop:'1px solid #B9D1C9',fontSize:26,lineHeight:1.6}}>Evidência → fonte<br/>Pergunta → análise</div>
    </Paper>
    <Approval frame={frame} label="O consultor interpreta" color={mint}/>
  </>;
}

function Agency({frame}:{frame:number}) {
  const phase=storyPhase(frame);
  return <>
    <div style={{position:'absolute',left:35,top:102,width:570,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:15,transform:`perspective(1000px) rotateX(${12+Math.sin(frame/38)*3}deg) rotateY(${Math.sin(frame/45)*2}deg)`,transformStyle:'preserve-3d'}}>{['Briefing','Produção','Revisão'].map((label,i)=><div key={label} style={{background:i===phase?'#E8CBC0':'#EDE6E5',height:308,borderRadius:10,borderTop:`4px solid ${[amber,mint,'#CF3E27'][i]}`,padding:'21px 14px',fontSize:25,color:'#5E4544'}}>{label}</div>)}</div>
    <Paper x={interpolate(frame,[115,170,270,330],[47,237,237,424],ease)} y={174} w={165} h={224} angle={interpolate(frame,[0,115,170,270,330],[-10,-10,8,8,0],ease)} color={phase===2?'#FFF8F1':white}>
      <Glyph name={phase===0?'trello':phase===1?'file-text':'pencil-ruler'} size={34} color="#AA3425"/>
      <div style={{fontFamily:serif,fontSize:29,lineHeight:1.12,marginTop:26}}>{phase===0?'Contexto da conta':phase===1?'Primeiras versões':'Escolha criativa'}</div>
    </Paper>
    <div style={{position:'absolute',left:38,top:440,fontSize:24,color:'#8C3B2E',opacity:interpolate(frame,[125,163,280,306],[0,1,1,0],ease),display:'flex',alignItems:'center',gap:12}}><Glyph name="bot" size={31}/>O contexto da marca acompanha.</div>
    <Approval frame={frame} label="A direção criativa é sua" color="#F9C6B9"/>
  </>;
}

function Legal({frame}:{frame:number}) {
  return <>
    {[['adobeacrobatreader','Documentos'],['microsoftword','Modelos']].map(([icon,label],i)=><Paper key={label} x={interpolate(frame,[120,177],[130+i*55,30+i*20],ease)} y={123+i*80} w={305} h={188} angle={-14+i*13} opacity={interpolate(frame,[268,313],[1,.2],ease)}><Glyph name={icon} size={36} color="#6B3343"/><div style={{fontFamily:serif,fontSize:36,marginTop:18}}>{label}</div></Paper>)}
    <Agent frame={frame} x={360} y={230} label="Referenciar"/>
    <Paper x={interpolate(frame,[267,326],[650,190],ease)} y={91} w={399} h={343} color="#FFFCFD" angle={interpolate(frame,[270,345],[20,0],ease)}>
      <div style={{display:'flex',gap:15,alignItems:'center',color:'#6B3343',fontSize:27}}><Glyph name="scale" size={37}/>Material de trabalho</div>
      <Heading>Cada informação,<br/>com sua origem.</Heading>
      <div style={{fontSize:25,lineHeight:1.5,marginTop:23,paddingLeft:17,borderLeft:'3px solid #A47A89'}}>Índice documental<br/>Cronologia preliminar<br/>Pontos para conferir</div>
    </Paper>
    <Approval frame={frame} label="Conferência pelo advogado" color="#E5D5DD"/>
  </>;
}

function Collaboration({frame}:{frame:number}) {
  const phase=storyPhase(frame);
  return <>
    <Connector frame={frame} y={245}/>
    {[
      {x:48,y:97,icon:'user-round',title:'Comercial',sub:'Registra o pedido',color:amber},
      {x:233,y:157,icon:'bot',title:'Agente do time',sub:'Prepara a proposta',color:mint},
      {x:418,y:97,icon:'user-round',title:'Operação',sub:'Revisa e continua',color:amber}
    ].map((item,i)=><Paper key={item.title} x={item.x} y={item.y+interpolate(frame,[i*150,i*150+35],[14,0],ease)} w={173} h={224} angle={i===0?-14:i===2?14:0} color={item.color} depth={i===phase?17:0}>
      <Glyph name={item.icon} size={39}/><div style={{fontFamily:serif,fontSize:29,lineHeight:1.08,marginTop:23}}>{item.title}</div><div style={{fontSize:22,lineHeight:1.3,marginTop:15}}>{item.sub}</div>
    </Paper>)}
    <div style={{position:'absolute',left:38,right:38,top:423,padding:'18px 22px',background:ink,color:white,borderRadius:12,boxShadow:'0 7px 0 #cfdae0',borderTop:`3px solid ${phase===2?mint:'#554E66'}`,translate:interpolate(frame,[300,335],['0px 5px','0px 0px'],ease)}}>
      <div style={{display:'flex',alignItems:'center',gap:14,fontFamily:serif,fontSize:29}}><Glyph name="file-text" size={28} color={mint}/>Memória da empresa</div>
      <div style={{fontSize:22,color:'#dedbe7',marginTop:10}}>Processos · referências · decisões</div>
    </div>
  </>;
}

const views={home:Collaboration,empreendedores:Founder,creators:Creator,consultorias:Consulting,agencias:Agency,advocacia:Legal};
export const InfographicFrame: React.FC<{scene:SceneId;frame:number}> = ({scene,frame}) => {
  const View=views[scene];
  const data=scenes[scene];
  return <AbsoluteFill className="motion-art" style={{background:data.tint,color:scene==='creators'?white:ink,fontFamily:"'Instrument Sans', Arial, sans-serif",overflow:'hidden',perspective:1100,lineHeight:1.2}}>
    <div style={{position:'absolute',left:36,right:36,top:29,display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:23,gap:20}}><span>{data.label}</span><span style={{fontSize:18,opacity:.75}}>Exemplo de fluxo</span></div>
    <MotionFrame.Provider value={frame}><View frame={scene==='creators'?frame:frame*STORY_FRAMES/DURATION}/></MotionFrame.Provider>
    <div style={{position:'absolute',left:0,bottom:0,height:4,width:interpolate(frame,[0,getDuration(scene)-1],[0,640],ease),background:scene==='creators'?mint:data.accent}}/>
  </AbsoluteFill>;
};

export const Infographic: React.FC<{scene:SceneId}> = ({scene}) => <InfographicFrame scene={scene} frame={useCurrentFrame()}/>;
