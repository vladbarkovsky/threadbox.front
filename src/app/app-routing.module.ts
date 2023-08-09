import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RedirectComponent } from './identity/redirect.component';

const routes: Routes = [
  { path: 'app', loadChildren: () => import('./header/header.module').then(m => m.HeaderModule) },
  { path: 'is4/redirect-uri', component: RedirectComponent, pathMatch: 'full' },
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  { path: '**', redirectTo: 'app' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
