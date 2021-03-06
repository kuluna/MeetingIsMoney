import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import localeJA from '@angular/common/locales/ja'

import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/functions';

import { AppComponent } from './app.component';
import { MeetComponent } from './meet/meet.component';
import { GenerateComponent } from './generate/generate.component';
import { LandingComponent } from './landing/landing.component';
import { environment } from 'src/environments/environment';

registerLocaleData(localeJA);

@NgModule({
  declarations: [
    AppComponent,
    MeetComponent,
    GenerateComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireFunctionsModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ja-JP' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
