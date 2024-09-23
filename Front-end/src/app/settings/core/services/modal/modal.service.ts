import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private dialogRef!: MatDialogRef<any> | undefined;

  constructor(private dialog: MatDialog) { }

  openModal<T, D= any, R = any>(component: any, data?: D, options: {width?: string, height?: string, disableClose?: boolean} = {}): Observable<R> {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.dialogRef = this.dialog.open<T, D, R>(component, {
      data,
      width: options.width,
      height: options.height,
      disableClose: options.disableClose ?? false
    });

    return this.dialogRef.afterClosed();
  }
}
