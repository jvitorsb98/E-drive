import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private dialogRef!: MatDialogRef<any> | undefined;

  constructor(private dialog: MatDialog) { }

  openModal<T, D= any, R = any>(component: any, data?: D): Observable<R> {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.dialogRef = this.dialog.open<T, D, R>(component, {
      data
    });
    return this.dialogRef.afterClosed();
  }
}
