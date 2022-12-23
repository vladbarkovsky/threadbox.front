import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'header', loadChildren: () => import('./header/header.module').then(m => m.HeaderModule) },
  {
    path: '',
    redirectTo: 'header',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'header',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
