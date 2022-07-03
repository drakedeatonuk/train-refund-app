import { Photo } from '.prisma/main-client';
import { Result } from '@multi/shared';
import { Inject } from "@nestjs/common";
import { PRISMA_PHOTOS_DATA_SERVICE } from "../constants/photos.constants";
import { IPhotosDataService } from "../interfaces/iPhotosData.service";


export class PhotosService {

  constructor(@Inject(PRISMA_PHOTOS_DATA_SERVICE) private prismaPhotosDataSvc: IPhotosDataService) {}

  async updateClaimPhotoFirebaseUrl(firebaseId: string, firebaseUrl: string): Promise<Result<Photo>> {
    return this.prismaPhotosDataSvc.updateClaimPhotoFirebaseUrl(firebaseId, firebaseUrl);
  }

}
