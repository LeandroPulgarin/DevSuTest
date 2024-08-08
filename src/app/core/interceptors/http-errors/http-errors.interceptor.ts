import type {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ErrorMessages } from './error-messges';
import { inject } from '@angular/core';
import { NotificationService } from '@shared/services/notifications/notifications.service';

export const httpErrorsInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = ErrorMessages[error.status] || ErrorMessages['default'];
      }

      notificationService.showNotification({
        message: errorMessage,
        severity: 'error',
      });

      return throwError(() => new Error(errorMessage));
    })
  );
};
