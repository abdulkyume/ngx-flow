# Installation Guide for ngx-workflow

This guide will walk you through the steps to install and set up `ngx-workflow` in your Angular project.

## Prerequisites

-   Angular CLI (version 17 or higher)
-   Node.js (LTS version)
-   An existing Angular project (or create a new one using `ng new`)

## Step 1: Install `ngx-workflow`

First, install the `ngx-workflow` library from npm. In your Angular project's root directory, run:

```bash
npm install ngx-workflow
```

## Step 2: Install Layout Algorithm Dependencies (Optional)

If you plan to use the automatic layout features (Dagre or ELK), you will need to install their respective libraries:

```bash
npm install elkjs
npm install --save-dev @types/elkjs # Install TypeScript type definitions (optional)
```

## Step 3: Install UUID for Unique IDs (Optional but Recommended)

`ngx-workflow` internally uses `uuid` for generating unique IDs for nodes and edges. While not strictly required if you provide your own IDs, it's recommended for convenience.

```bash
npm install uuid
npm install --save-dev @types/uuid
```

## Step 4: Import `NgxFlowModule`

For a standalone Angular application (Angular 15+), you need to import `NgxFlowModule` into your `app.config.ts` (or the `providers` array of the component/module where you plan to use `ngx-workflow`).

```typescript
// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFlowModule } from 'ngx-workflow'; // Assuming `ngx-workflow` is installed from npm

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    importProvidersFrom(CommonModule, NgxFlowModule),
    // If you plan to use custom nodes, provide them here:
    // {
    //   provide: NGX_FLOW_NODE_TYPES,
    //   useValue: {
    //     'custom-node-type': YourCustomNodeComponent,
    //   },
    // },
  ]
};
```

If you are using a traditional `NgModule` setup, import `NgxFlowModule` into your `AppModule` or a feature module:

```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgxFlowModule } from 'ngx-workflow'; // Assuming `ngx-workflow` is installed from npm
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgxFlowModule, // Import the NgxFlowModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Step 5: Include Global Styles

`ngx-workflow` uses CSS variables for theming and some basic styles. Ensure these are included in your application's global stylesheet (`src/styles.css` or `src/styles.scss`).

```css
/* src/styles.css */
body {
  margin: 0;
  font-family: sans-serif;
}

/* Default light theme variables */
:root {
  --ngx-workflow-selection-color: #1a192b;
  --ngx-workflow-node-bg: #ffffff;
  --ngx-workflow-node-border: #1a192b;
  --ngx-workflow-node-text-color: #333333;
  --ngx-workflow-edge-color: #b1b1b7;
  --ngx-workflow-source-handle-color: #1a192b;
  --ngx-workflow-source-handle-border: #ffffff;
  --ngx-workflow-target-handle-color: #1a192b;
  --ngx-workflow-target-handle-border: #ffffff;
  --ngx-workflow-handle-valid-target-color: #00ff00;
  --ngx-workflow-handle-valid-target-border: #007f00;
  --ngx-workflow-background-color: #f8f8f8;
}

/* Optional: Dark mode example */
/*
body.dark-mode {
  --ngx-workflow-selection-color: #c9c9c9;
  --ngx-workflow-node-bg: #333333;
  --ngx-workflow-node-border: #eeeeee;
  --ngx-workflow-node-text-color: #ffffff;
  --ngx-workflow-edge-color: #777777;
  --ngx-workflow-source-handle-color: #c9c9c9;
  --ngx-workflow-source-handle-border: #333333;
  --ngx-workflow-target-handle-color: #c9c9c9;
  --ngx-workflow-target-handle-border: #333333;
  --ngx-workflow-handle-valid-target-color: #008000;
  --ngx-workflow-handle-valid-target-border: #004000;
  --ngx-workflow-background-color: #1a192b;
}
*/
```

You are now ready to use `ngx-workflow` in your Angular components! See the [Usage Guide](USAGE.md) for examples.
