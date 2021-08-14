import { Injectable } from '@angular/core';
import { Camera, CameraPhoto, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: AppPhoto[] = [];
  private readonly PHOTO_STORAGE: string = "photos";
  private readonly platform: Platform;

  constructor(
    platform: Platform
  ) {
    this.platform = platform;
  }

  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift({
      filePath: "ok",
      webviewPath: capturedPhoto.webPath
    })

    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
  }

  public async loadSaved() {
    const photoList = await Storage.get({key: this.PHOTO_STORAGE});
    this.photos = JSON.parse(photoList.value) || [];

    if(!this.platform.is('hybrid')) {

      for (let photo of this.photos) {
        const readFile = await Filesystem.readFile({
          path: photo.filePath,
          directory: Directory.Data
        });
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  public async savePicture(cameraPhoto: Photo) {
    const base64Data = await this.readAsBase64(cameraPhoto);

    const fileName = new Date().getTime() + ".jpeg";
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    if(this.platform.is('hybrid')) {
      return {
        filePath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri)
      };
    } else {
      return {
        filePath: fileName,
        webviewPath: cameraPhoto.webPath
      };
    }
  }

  public async deletePicture(photo: AppPhoto, position: number) {
    this.photos.splice(position, 1);

    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });

    const filename = photo.filePath.substr(photo.filePath.lastIndexOf('/') + 1);

    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data
    });
  }

  private async readAsBase64(cameraPhoto: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: cameraPhoto.path
      });

      return file.data;
    } else {
      const response = await fetch(cameraPhoto.webPath);
      const blob = await response.blob();
  
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}

export interface AppPhoto {
  filePath: string;
  webviewPath: string;
}
