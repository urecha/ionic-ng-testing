import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  question: Question = {
    id: 1,
    question: "What does this legend speak of?",
    answers: [
      { id: 1, answer: "Link"},
      { id: 2, answer: "Zelda"},
      { id: 3, answer: "Bird" },
      { id: 4, answer: "Sword" }
    ],
    time: 15
  }

  countdownValue: number;

  constructor(
    private readonly toastController: ToastController
  ) {}

  ngOnInit() {
    if(this.question.time) {
      this.countdownValue = this.question.time;
      const countdown = setInterval(() => {
        this.countdownValue--;
      }, 1000);

      setTimeout(() => {
        clearInterval(countdown);
      }, (this.question.time + 1) * 1000);
    }
  }

  async selectAnswer(selected: Answer, index: number) {
    console.log('SelectAnswer triggered');
    selected.selected = true;
    for(let answer of this.question.answers) {
      if(answer.id == selected.id) continue;
      answer.selected = false;
    }

    // const toast = await this.toastController.create({
    //   message: `Answer #${index + 1} selected!`,
    //   duration: 2000,
    //   cssClass: 'roche-toast'
    // })

    // toast.present();
  }

}

export interface Question {
  id: number;
  question: string;
  answers: Answer[];
  time?: number;
}

export interface Answer {
  id: number;
  answer: string;
  selected?: boolean;
}
