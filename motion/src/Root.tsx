import "./index.css";
import {Composition} from 'remotion';
import {Infographic, getDuration} from './Infographic';
export const RemotionRoot = () => <>
  <Composition id="Mescla" component={Infographic} width={640} height={560} fps={30} durationInFrames={210} defaultProps={{scene:'home'}}/>
  <Composition id="Empreendedores" component={Infographic} width={640} height={560} fps={30} durationInFrames={getDuration('empreendedores')} defaultProps={{scene:'empreendedores'}}/>
  <Composition id="Creators" component={Infographic} width={640} height={560} fps={30} durationInFrames={getDuration('creators')} defaultProps={{scene:'creators'}}/>
  <Composition id="Consultorias" component={Infographic} width={640} height={560} fps={30} durationInFrames={getDuration('consultorias')} defaultProps={{scene:'consultorias'}}/>
  <Composition id="Agencias" component={Infographic} width={640} height={560} fps={30} durationInFrames={getDuration('agencias')} defaultProps={{scene:'agencias'}}/>
  <Composition id="Advocacia" component={Infographic} width={640} height={560} fps={30} durationInFrames={getDuration('advocacia')} defaultProps={{scene:'advocacia'}}/>
</>;
