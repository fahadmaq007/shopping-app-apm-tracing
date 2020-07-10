import {Component, Inject} from '@angular/core';
import {ProgressBarService} from '../progress-bar.service';
import {APP_CONFIG, AppConfig} from '../../config/app.config';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  title: string;
  currentDate: number = Date.now();
  appConfig: any;
  menuItems: any[];
  progressBarMode: string;

  constructor(@Inject('state') private state, @Inject(APP_CONFIG) appConfig,
              private progressBarService: ProgressBarService,
              private translateService: TranslateService) {

    this.loadTitle();
    this.appConfig = appConfig;
    this.loadMenus();
    this.progressBarService.updateProgressBar$.subscribe((mode: string) => {
      this.progressBarMode = mode;
    });
  }

  private loadTitle(): void {
    console.log('state', this.state);
    //this.stateService.getCurrentState();
    this.state.title.subscribe((res: string) => {
      this.title = res;
    });
  }

  changeLanguage(language: string): void {
    this.translateService.use(language).subscribe(() => {
      this.loadMenus();
    });
  }

  private loadMenus(): void {
    this.translateService.get(['Pages.Shopping.Title', 'Pages.Order.Title','Pages.Product.Title', 'Pages.Vendor.Title','Pages.Courier.Title'], {}).subscribe((texts: any) => {
      this.menuItems = [
        {link: '/' + AppConfig.routes.product, name: texts['Pages.Product.Title'], color: 'accent'},
        {link: '/' + AppConfig.routes.shopping, name: texts['Pages.Shopping.Title'], color: 'accent'},
        {link: '/' + AppConfig.routes.order, name: texts['Pages.Order.Title'], color: 'warn'},
        // {link: '/' + AppConfig.routes.product, name: texts['Pages.Vendor.Title']},
        // {link: '/' + AppConfig.routes.product, name: texts['Pages.Courier.Title']}
      ];
    });
  }

}
