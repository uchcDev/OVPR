import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CommitmentComponent} from '../app/OVPR/Components/commitment/commitment.component'
import{MainComponent} from '../app/OVPR/Components/main/main.component';

import{SplashScreenComponent} from '../app/OVPR/Screens/splash-screen/splash-screen.component';

import {PaymentsComponent} from '../app/OVPR/Components/payments/payments.component'


import {SearchComponent} from '../app/OVPR/Components/search/search.component'

import {FileUploadComponent} from '../app/OVPR/Components/file-upload/file-upload.component';

import {UserComponent} from '../app/OVPR/Components/user/user.component';

import {TypeComponent} from  '../app/OVPR/Components/type/type.component';

import {TestComponent} from '../app/OVPR/Components/test/test.component';
 
const routes: Routes =
[

{path: '', redirectTo: '/default', pathMatch:'full'},


{path: 'default', component: SplashScreenComponent}, 

//{path: 'default', component: TestComponent}, 

{path: 'Commitment', component:  CommitmentComponent }, 
{path: 'Commitment/:id', component:  CommitmentComponent }, 



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
