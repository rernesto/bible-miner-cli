import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  // { path: 'help', loadChildren: './help/help.module#HelpPageModule' }
  // ,
  // { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  // { path: 'contact', loadChildren: './contact/contact.module#ContactPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
