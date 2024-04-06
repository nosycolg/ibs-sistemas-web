import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { routes } from "./app.routes";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

import { provideAnimations } from "@angular/platform-browser/animations";
import { ToastrModule, provideToastr } from "ngx-toastr";
import { provideRouter } from "@angular/router";
import { AddressesComponent } from "./adresses/addresses.component";
import { HomeComponent } from "./home/home.component";
import { FormsModule } from "@angular/forms";
import {
    LoginModalComponent,
    RegisterModalComponent,
    CreatePersonModalComponent,
    ConfirmateModalComponent,
    InsertAddressModalComponent,
    EditPersonModalComponent,
    EditAddressModalComponent,
} from "./modals/modals.component";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";

import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AddressesComponent,
        LoginModalComponent,
        RegisterModalComponent,
        CreatePersonModalComponent,
        InsertAddressModalComponent,
        ConfirmateModalComponent,
        EditPersonModalComponent,
        EditAddressModalComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ToastrModule.forRoot(),
        HttpClientModule,
        NgxMaskDirective,
        NgxMaskPipe,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        provideAnimations(),
        provideToastr({
            progressBar: true,
            preventDuplicates: true,
        }),
        provideNgxMask(),
        HttpClient,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
