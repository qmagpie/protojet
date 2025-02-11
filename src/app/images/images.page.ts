import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { ImageInputComponent } from '../components/image-input/image-input.component';
import { ImageResizeService } from '../image-resize.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.page.html',
  styleUrls: ['./images.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonList,
    IonMenuButton,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ImageInputComponent,
  ],
})
export class ImagesPage implements OnInit {
  cdr = inject(ChangeDetectorRef);
  imageService = inject(ImageResizeService);

  galleryFile: File | undefined = undefined;
  galleryImagePreview: string | ArrayBuffer | null = null;
  cameraFile: File | undefined = undefined;
  cameraImagePreview: string | ArrayBuffer | null = null;

  constructor() {}

  ngOnInit() {}

  galleryInputChanged(file: File) {
    if (file) {
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

  cameraInputChanged(file: File) {
    if (file) {
      this.cameraFile = file;
      this.cameraImagePreview = null;
      const reader = new FileReader();
      reader.onload = async () => {
        this.cameraImagePreview = reader.result; // base64 data URL
        // try {
        //   this.cameraImagePreview = await this.imageService.resizeImage(
        //     file,
        //     100,
        //     100
        //   );
        // } catch (error) {
        //   console.error('Error resizing image', error);
        // }
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
}
