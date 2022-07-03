import { HttpStoreService } from './../../../core/http/services/httpStore.service';
import { badRequest, BAD_CONNECTION, err, ok, Result } from '@multi/shared';
import { UserService } from '../../user/user.service';
import { Injectable } from '@angular/core';
import { UploadTaskSnapshot } from '@angular/fire/compat/storage/interfaces';
import { HttpService } from '../../../core/http/services/http.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { NewPhoto, FirebasePhotoUploadData, PhotoUploadStates } from '../constants/photo.constants';
import { IPhotoUploaderService } from '../interfaces/iPhotoUploader.service';
import { Subscription, Observable, interval, firstValueFrom, throwError } from 'rxjs';
import { Photo } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class FirebasePhotoUploader implements IPhotoUploaderService {
  constructor(private fireStorage: AngularFireStorage, private platform: Platform, private httpStore: HttpStoreService) {}

  prepPhotoUploadData(newPhoto: NewPhoto): FirebasePhotoUploadData {
    const photoData: FirebasePhotoUploadData = {
      customMetadata: {
        firebaseId: newPhoto.firebaseId,
        userId: newPhoto.userId.toString(),
        email: newPhoto.email,
        nativeUrl: newPhoto.photoPaths?.webviewPath,
      },
      fileBlob: newPhoto.fileBlob,
      photo: newPhoto.photo
    };
    return photoData;
  }

  async attemptPhotoUpload(reqId: string, photoData: FirebasePhotoUploadData): Promise<Result<string>> {
    console.log("TEST2", "in attemptPhotoUpload...");

    // creating firestore upload reference object
    const [year, month] = [new Date().getFullYear(), new Date().getMonth()];
    photoData.uploadPath = `tickets/${year}/${month}/${photoData.customMetadata.email}-${reqId}`;
    photoData.uploadRef = this.fireStorage.ref(photoData.uploadPath);



    const photoUploadJob: AngularFireUploadTask = photoData.uploadRef.putString(photoData.fileBlob, 'data_url', {
      contentType: 'image/jpeg',
      customMetadata: photoData.customMetadata,
    });

    console.log("TEST2.1", "starting upload...");
    return await new Promise<Result<string>>(
      resolve => {
        photoUploadJob.snapshotChanges().subscribe({
          next: async (snapshot: UploadTaskSnapshot) => {
            console.log("!!!")
            console.log(snapshot);
            if (snapshot.state == PhotoUploadStates.Canceled) {
              console.log('upload has been canceled')
              photoUploadJob.cancel()
            }
            else if (snapshot.state == PhotoUploadStates.Running) console.log('uploading is running...');
            else if (snapshot.state == PhotoUploadStates.Success) console.log('upload completed!');

            // if the image isn't uploaded in 6 seconds, cancel and try again later.
            await new Promise(resolve => setTimeout(resolve, 9000))
            console.log('upload is taking too long');
            photoUploadJob.cancel()
          },
          error: e => {
            console.log('in error...')
            console.log(e);
            photoUploadJob.cancel();
            return resolve(err(badRequest(BAD_CONNECTION)));
          },
          complete: async () => {
            console.log('in complete...');
            const downloadUrl = (await firstValueFrom(photoData.uploadRef.getDownloadURL())) as string;
            console.log('File available at', downloadUrl);
            return resolve(ok(downloadUrl));
          },
        });
    });
  }

}
