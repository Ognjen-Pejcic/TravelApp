import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component:TabsPage, 
    children: [
      // {
      //   path: 'tabs',
        
      //   component: TabsPage
      // },
      { path: '',   redirectTo: '/tabs/feed', pathMatch: 'full' },
      {
        path: 'uploader',
        loadChildren: () => import('../uploader/uploader.module').then(m => m.UploaderPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'feed',
        loadChildren: () => import('../feed/feed.module').then(m => m.FeedPageModule)
      },
      {
        path: 'post/:id',
        loadChildren: () => import('../post/post.module').then( m => m.PostPageModule)
      },
    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
