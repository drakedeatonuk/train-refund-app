import { Subscription } from 'rxjs';
import { Result } from '@multi/shared';
import { FirebasePhotoUploadData, NewPhoto } from '../constants/photo.constants';

export interface IPhotoUploaderService {
  prepPhotoUploadData(newPhoto: NewPhoto): FirebasePhotoUploadData;
  attemptPhotoUpload(reqId: string, photoData: FirebasePhotoUploadData): Promise<Result<string>>;
}
