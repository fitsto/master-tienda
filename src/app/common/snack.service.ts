import { Injectable } from '@angular/core';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackService {

  private snackBarOptions: MatSnackBarConfig = new MatSnackBarConfig;

  constructor(
    private snackBar: MatSnackBar
  ) {}
  launch(message: string, action: string, duration: number) {
    this.snackBarOptions.duration = duration;
    this.snackBar.open(message, action, this.snackBarOptions);
  }
}
