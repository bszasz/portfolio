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

  private pageTypes = [];

  private proxy = 'https://cors-anywhere.herokuapp.com/'  

  private items = []
  

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
            let newItem = new PortfolioItem(data.url,item.type, data.originalValue, data.originalAmount)
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

  settings() {
    
        let prompt = this.alertCtrl.create({
          title: 'Load JSON settings',
          subTitle: 'You can use https://jsonblob.com to create a portfolio descriptor JSON.',
          inputs: [{
            name: 'url',
            placeholder: 'http://',
            type: 'url'
          }],
          buttons: [
            {
              text: 'Cancel'
            },
            {
              text: 'Save',
              handler: data => {
                this.http.get(data.url)
                .subscribe(data => {
                  let json = data.json();
                  console.log(json);
                  this.pageTypes = [];
                  for (var i of json.pageTypes) {
                    let newType = new SourcePage(i.site,i.name, i.value);
                    console.log(newType);
                    this.pageTypes.push(newType);
                  }
                  this.items = [];
                  for (var i of json.items) {
                    let newItem = new PortfolioItem(i.url,this.pageTypes[i.pageType], i.originalValue, i.originalAmount)
                    console.log(newItem);
                    this.items.push(newItem);
                    this.getItem(newItem);
                  }
                }, (error: any) => {
                  console.log("error downloading settings", error)
                });
                      
              }
            }
          ]
        });
        prompt.present();
      }
}
