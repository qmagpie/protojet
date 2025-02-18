import {
  AfterContentInit,
  Component,
  ElementRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class SignaturePage implements AfterContentInit {
  signatureCanvas =
    viewChild.required<ElementRef<HTMLCanvasElement>>('signatureCanvas');
  signaturePad!: SignaturePad;

  constructor() {}

  // ionViewWillEnter() {
  //   this.resizeCanvas();
  // }

  ngAfterContentInit(): void {
    const canvasEl: HTMLCanvasElement = this.signatureCanvas().nativeElement;
    this.signaturePad = new SignaturePad(canvasEl, {
      backgroundColor: '#ffffff',
      penColor: 'rgb(0, 0, 0)',
    });
  }

  private resizeCanvas() {
    const canvasEl: HTMLCanvasElement = this.signatureCanvas().nativeElement;
    let ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvasEl.width = canvasEl.offsetWidth * ratio;
    canvasEl.height = canvasEl.offsetHeight * ratio;
    canvasEl.getContext('2d')!.scale(ratio, ratio);
    this.signaturePad.clear(); // clear the pad on resize
  }

  clearSignature() {
    this.signaturePad.clear();
  }

  saveSignature() {
    const data = this.signaturePad.toDataURL();
    console.log(data);
  }
}
