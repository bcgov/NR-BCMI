import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app.routes';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent} from './footer/footer.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { EnforcementActionsModule } from './enforcement-actions/enforcement-actions.module';
import { ProponentService } from '@services/proponent.service';
import { ConfigService } from '@services/config.service';
import { GeocoderService } from '@services/geocoder.service';
import { LoggerService } from '@services/logger.service';

// feature modules
import { MapModule } from './map/map.module';
import { ProjectsModule } from '@projects/projects.module';
import { SharedModule } from './shared/shared.module';

import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { PageComponent } from './page/page.component';
import { ContentService } from './services/content-service';
import { ContentDirective } from './services/content-directive';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/cache';

import { environment } from 'environments/environment';
const uri = environment.graphURI;

export function initConfig(configService: ConfigService) {
  return () => configService.init();
}

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AppComponent,
    HomeComponent,
    PageComponent,
    NotFoundComponent,
    ContentDirective
  ],
  imports: [
    TagInputModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ProjectsModule, // <-- module import order matters - https://angular.io/guide/router#module-import-order-matters
    EnforcementActionsModule,
    AppRoutingModule,
    NgbModule,
    NgxPaginationModule,
    NgxPageScrollModule,
    NgxPageScrollCoreModule.forRoot({
      scrollOffset: 50,
      duration: 300,
      easingLogic: Easing
    }),
    MapModule,
    SharedModule,
    RouterModule,
    LeafletModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      multi: true,
      deps: [ConfigService,ContentService]
    },
    ProponentService,
    ContentService,
    CookieService,
    ConfigService,
    GeocoderService,
    LoggerService,
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
 
      return {
        link: httpLink.create({ uri: uri }),
        cache: new InMemoryCache(),
      };
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
export function Easing(t: number, b: number, c: number, d: number): number {
  // easeInOutExpo easing
  if (t === 0) {
    return b;
  }
  if (t === d) {
    return b + c;
  }
  if ((t /= d / 2) < 1) {
    return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
  }

  return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
}
