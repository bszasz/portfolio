import { SourcePage } from "./source-page";
import * as $ from 'jquery';

export class PortfolioItem {


    public name: string
    public currentValue: number
    public originalValue: number
    public originalAmount: number

    constructor(public url: string, public type: SourcePage) {
        
    }
    
    public setOriginalValue(value){
        this.originalValue = value
    }
    public setOriginalAmount(amount) {
        this.originalAmount = amount
    }

    public profit() {
        if (isNaN(this.currentValue) || isNaN(this.originalAmount) || isNaN(this.originalValue)) return 0;
        return Math.round(this.originalAmount * (this.currentValue - this.originalValue) * 100) / 100
    }

    public refresh(data) {
        var $parsedResults = $.parseHTML(data.text());
        this.currentValue = $($parsedResults).find(this.type.valuePath).text();
        this.name = $($parsedResults).find(this.type.namePath).text();
    }

}