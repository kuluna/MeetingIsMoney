import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { MeetComponent } from './meet/meet.component';
import { GenerateComponent } from './generate/generate.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'meet/:id', component: MeetComponent },
  { path: 'generate', component: GenerateComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
