import { inject, Component, NgZone, AfterViewInit } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';

@Component({
  selector: 'app-scan-modal',
  templateUrl: './scan-modal.component.html',
  styleUrls: ['./scan-modal.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
  ],
})
export class ScanModalComponent implements AfterViewInit {
  withUI: boolean = false;
  html5Qrcode: any;
  html5QrcodeScanner: any;

  private ngZone = inject(NgZone);
  private modalCtrl = inject(ModalController);

  constructor() {
    addIcons({ close });
    // this.withUI = params.get('withUI');
  }

  ngAfterViewInit(): void {
    if (this.withUI) {
      this.scan();
    } else {
      this.scan2();
    }
  }

  scan() {
    this.ngZone.runOutsideAngular(() => {
      this.html5QrcodeScanner = new Html5QrcodeScanner(
        'reader',
        { fps: 10, qrbox: 250 },
        false
      );

      this.html5QrcodeScanner.render(
        this.onScanSuccess.bind(this),
        this.onScanError.bind(this)
      );
    });
  }

  scan2() {
    this.ngZone.runOutsideAngular(() => {
      this.html5Qrcode = new Html5Qrcode('reader');
      this.html5Qrcode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        this.onScanSuccess2.bind(this),
        this.onScanError.bind(this)
      );
    });
  }

  close() {
    this.ngZone.runOutsideAngular(() => {
      if (this.html5Qrcode) {
        this.html5Qrcode.stop();
        this.html5Qrcode = undefined;
      }
      if (this.html5QrcodeScanner) {
        this.html5QrcodeScanner.clear();
        this.html5QrcodeScanner = undefined;
      }
      this.modalCtrl.dismiss(null, 'cancel');
    });
  }

  onScanSuccess(decodedText: any, decodedResult: any) {
    // Handle on success condition with the decoded text or result.
    console.log(`Scan result: ${decodedText}`, decodedResult);
    this.beepScannerSound();
    this.html5QrcodeScanner.clear();
    this.ngZone.run(() => {
      this.html5QrcodeScanner = undefined;
      this.modalCtrl.dismiss(
        {
          scannedText: decodedText,
          scannedResult: decodedResult,
        },
        'scan'
      );
    });
  }

  onScanSuccess2(decodedText: any, decodedResult: any) {
    // Handle on success condition with the decoded text or result.
    console.log(`Scan result: ${decodedText}`, decodedResult);
    this.beepScannerSound();
    this.html5Qrcode.stop();
    this.ngZone.run(() => {
      this.html5Qrcode = undefined;
      this.modalCtrl.dismiss(
        {
          scannedText: decodedText,
          scannedResult: decodedResult,
        },
        'scan'
      );
    });
  }

  onScanError(errorMessage: string) {
    // if (!errorMessage.includes('error = NotFoundException')) {
    //   console.error(`Scan error: ${errorMessage}`);
    //   this.modalCtrl.dismiss(null, 'cancel');
    // }
  }

  beepScannerSound() {
    const audioCtx = new AudioContext();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.01); // fade in
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1); // fade out

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.15); // short beep
  }
}
