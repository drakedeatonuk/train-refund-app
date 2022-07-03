import { HttpClient } from '@angular/common/http';
import { FirebasePhotoUploadData } from './../constants/photo.constants';
import { Users } from '@multi/mdr';
import { IPhotoUploaderService } from '../interfaces/iPhotoUploader.service';
import { NewPhoto, FIREBASE_PHOTO_UPLOADER_SERVICE } from '../constants/photo.constants';
import { Inject, Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { badRequest, BAD_CONNECTION, err, ok, Result } from '@multi/shared';
import { v4 as uuid } from 'uuid';
import { HttpStoreService } from '../../../core/http/services/httpStore.service';
import { HttpOfflineService } from '../../../core/http/services/httpOffline.service';
import { HttpMethod, PendingRequest } from '../../../core/http/constants/http.constants';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { HttpOfflineStoreService } from '../../../core/http/services/httpOfflineStore.service';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {

  retryingPhotoUpload = false;

  constructor(private platform: Platform,
    private httpStore: HttpStoreService,
    private offlineStore: HttpOfflineStoreService,
    private http: HttpClient,
    @Inject(FIREBASE_PHOTO_UPLOADER_SERVICE) private photoUploaderSvc: IPhotoUploaderService
  ) {}

  public async takePhoto(user: Users.User): Promise<NewPhoto> {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const photoPaths = await this.savePhotoInFilesystem(photo);

    return {
      firebaseId: uuid(),
      userId: user.id,
      email: user.email,
      photo: photo,
      photoPaths: photoPaths,
      fileBlob: await this.readAsBase64(photo),
    };
  }

  async prepPhotoUploadData(newPhoto: NewPhoto): Promise<FirebasePhotoUploadData> {
    return this.photoUploaderSvc.prepPhotoUploadData(newPhoto);
  }

  async submitPhotoUpload(newFirebasePhoto: FirebasePhotoUploadData): Promise<Result<string>> {
    if (this.httpStore.networkStatus$.value.connected == false) return err(badRequest(BAD_CONNECTION));

    // console.log("TEST1", "in submitPhotoUpload...");
    // const photoData = this.photoUploaderSvc.prepPhotoUploadData(newPhoto);
    console.log("TEST1.1", "photoData prepped...");
    // if photoUploader is successful
    const photoUploader = await this.photoUploaderSvc.attemptPhotoUpload(newFirebasePhoto.customMetadata.firebaseId, newFirebasePhoto);
    console.log(photoUploader);

    return photoUploader
  }


  async resubmitPhotoUpload(photoRequest: PendingRequest<'IMAGE'>): Promise<Result<void>> {

    const photoUploader = await this.photoUploaderSvc.attemptPhotoUpload(photoRequest.id, photoRequest.data);

    console.log('photo upload was successful:', photoUploader.ok);

    if (photoUploader.ok == false) return err(badRequest("Error uploading photo"));

    await this.offlineStore.deletePendingRequest(photoRequest.id);

    const claimPhotoUpdater = await this.updateClaimPhoto(photoRequest, photoUploader.value)
    if (claimPhotoUpdater.ok == false)
      await this.offlineStore.storePendingHttpRequest(`/api/claim/photo/${photoRequest.data.customMetadata.userId}`, HttpMethod.PUT, {
        body: {
          firebaseId: photoRequest.data.customMetadata.firebaseId,
          firebaseUrl: photoUploader.value,
        }
      });

    return ok();
  }

  async updateClaimPhoto(photoRequest: PendingRequest<'IMAGE'>, firebaseUrl: string): Promise<Result<void>> {
    try {
      const claimPhotoUpdater = await firstValueFrom(this.http.put<Result>(`/api/claim/photo/${photoRequest.data.customMetadata.userId}`, {
        body: {
          firebaseId: photoRequest.data.customMetadata.firebaseId,
          firebaseUrl: firebaseUrl,
        }
      }));
      if (claimPhotoUpdater.ok == false) return err(badRequest("Error updating claim"));

      //TODO send a fetchUserData() request!!! Fresh data needs to be retreived.
      return ok();
    } catch (e) {
      return err(badRequest("Error updating claim"));
    }
  };

  private async savePhotoInFilesystem(photo: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    }
  }

  private async readAsBase64(photo: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path,
      });

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  private convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}
