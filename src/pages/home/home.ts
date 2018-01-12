import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { SourcePage } from '../../app/models/source-page';
import { PortfolioItem } from '../../app/models/portfolio-item';
import { Http } from '@angular/http';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private pageTypes = [
    new SourcePage( "https://www.teletrader.com/",
    "#Heading div.heading-holder.clearfix h1",
    "#Heading div.component.security-details div table tbody tr td.cell-first.last span span.last"
  )];

  private proxy = 'https://cors-anywhere.herokuapp.com/'  

  private items = [
    new PortfolioItem(
      'https://www.teletrader.com/fidelity-fd-glob-technology-a-acc-usd/funds/details/FU_100049764',
      this.pageTypes[0], 12.14, 126.69)
    ,
    new PortfolioItem(
      'https://www.teletrader.com/jpm-us-technology-a-acc-usd/funds/details/FU_100010194',
      this.pageTypes[0], 0, 0)
      ,
    new PortfolioItem(
        'https://www.teletrader.com/pioneer-fd-u-s-fund-gro-a-nd-usd/funds/details/FU_100024783',
      this.pageTypes[0], 0, 0)
      ,
    ]
  

  constructor(public navCtrl: NavController, public http:Http, private storage: Storage, public alertCtrl: AlertController) {
    this.items.forEach( item  => {
      this.getItem(item)
    });
  }

  getItem(item)
  {
    this.http.get(this.proxy + item.url)
    .subscribe(data => {
      item.refresh(data);
    }, (error: any) => {
      console.log("error downloading a page",item.url, error)
    });

  }

  addItem() {

    let prompt = this.alertCtrl.create({
      title: 'Add item',
      inputs: [{
        name: 'url',
        placeholder: 'http://',
        type: 'url'
      },{
        name: 'originalValue',
        placeholder: 'original value',
        type: 'number'
      },{
        name: 'originalAmount',
        placeholder: 'amount',
        type: 'number'
      }],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            let item = new PortfolioItem(data.url,this.pageTypes[0], data.originalValue, data.originalAmount)
            this.getItem(item);
            this.items.push(item);
            console.log(item);            
          }
        }
      ]
    });

    prompt.present();
  }
  editItem(item) {

    let prompt = this.alertCtrl.create({
      title: 'Edit item',
      inputs: [{
        name: 'url',
        placeholder: 'http://',
        type: 'url',
        value: item.url
      },{
        name: 'originalValue',
        placeholder: 'original value',
        type: 'number',
        value: item.originalValue
      },{
        name: 'originalAmount',
        placeholder: 'amount',
        type: 'number',
        value: item.originalAmount
       }],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            let index = this.items.indexOf(item);
            let newItem = new PortfolioItem(data.url,this.pageTypes[0], data.originalValue, data.originalAmount)
            this.getItem(newItem);
            if (index > -1) {
              this.items[index] = newItem;
            }
            console.log(item);            
          }
        }
      ]
    });

    prompt.present();
  }

  deleteItem(item) {
    let index = this.items.indexOf(item);

    if (index > -1) {
      this.items.splice(index, 1);
    }
  }


}
