import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageResizeService {
  constructor() {}

  resizeImage(
    file: File,
    maxWidth: number,
    maxHeight: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.onload = () => {
          let { width, height } = img;
          const aspectRatio = width / height;

          // Adjust width/height to maintain aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              width = maxWidth;
              height = Math.round(width / aspectRatio);
            }
          } else {
            if (height > maxHeight) {
              height = maxHeight;
              width = Math.round(height * aspectRatio);
            }
          }

          // Create an off-screen canvas to draw and resize the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Canvas not supported'));
          }

          canvas.width = width;
          canvas.height = height;

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Get the base64 data URL (JPEG format, 90% quality)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

          resolve(dataUrl);
        };

        img.onerror = (err) => {
          reject(err);
        };

        // Set the image source to the file's data URL
        if (reader.result) {
          img.src = reader.result as string;
        }
      };

      reader.onerror = (err) => {
        reject(err);
      };

      // Read the file as a data URL
      reader.readAsDataURL(file);
    });
  }
}
