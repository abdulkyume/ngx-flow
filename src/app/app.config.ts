import {
  ApplicationConfig,
  importProvidersFrom,
  provideZonelessChangeDetection,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgxWorkflowModule,
  NGX_WORKFLOW_NODE_TYPES,
  RoundedRectNodeComponent,
  DiagramStateService,
  LayoutService,
  UndoRedoService,
} from 'ngx-workflow';

import { routes } from './app.routes';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),

    importProvidersFrom(CommonModule, NgxWorkflowModule), // Import NgxFlowModule
    DiagramStateService,
    LayoutService,
    UndoRedoService,
    {
      provide: NGX_WORKFLOW_NODE_TYPES,
      useValue: {
        'rounded-rect': RoundedRectNodeComponent,
        // Add other custom node types here for the demo
      },
    },
  ],
};
