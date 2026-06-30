import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home';

import { LoginComponent } from './features/auth/login/login';
import { SignupStep1Component } from './features/auth/signup-step1/signup-step1';
import { SignupStep2Component } from './features/auth/signup-step2/signup-step2';
import { CreateUsernameComponent } from './features/auth/create-username/create-username';
import { SetupPinComponent } from './features/auth/setup-pin/setup-pin';
import { DashboardComponent } from './features/dashboard/dashboard';
import { ProfileComponent } from './features/profile/profile';
import { ContactsComponent } from './features/contacts/contacts';
import { ReportsComponent } from './features/reports/reports';
import { SettingsComponent } from './features/settings/settings';
import { TermsComponent } from './features/terms/terms';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  { path: '', component: HomeComponent },

  { path: 'login', component: LoginComponent },

  { path: 'signup-step1', component: SignupStep1Component },

  { path: 'signup-step2', component: SignupStep2Component },

  { path: 'create-username', component: CreateUsernameComponent },

  { path: 'setup-pin', component: SetupPinComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  { path: 'contacts', component: ContactsComponent, canActivate: [authGuard] },

  { path: 'reports', component: ReportsComponent, canActivate: [authGuard] },

  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },

  { path: 'terms', component: TermsComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '' }

];