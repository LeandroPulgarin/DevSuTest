/* eslint-disable @typescript-eslint/no-explicit-any */
import { OverlayRef } from '@angular/cdk/overlay';
import { DialogRef } from './dialog-ref';

describe('DialogRef', () => {
  let overlayRef: OverlayRef;
  let dialogRef: DialogRef;

  beforeEach(() => {
    overlayRef = jasmine.createSpyObj('OverlayRef', ['dispose']);
    dialogRef = new DialogRef(overlayRef);
  });

  it('should close the dialog and emit the result', () => {
    const result = 'test result';
    let emittedResult: any;
    dialogRef.afterClosed().subscribe(res => emittedResult = res);

    dialogRef.close(result);

    expect(overlayRef.dispose).toHaveBeenCalled();
    expect(emittedResult).toBe(result);
  });

  it('should complete the afterClosed observable', () => {
    let completed = false;
    dialogRef.afterClosed().subscribe({
      complete: () => completed = true
    });

    dialogRef.close();

    expect(completed).toBeTrue();
  });
});
