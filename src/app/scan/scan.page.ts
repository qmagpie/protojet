import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { scan, scanCircle } from 'ionicons/icons';

import { ScanModalComponent } from './scan-modal.component';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonMenuButton,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class ScanPage {
  scannedText: string = '';
  scannedResult: any = null;

  private modalCtrl = inject(ModalController);

  constructor() {
    addIcons({ scan, scanCircle });
  }

  scan() {
    this.scannedText = '';
    this.scannedResult = null;

    this.openModalScan(true);
  }

  scan2() {
    this.scannedText = '';
    this.scannedResult = null;

    this.openModalScan(false);
  }

  async openModalScan(withUI: boolean) {
    const modal = await this.modalCtrl.create({
      component: ScanModalComponent,
      componentProps: {
        withUI: withUI,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'scan') {
      this.scannedText = data.scannedText;
      this.scannedResult = data.scannedResult;
    }
  }
}
