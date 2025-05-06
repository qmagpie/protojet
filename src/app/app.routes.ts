import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/inbox',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },
  {
    path: 'images',
    loadComponent: () =>
      import('./images/images.page').then((m) => m.ImagesPage),
  },
  {
    path: 'signature',
    loadComponent: () =>
      import('./signature/signature.page').then((m) => m.SignaturePage),
  },
  {
    path: 'scan',
    loadComponent: () => import('./scan/scan.page').then((m) => m.ScanPage),
  },
];
