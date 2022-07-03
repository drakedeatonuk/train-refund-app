

export namespace Photos {

  export type Photo = {
    id: number;
    userId: number;
    firebaseId: string;
    firebaseUrl: string;
    nativeUrl: string;
  }

  export type NewPhoto = Omit<Photo, 'id'>;

}
