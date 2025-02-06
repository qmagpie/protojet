import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {
  cameraOutline,
  cameraSharp,
  close,
  imageOutline,
  imageSharp,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-images',
  templateUrl: './images.page.html',
  styleUrls: ['./images.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonMenuButton,
    IonNote,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class ImagesPage implements OnInit {
  elementRef = inject(ElementRef);
  cdr = inject(ChangeDetectorRef);

  galleryFile: File | undefined = undefined;
  galleryClearable = true;
  galleryImagePreview: string | ArrayBuffer | null = null;
  cameraFile: File | undefined = undefined;
  cameraClearable = true;
  cameraImagePreview: string | ArrayBuffer | null = null;

  constructor() {
    addIcons({ cameraOutline, cameraSharp, close, imageOutline, imageSharp });
  }

  ngOnInit() {}

  galleryInputChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      const formData = new FormData();
      formData.append('image', file, file.name);
      this.galleryFile = file;

      this.galleryImagePreview = null;
      const reader = new FileReader();
      reader.onload = () => {
        this.galleryImagePreview = reader.result; // base64 data URL
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);

      // Send to your API endpoint
      // this.http.post('/api/Image/Upload', formData).subscribe(
      //   (res) => console.log('Upload success!', res),
      //   (err) => console.error('Upload error!', err)
      // );
    }
  }

  galleryClearInput() {
    this.galleryFile = undefined;
    this.galleryImagePreview = null;
  }

  galleryOpen() {
    const galleryInput =
      this.elementRef.nativeElement.querySelector('#gallery-input');
    if (galleryInput) {
      galleryInput.click();
    }
  }

  cameraInputChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      const formData = new FormData();
      formData.append('image', file, file.name);
      this.cameraFile = file;

      this.cameraImagePreview = null;
      const reader = new FileReader();
      reader.onload = () => {
        this.cameraImagePreview = reader.result; // base64 data URL
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);

      // Send to your API endpoint
      // this.http.post('/api/Image/Upload', formData).subscribe(
      //   (res) => console.log('Upload success!', res),
      //   (err) => console.error('Upload error!', err)
      // );
    }
  }

  cameraClearInput() {
    this.cameraFile = undefined;
    this.cameraImagePreview = null;
  }

  cameraOpen() {
    const cameraInput =
      this.elementRef.nativeElement.querySelector('#camera-input');
    if (cameraInput) {
      cameraInput.click();
    }
  }
}
