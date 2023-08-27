import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UnauthorizedGuard } from './authorization/unathorized.guard';

const routes: Routes = [
  { path: 'app', loadChildren: () => import('./header/header.module').then(m => m.HeaderModule) },
  {
    path: 'authorization',
    canActivate: [UnauthorizedGuard],
    loadChildren: () => import('./authorization/authorization.module').then(m => m.AuthorizationModule),
  },
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  { path: '**', redirectTo: 'app' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
