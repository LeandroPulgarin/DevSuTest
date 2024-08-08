import { OverlayRef } from '@angular/cdk/overlay';
import { Subject, Observable } from 'rxjs';

export class DialogRef {
  private afterClosedSubject = new Subject<unknown>();

  constructor(private overlayRef: OverlayRef) {}

  public close(result?: unknown) {
    this.overlayRef.dispose();
    this.afterClosedSubject.next(result);
    this.afterClosedSubject.complete();
  }

  public afterClosed(): Observable<unknown> {
    return this.afterClosedSubject.asObservable();
  }
}
