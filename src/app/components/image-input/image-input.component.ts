import {
  Component,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  cameraSharp,
  close,
  imageOutline,
  imageSharp,
} from 'ionicons/icons';

type ImageInputFlavor = 'Gallery' | 'Camera';

@Component({
  selector: 'app-image-input',
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonItem, IonLabel, IonNote],
})
export class ImageInputComponent {
  elementRef = inject(ElementRef);

  label = input.required<string>();
  flavor = input.required<ImageInputFlavor>();
  fileChanged = output<File | undefined>();
  imageInput = viewChild<ElementRef>('imageInput');

  file: File | undefined = undefined;
  clearable = true;

  constructor() {
    addIcons({ cameraOutline, cameraSharp, close, imageOutline, imageSharp });
  }

  onInputChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      const formData = new FormData();
      formData.append('image', file, file.name);
      this.file = file;
      this.fileChanged.emit(this.file);
    }
  }

  onOpen(event: Event) {
    const imageInput = this.imageInput()?.nativeElement;
    if (imageInput) {
      event.preventDefault();
      imageInput.click();
    }
  }

  onClearInput() {
    this.file = undefined;
    const imageInput: HTMLInputElement = this.imageInput()?.nativeElement;
    if (imageInput) {
      imageInput.value = '';
    }
    this.fileChanged.emit(this.file);
  }

  clear() {
    this.onClearInput();
  }
}
