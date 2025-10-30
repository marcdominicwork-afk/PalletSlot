import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/50 transition-opacity"
        (click)="closeDialog()"
      ></div>
      
      <!-- Dialog Content -->
      <div class="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 z-50">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: []
})
export class DialogComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  closeDialog() {
    this.open = false;
    this.openChange.emit(false);
  }
}

@Component({
  selector: 'app-dialog-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col space-y-1.5 text-center sm:text-left p-6">
      <ng-content></ng-content>
    </div>
  `
})
export class DialogHeaderComponent {}

@Component({
  selector: 'app-dialog-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-lg font-semibold leading-none tracking-tight">
      <ng-content></ng-content>
    </h2>
  `
})
export class DialogTitleComponent {}

@Component({
  selector: 'app-dialog-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 pt-0">
      <ng-content></ng-content>
    </div>
  `
})
export class DialogContentComponent {}

@Component({
  selector: 'app-dialog-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0">
      <ng-content></ng-content>
    </div>
  `
})
export class DialogFooterComponent {}
