import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { AddressesComponent } from './adresses/addresses.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import {
    LoginModalComponent,
    RegisterModalComponent,
    CreateAndEditPersonModalComponent,
    InsertAndEditAddressModalComponent,
    ConfirmateModalComponent
} from './modals/modals.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AddressesComponent,
        LoginModalComponent,
        RegisterModalComponent,
        CreateAndEditPersonModalComponent,
        InsertAndEditAddressModalComponent,
        ConfirmateModalComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ToastrModule.forRoot(),
        HttpClientModule,
        NgxMaskDirective,
        NgxMaskPipe
    ],
    providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        provideAnimations(),
        provideToastr({
            progressBar: true,
            preventDuplicates: true
        }),
        provideNgxMask()
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
