import { ItemEventData } from "tns-core-modules/ui/list-view"
import { Component, OnInit } from "@angular/core";
import { NewsModel } from "../model/news-model";
import { NewsSourcesModel } from "../model/news-sources-model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as utils from "tns-core-modules/utils/utils";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
    onButtonTap(): void {
        console.log("Button was pressed");
    }

    textFieldValue: string = "";

    count = 0;
    searchCount = 0;
    sourcesCount = 0;


    newsList: NewsModel[] = [];
    searchList: NewsModel[] = [];
    sourceList: NewsSourcesModel[] = [];
    serverUrl: string = "https://newsapi.org/v2/top-headlines?country=in&apiKey=cbcde33bf59b4c799c2860fd2c55b934";
    onItemTap(args: any): void {
        console.log('Item with index: ' + args.index + ' tapped');
        const url = this.newsList[args.index].url;
        utils.openUrl(url);
    }
    onItemSource(args: any): void {
        console.log('Item with index: ' + args.index + ' tapped');
        const url = this.sourceList[args.index].url;
        utils.openUrl(url);
    }
    constructor(private http: HttpClient) {
    }

    ngOnInit(): void {
        this.loadNews();
        this.loadSources();
        // 
    }
    onSearch() {
        this.http.get("https://newsapi.org/v2/everything?apiKey=cbcde33bf59b4c799c2860fd2c55b934&q=" + this.textFieldValue).subscribe((response) => {
            this.searchList = response['articles'];
            this.searchCount = response['totalResults'];
        });
    }
    loadNews() {
        this.http.get(this.serverUrl).subscribe((response) => {
            this.newsList = response['articles'];
            this.count = response['totalResults'];
        });
    }
    loadSources() {
        this.http.get("https://newsapi.org/v2/sources?apiKey=cbcde33bf59b4c799c2860fd2c55b934").subscribe((response) => {
            this.sourceList = response['sources'];
            this.sourcesCount = this.sourceList.length;
        });
    }
}
