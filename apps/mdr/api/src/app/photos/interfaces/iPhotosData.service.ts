import { Photo } from ".prisma/main-client";
import { Result } from "@multi/shared";


export interface IPhotosDataService {

  updateClaimPhotoFirebaseUrl(firebaseId: string, photoFields: string): Promise<Result<Photo>>;

}
