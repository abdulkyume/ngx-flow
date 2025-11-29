import { InjectionToken } from '@angular/core';
import { NodeComponentType } from '../types/component-types';

export const NGX_WORKFLOW_NODE_TYPES = new InjectionToken<Record<string, NodeComponentType>>('NGX_WORKFLOW_NODE_TYPES');