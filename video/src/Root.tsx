import React from 'react';
import { Composition } from 'remotion';
import { DURACAO, FPS } from './coreo';
import { Promo } from './Promo';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Vertical" component={Promo} durationInFrames={DURACAO} fps={FPS} width={1080} height={1920} defaultProps={{ trilha: true }} />
    <Composition id="Feed" component={Promo} durationInFrames={DURACAO} fps={FPS} width={1080} height={1350} defaultProps={{ trilha: true }} />
  </>
);
