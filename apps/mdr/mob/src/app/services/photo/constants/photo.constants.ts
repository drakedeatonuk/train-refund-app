import { AngularFireStorageReference } from '@angular/fire/compat/storage';
import { Photo } from '@capacitor/camera';

export const FIREBASE_PHOTO_UPLOADER_SERVICE = 'FIREBASE_PHOTO_UPLOADER_SERVICE';

export type FirebasePhotoUploadData = {
  customMetadata: {
    firebaseId: string;
    userId: string;
    email: string;
    nativeUrl: string;
  };
  fileBlob: string;
  photo: Photo;
  uploadRef?: AngularFireStorageReference;
  uploadPath?: string;
};

export interface NewPhoto {
  firebaseId: string;
  userId: number;
  email: string;
  photoPaths: PhotoPaths;
  photo: Photo;
  fileBlob: string;
}

export interface PhotoPaths {
  filepath: string;
  webviewPath: string;
}

export enum PhotoUploadStates {
  Canceled = 'canceled',
  Error = 'error',
  Paused = 'paused',
  Running = 'running',
  Success = 'success',
}
