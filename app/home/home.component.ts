import { ItemEventData } from "tns-core-modules/ui/list-view"
import { Component, OnInit } from "@angular/core";
import { NewsModel } from "../model/news-model";
import { NewsSourcesModel } from "../model/news-sources-model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as utils from "tns-core-modules/utils/utils";
import {
    getBoolean,
    setBoolean,
    getNumber,
    setNumber,
    getString,
    setString,
    hasKey,
    remove,
    clear
} from "tns-core-modules/application-settings";
import { SwipeDirection } from "@nativescript/core/ui/gestures/gestures";

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
    isDataLoading: boolean;


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
        if (hasKey("newsList")) {
            this.newsList = JSON.parse(getString("newsList"));
            this.count = getNumber("count");
        }
        if (hasKey("sourceList")) {
            this.sourceList = JSON.parse(getString("sourceList"));
            this.sourcesCount = getNumber("sourcesCount");
        }
        this.isDataLoading = false;
    }

    ngOnInit(): void {
        if (this.newsList.length === 0) {
            this.loadNews();
        }
        if (this.sourceList.length === 0) {
            this.loadSources();
        }
    }
    swipe(args, source) {
        if (args.direction == SwipeDirection.down) {
            switch (source) {
                case 'newsList':
                this.loadNews();
                break;
                case 'sourceList':
                this.loadSources();
                break;
            }
        }
    }
    onSearch() {
        this.http.get("https://newsapi.org/v2/everything?apiKey=cbcde33bf59b4c799c2860fd2c55b934&q=" + this.textFieldValue).subscribe((response) => {
            this.searchList = response['articles'];
            this.searchCount = response['totalResults'];
        });
    }
    loadNews() {
        this.isDataLoading  = true;
        this.http.get(this.serverUrl).subscribe((response) => {
            this.newsList = response['articles'];
            this.count = response['totalResults'];
            setString("newsList", JSON.stringify(this.newsList));
            setNumber("count", this.count);
            this.isDataLoading  = false;
        });
    }
    loadSources() {
        this.isDataLoading  = true;
        this.http.get("https://newsapi.org/v2/sources?apiKey=cbcde33bf59b4c799c2860fd2c55b934").subscribe((response) => {
            this.sourceList = response['sources'];
            this.sourcesCount = this.sourceList.length;
            setString("sourceList", JSON.stringify(this.sourceList));
            setNumber("sourcesCount", this.sourcesCount);
        });
    }
}
