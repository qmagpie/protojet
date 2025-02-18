import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
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
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonList,
    IonMenuButton,
    IonTitle,
    IonToolbar,
    ImageInputComponent,
    CommonModule,
    HttpClientModule,
  ],
})
export class ImagesPage implements OnInit {
  http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);
  imageService = inject(ImageResizeService);

  galleryImageInput = viewChild<ImageInputComponent>('galleryImageInput');
  cameraImageInput = viewChild<ImageInputComponent>('cameraImageInput');

  galleryFile: File | undefined = undefined;
  cameraFile: File | undefined = undefined;
  selectedFile: File | undefined = undefined;
  selectedImagePreview: string | ArrayBuffer | null = null;

  useFormData = signal(false);
  postApi = signal('https://devel.jetsoft.cz:8338/api/image/upload');

  constructor() {}

  ngOnInit() {}

  galleryInputChanged(file: File | undefined) {
    if (file) {
      this.galleryFile = file;
      this.selectedFile = this.galleryFile;
      this.cameraImageInput()?.clear();
      this.selectedImagePreview = null;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImagePreview = reader.result; // base64 data URL
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    } else {
      this.galleryFile = undefined;
      this.selectedImagePreview = null;
      this.cdr.detectChanges();
    }
  }

  cameraInputChanged(file: File | undefined) {
    if (file) {
      this.cameraFile = file;
      this.selectedFile = this.cameraFile;
      this.galleryImageInput()?.clear();
      this.selectedImagePreview = null;
      const reader = new FileReader();
      reader.onload = async () => {
        this.selectedImagePreview = reader.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    } else {
      this.cameraFile = undefined;
      this.selectedImagePreview = null;
      this.cdr.detectChanges();
    }
  }

  async onPost() {
    if (this.galleryFile || this.cameraFile) {
      const body = {
        imageFileName: '',
        imageFileData: '',
      };

      if (this.selectedFile) {
        body.imageFileName = this.selectedFile.name;
        const resizedGalleryFileData = await this.imageService.resizeImage(
          this.selectedFile,
          1024,
          1024
        );
        // body.imageFileData = resizedGalleryFileData.split('base64,')[1];
        body.imageFileData = resizedGalleryFileData;
      }

      this.http.post(this.postApi(), body).subscribe(
        (res) => console.log('Upload success!', res),
        (err) => console.error('Upload error!', err)
      );
    }
  }
}
