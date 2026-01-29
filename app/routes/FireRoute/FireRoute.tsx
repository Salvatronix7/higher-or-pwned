import type { FC } from 'react';
import { FirePre } from '~/components';
import './FireRoute.css';

export const FireRoute: FC = () => {
  return (
    <div className='fireRouteContainer'>
      <h1 className='fireRouteTitle'>Fire Simulation</h1>
      <FirePre
        width={64}
        height={28}
        fps={30}
        useBottomSeed={false}
        heatSource={{ x: 28, y: 14, size: 6 }}
      />
    </div>
  );
};
