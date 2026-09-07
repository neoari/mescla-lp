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

const Paper: React.FC<{children: React.ReactNode; x: number; y: number; w?: number; h?: number; color?: string; angle?: number; depth?: number; opacity?: number; padding?: number}> = ({children,x,y,w=290,h=245,color=white,angle=0,depth=0,opacity=1,padding=w<190?20:27}) => {
  const frame=useContext(MotionFrame);
  const offset=(x+y)*.012;
  return <div style={{position:'absolute',left:x,top:y,width:w,height:h,padding,background:color,border:'1px solid #1B193024',borderRadius:12,boxShadow:'0 2px 0 #c9c3cf, 0 5px 0 #d8d2df, 0 26px 40px #1b193019',transform:`perspective(950px) translateY(${Math.sin(frame*.085+offset)*6}px) rotateY(${angle+Math.sin(frame*.055+offset)*4}deg) rotateX(${8+Math.cos(frame*.07+offset)*2}deg) translateZ(${depth}px)`,transformStyle:'preserve-3d',opacity,color:ink}}>{children}</div>;
};
const Connector: React.FC<{frame:number;y?:number}> = ({frame,y=292}) =>
  <svg viewBox="0 0 540 40" style={{position:'absolute',top:y,left:50,width:540,height:40,overflow:'visible'}} aria-hidden="true"><path d="M 0 20 H 540" fill="none" stroke="#9CACA4" strokeWidth="2" strokeDasharray="6 8"/><circle cx={interpolate(frame,[145,295],[0,540],ease)} cy="20" r="7" fill={mint} opacity={interpolate(frame,[140,160,288,302],[0,1,1,0],ease)}/></svg>;

type SectorId = Exclude<SceneId,'home'|'creators'>;
const SectorStage: React.FC<{scene:SectorId;frame:number}> = ({scene,frame}) => {
  const phase=getPhase(frame,scene);
  const person=scenes[scene].roles[phase]==='human';
  return <div data-sector-stage={phase} data-role={person?'human':'agent'} style={{position:'absolute',left:35,right:35,bottom:25}}>
    <div style={{display:'flex',gap:12,alignItems:'center',fontSize:25,padding:'12px 16px',borderRadius:9,background:person?'#FFF0CC':'#CCEEE5',color:ink}}><Glyph name={person?'user-round':'bot'} size={29}/><strong style={{fontWeight:500}}>{scenes[scene].phases[phase][0]}</strong><span style={{marginLeft:'auto',fontSize:22}}>{person?'Pessoa':'Agente'}</span></div>
    <div style={{display:'flex',gap:7,marginTop:14}}>{scenes[scene].phases.map(([label],i)=><span key={label} style={{height:4,flex:1,borderRadius:4,background:i===phase?scenes[scene].accent:'#1B19302A'}}/>)}</div>
  </div>;
};

function Founder({frame}:{frame:number}) {
  const phase=getPhase(frame,'empreendedores');
  const titles=['Pedido de orçamento','Proposta editável','Condições comerciais','Retorno preparado','A conversa continua'];
  const rows=[['Necessidade do cliente','Prazo e contexto','Sua oferta de serviço'],['Resumo e lacunas','Escopo da sua oferta','Condições fornecidas'],['Escopo e preço','Prazo e condições','Sua aprovação'],['Mensagem com contexto','Tarefa de acompanhamento','Envio se autorizado'],['Negociação com o cliente','Exceções decididas por você','Condições confirmadas']];
  return <>
    <div style={{position:'absolute',left:45,right:45,top:89,display:'flex',gap:14,alignItems:'center',fontSize:25,color:'#795721'}}><Glyph name="whatsapp" color="#17813C" size={34}/>Pedido → proposta → retorno</div>
    <Paper x={76+Math.sin(frame*.05)*8} y={145} w={490} h={290} padding={22} angle={-5+phase*2} color="#FFFCF5">
      <div style={{display:'flex',gap:14,alignItems:'center',fontSize:24,color:'#795721'}}><Glyph name={phase===2?'user-round':'file-text'} size={32}/>{phase===2?'Você confere':'Exemplo de trabalho'}</div>
      <div style={{fontFamily:serif,fontSize:35,lineHeight:1.08,marginTop:17}}>{titles[phase]}</div>
      <div style={{marginTop:18}}>{rows[phase].map((line,i)=><div key={line} style={{fontSize:23,lineHeight:1.25,marginTop:7,paddingLeft:14,borderLeft:`3px solid ${i===phase%3?mint:amber}`,translate:interpolate(frame%PHASE_FRAMES,[0,15],['8px 0px','0px 0px'],ease)}}>{line}</div>)}</div>
    </Paper>
    <SectorStage scene="empreendedores" frame={frame}/>
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
  const phase=getPhase(frame,'consultorias');
  const output=phase>=3;
  return <>
    <div style={{position:'absolute',left:38,right:38,top:90,display:'flex',justifyContent:'space-between',gap:15}}>{[['file-text','Entrevistas'],['googlesheets','Planilhas'],['googledocs','Documentos']].map(([icon,label],i)=><div key={label} style={{fontSize:22,display:'flex',gap:8,alignItems:'center',color:'#246163',translate:`0px ${Math.sin(frame*.09+i)*3}px`}}><Glyph name={icon} size={30}/>{label}</div>)}</div>
    <Paper x={48} y={145} w={542} h={290} padding={22} angle={Math.sin(frame*.025)*5} color="#F8FCFA">
      <div style={{display:'flex',gap:14,alignItems:'center',color:'#246163',fontSize:23}}><Glyph name={output?'presentation':'network'} size={31}/>{output?'Arquivo editável':'Base para conferir'}</div>
      <div style={{fontFamily:serif,fontSize:35,lineHeight:1.1,marginTop:15}}>{output?'Suas recomendações.':'Matriz de evidências.'}</div>
      <div style={{marginTop:18,borderTop:'1px solid #B5CFC4'}}>{(output?[['Estrutura','Modelo da consultoria'],['Conclusões','Formuladas pelo consultor'],['Revisão','Antes da entrega']]:[['Entrevista','Tema + trecho'],['Planilha','Dado + origem'],['Conferência','Lacunas e divergências']]).map(([left,right],i)=><div key={left} style={{display:'grid',gridTemplateColumns:'140px 1fr',gap:17,padding:'7px 5px',borderBottom:'1px solid #CDDFD7',background:i===phase%3?'#DBEEE6':'transparent',fontSize:23}}><strong style={{fontWeight:500}}>{left}</strong><span>{right}</span></div>)}</div>
    </Paper>
    <SectorStage scene="consultorias" frame={frame}/>
  </>;
}

