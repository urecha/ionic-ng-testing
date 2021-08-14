import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { AppPhoto, PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  constructor(
    private readonly photoService: PhotoService,
    private readonly actionSheetController: ActionSheetController,
  ) {}

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  async showActionSheet(photo: AppPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: "Photos",
      buttons: [
        {
        text: "Delete",
        role: "destructive",
        icon: "trash",
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
        },
        {
          text: "Cancel",
          role: "cancel",
          icon: "close",
          handler: () => {}
        }
      ]
    });
    await actionSheet.present();
  }

}
