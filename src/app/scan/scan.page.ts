import { Component, OnInit } from '@angular/core';
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
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { close, scan, scanCircle } from 'ionicons/icons';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';

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
export class ScanPage implements OnInit {
  html5Qrcode: any;
  html5QrcodeScanner: any;
  scannedText: string = '';
  scannedResult: any = null;

  constructor() {
    addIcons({ close, scan, scanCircle });
  }

  ngOnInit() {}

  scan() {
    console.log('Scan 1 button clicked!');

    this.html5QrcodeScanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: 250 },
      false
    );

    this.scannedText = '';
    this.scannedResult = null;

    this.html5QrcodeScanner.render(
      this.onScanSuccess.bind(this),
      this.onScanError.bind(this)
    );
  }

  scan2() {
    console.log('Scan 2 button clicked!');

    this.scannedText = '';
    this.scannedResult = null;

    this.html5Qrcode = new Html5Qrcode('reader');
    this.html5Qrcode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 250 },
      this.onScanSuccess2.bind(this),
      this.onScanError.bind(this)
    );
  }

  closeScan() {
    if (this.html5Qrcode) {
      this.html5Qrcode.stop();
      this.html5Qrcode = undefined;
    }
    if (this.html5QrcodeScanner) {
      this.html5QrcodeScanner.clear();
      this.html5QrcodeScanner = undefined;
    }
  }

  onScanSuccess(decodedText: any, decodedResult: any) {
    // Handle on success condition with the decoded text or result.
    console.log(`Scan result: ${decodedText}`, decodedResult);
    this.beepScannerSound();
    // setTimeout(() => {
    this.scannedText = decodedText;
    this.scannedResult = decodedResult;
    // }, 100);
    this.html5QrcodeScanner.clear();
    this.html5QrcodeScanner = undefined;
  }

  onScanSuccess2(decodedText: any, decodedResult: any) {
    // Handle on success condition with the decoded text or result.
    console.log(`Scan result: ${decodedText}`, decodedResult);
    this.beepScannerSound();
    setTimeout(() => {
      this.scannedText = decodedText;
      this.scannedResult = decodedResult;
    }, 100);
    this.html5Qrcode.stop();
    this.html5Qrcode = undefined;
  }

  onScanError(errorMessage: string) {
    if (!errorMessage.includes('error = NotFoundException')) {
      console.error(`Scan error: ${errorMessage}`);
    }
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
