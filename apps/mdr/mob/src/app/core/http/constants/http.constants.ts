import { HttpHeaders } from '@angular/common/http';
import { NewPhoto, FirebasePhotoUploadData } from './../../../services/photo/constants/photo.constants';
export const STORAGE_REQ_KEY = 'MDR';

type PendingRequestData = {
  ['REST']: {
    id: string;
    method: HttpMethod;
    time: number;
    url: string;
    data: HttpOptions;
  };
  ['IMAGE']: {
    id: string;
    time: number;
    data: FirebasePhotoUploadData;
  };
};

export type PendingRequest<T extends keyof PendingRequestData> = PendingRequestData[T] & { type: T };

export type AnyPendingRequest = {[type in PendingRequestTypes]: PendingRequest<type>}[PendingRequestTypes];

export type PendingRequests =
  | Array<AnyPendingRequest>
  | [];

export enum PendingRequestTypes {
  Image = 'IMAGE',
  Rest = 'REST',
}

export enum HttpMethod {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
}

// HttpOptions interface has been _partially_ copied from @angular/common/http... Is not comprehensive
export interface HttpOptions {
  body?: any;
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
}
