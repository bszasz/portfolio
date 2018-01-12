import { SourcePage } from "./source-page";
import * as $ from 'jquery';

export class PortfolioItem {
    

        public name: string
    public currentValue: number 

       constructor(public url: string, public type: SourcePage, public originalValue: number,public originalAmount: number){
    
       }

       public profit() {
           if (isNaN(this.currentValue)||isNaN(this.originalAmount)||isNaN(this.originalValue) )return 0;
           return Math.round(this.originalAmount*(this.currentValue - this.originalValue) * 100) / 100
       }

       public refresh(data) {
          var $parsedResults = $.parseHTML(data.text());
          this.currentValue = $($parsedResults).find(this.type.valuePath).text();
          this.name = $($parsedResults).find(this.type.namePath).text();
        }
    }