function Agency({frame}:{frame:number}) {
  const phase=getPhase(frame,'agencias');
  const lane=phase===0?0:phase===4?2:1;
  return <>
    <div style={{position:'absolute',left:35,top:88,width:570,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,transform:`perspective(1000px) rotateX(${7+Math.sin(frame*.04)*3}deg)`}}>{['Entrada','Produção','Aprovação'].map((label,i)=><div key={label} style={{height:326,padding:'20px 12px',background:i===lane?'#F2D5C8':'#EFE5E0',borderTop:`4px solid ${i===lane?'#AA3425':'#C7A99D'}`,borderRadius:10,fontSize:24,color:'#763C30'}}>{label}</div>)}</div>
    <Paper x={54+lane*145+interpolate(frame%PHASE_FRAMES,[0,18],[-15,0],ease)} y={145} w={270} h={282} padding={22} angle={lane===0?-8:lane===2?5:-2} color="#FFFCF8">
      <div style={{display:'flex',gap:10,alignItems:'center',fontSize:20,color:'#8C3B2E'}}><Glyph name={phase===2?'pencil-ruler':'file-text'} size={27}/>Peça de exemplo</div>
      <div style={{fontFamily:serif,fontSize:29,lineHeight:1.13,marginTop:18}}>{['Briefing e modelo','Texto + peça adaptada','Trocar a chamada','Ajuste aplicado','Versão para aprovar'][phase]}</div>
      <div style={{fontSize:22,lineHeight:1.3,marginTop:18,paddingTop:14,borderTop:'1px solid #DBB9A9'}}>{['Objetivo + referências','Primeira rodada','Feedback da criação','Na versão correspondente','Conferência e liberação'][phase]}</div>
    </Paper>
    <SectorStage scene="agencias" frame={frame}/>
  </>;
}

function Legal({frame}:{frame:number}) {
  const phase=getPhase(frame,'advocacia');
  const titles=['Documentos autorizados','Índice e cronologia','Análise do advogado','Minuta orientada','Revisão profissional'];
  const rows=[['Materiais do caso','Perguntas e permissões','Modelo do escritório'],['Registro → documento','Localização disponível','Lacunas para conferir'],['Fontes conferidas','Fatos interpretados','Orientação da minuta'],['Fatos + instruções','Modelo do escritório','Arquivo editável'],['Conferir texto e fontes','Decidir o uso','Prazos e protocolo: pessoa']];
  return <>
    <div style={{position:'absolute',left:45,top:91,display:'flex',gap:12,alignItems:'center',fontSize:23,color:'#6B3343'}}><Glyph name="scale" size={32}/>Preparação com conferência profissional</div>
    <Paper x={65} y={145} w={510} h={290} padding={22} color="#FFFCFD" angle={-4+Math.sin(frame*.03)*4}>
      <div style={{display:'flex',gap:13,alignItems:'center',fontSize:22,color:'#6B3343'}}><Glyph name={phase>=3?'microsoftword':'adobeacrobatreader'} size={31}/>{phase>=3?'Documento para revisar':'Material de trabalho'}</div>
      <div style={{fontFamily:serif,fontSize:35,lineHeight:1.08,marginTop:17}}>{titles[phase]}</div>
      <div style={{marginTop:18}}>{rows[phase].map((line,i)=><div key={line} style={{display:'flex',gap:16,fontSize:23,lineHeight:1.25,marginTop:8,borderBottom:'1px solid #E0D4DA',paddingBottom:5}}><span style={{color:'#865466',fontSize:21}}>{i+1}</span>{line}</div>)}</div>
    </Paper>
    <SectorStage scene="advocacia" frame={frame}/>
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
    <div style={{position:'absolute',left:36,right:36,top:29,display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:23,gap:20}}><span>{data.label}</span><span style={{fontSize:18,opacity:.75}}>{scene==='advocacia'?'Exemplo com minuta':'Exemplo de fluxo'}</span></div>
    <MotionFrame.Provider value={frame}><View frame={scene==='home'?frame*STORY_FRAMES/DURATION:frame}/></MotionFrame.Provider>
    <div style={{position:'absolute',left:0,bottom:0,height:4,width:interpolate(frame,[0,getDuration(scene)-1],[0,640],ease),background:scene==='creators'?mint:data.accent}}/>
  </AbsoluteFill>;
};

export const Infographic: React.FC<{scene:SceneId}> = ({scene}) => <InfographicFrame scene={scene} frame={useCurrentFrame()}/>;
