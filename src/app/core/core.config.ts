import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { httpErrorsInterceptor } from './interceptors/http-errors/http-errors.interceptor';
import { NotificationService } from '@shared/services/notifications/notifications.service';

export const coreConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([httpErrorsInterceptor])),
    NotificationService,
  ],
};
