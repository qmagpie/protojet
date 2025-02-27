import {
  AfterContentInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  MenuController,
  NavController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
  standalone: true,
  host: {
    '(window:resize)': 'onResize($event)',
    '(window:orientationchange)': 'onResize($event)',
  },
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
    CommonModule,
    HttpClientModule,
  ],
})
export class SignaturePage implements AfterContentInit {
  //@ViewChild('header', { read: ElementRef }) header!: ElementRef;
  header = viewChild.required('header', { read: ElementRef });
  //@ViewChild('buttons') buttons!: ElementRef;
  buttons = viewChild.required('buttons', { read: ElementRef });

  signatureCanvas =
    viewChild.required<ElementRef<HTMLCanvasElement>>('signatureCanvas');
  signaturePad!: SignaturePad;

  private elementRef = inject(ElementRef);
  private http = inject(HttpClient);
  private menuController = inject(MenuController);
  private navCtrl = inject(NavController);

  constructor() {
    addIcons({ close });
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
    this.resizeCanvas();
  }

  ionViewDidLeave() {
    this.menuController.enable(true);
  }

  ngAfterContentInit(): void {
    const canvasEl: HTMLCanvasElement = this.signatureCanvas().nativeElement;
    this.signaturePad = new SignaturePad(canvasEl, {
      backgroundColor: '#fff',
      penColor: 'rgb(0, 0, 0)',
    });
  }

  onResize(event: Event) {
    // console.log('event:', event.type);
    this.resizeCanvas();
  }

  private resizeCanvas() {
    const pageEl = this.elementRef.nativeElement;
    const headerHeight = this.header()?.nativeElement?.offsetHeight ?? 0;
    const buttonsHeight = this.buttons()?.nativeElement?.offsetHeight ?? 0;
    // console.log({ headerHeight, buttonsHeight });
    if (headerHeight > 0 && buttonsHeight > 0) {
      pageEl.style.setProperty(
        '--chrome-height',
        `${headerHeight + buttonsHeight + 8}px`
      );
    }

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

  async saveSignature() {
    const data = this.signaturePad.toDataURL();
    // console.log(data);

    const body = {
      signature: data,
    };

    this.http
      .post('https://devel.jetsoft.cz:8338/api/signature', body)
      .subscribe(
        (res) => console.log('Upload success!', res),
        (err) => console.error('Upload error!', err)
      );
  }

  goBack() {
    this.navCtrl.back();
  }
}
