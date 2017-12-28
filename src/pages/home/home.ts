import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as $ from 'jquery';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private proxy = 'https://cors-anywhere.herokuapp.com/'
  private items  = [];
  private urls = [
    'https://www.teletrader.com/fidelity-fd-glob-technology-a-acc-usd/funds/details/FU_100049764',
    'https://www.teletrader.com/jpm-us-technology-a-acc-usd/funds/details/FU_100010194',
    'https://www.teletrader.com/pioneer-fd-u-s-fund-gro-a-nd-usd/funds/details/FU_100024783'
  ]

  constructor(public navCtrl: NavController, public http: Http) {
    for (let url in this.urls) {
      this.http.get(this.proxy+this.urls[url]).subscribe(data => {
      var $parsedResults = $.parseHTML(data.text());
      let currentValue = $($parsedResults).find( "#Heading div.component.security-details div table tbody tr td.cell-first.last span span.last" ).text();
      let name = $($parsedResults).find( "#Heading div.heading-holder.clearfix h1" ).text();
      this.items.push({ currentValue, name });
    });
    }
  }

}
