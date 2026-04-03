import * as d3Proj from 'd3-geo-projection';

export const projections: { name: string; fn: () => any; conic?: boolean }[] = [
  { name: 'Interrupted Goode Homolosine', fn: () => d3Proj.geoInterruptedHomolosine().precision(0.1) },
];
