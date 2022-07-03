import { NavigationService } from '../../../core/navigation/navigation.service';
import { TicketType } from '@nx-prisma/.prisma/main';
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from '../../../services/user/user.service';
import { assets } from '@multi/mdr';

@Component({
  selector: 'app-ticket-pic-modal',
  templateUrl: './ticketPicModal.component.html',
})
export class TicketPicModalComponent {
  constructor(private navigationSvc: NavigationService, public modalController: ModalController, public userSvc: UserService) {}

  @Input() modalType: 'ticketRef' | 'ticketPic';
  @Input() ticketType: TicketType;
  eTicketPicPaths = Object.values(assets.tickets.eTickets);
  paperTicketPicPaths = Object.values(assets.tickets.paperTickets);

  closeModal(): void {
    this.modalController.dismiss();
  }

  async initLogout(): Promise<void> {
    await this.navigationSvc.logout();
  }
}
