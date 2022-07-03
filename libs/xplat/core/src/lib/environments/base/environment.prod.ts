import { IEnvironment } from '@multi/xplat/core';
import { deepMerge } from '@multi/xplat/utils';
import { environmentBase } from './environment.base';

export const environmentProd = deepMerge(environmentBase, <IEnvironment>{
  production: true,
  // customizations here...
});
