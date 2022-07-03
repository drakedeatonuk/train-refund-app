import { UserService } from './../user/user.service';
import { Result } from '@multi/shared';
import { Addresses } from '@multi/mdr';
import { Injectable } from '@angular/core';
import { HttpService } from '../../core/http/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private httpSvc: HttpService, private userSvc: UserService) {}

  async postAddressUpdate(addressFields: Addresses.PartialAddress): Promise<Result<Addresses.Address>> {
    const res = await this.httpSvc.put<Result<Addresses.Address>>(`/api/address/${this.userSvc.store.user.address.id}`, {
      body: addressFields
    });
    if (res.ok == false) return res;
    this.userSvc.store.storeUserData<Addresses.Address>(res.value, 'address');
    return res;
  }
}
