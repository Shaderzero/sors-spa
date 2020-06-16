import {Injectable, OnInit} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Patcher} from '../_models/patch';
import {TextData} from '../_models/text-data';
import {map} from 'rxjs/operators';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {ActivatedRouteSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TextDataService {
  baseUrl = environment.apiUrl + 'textdatas';
  textDatas: TextData[] = null;

  constructor(private http: HttpClient) {
    this.fillTextDatas();
  }

  fillTextDatas() {
    this.getTextDatas().subscribe((res: TextData[]) => {
      this.textDatas = res;
    });
  }

  getTextDatas(): Observable<TextData[]> {
    console.log('query to SQL detected');
    return this.http.get<TextData[]>(this.baseUrl);
  }

  getTextDataById(id: number): Observable<TextData[]> {
    return this.http.get<TextData[]>(this.baseUrl + '/' + id);
  }

  getTextDataFormDB(name: string, param?: string): Observable<TextData> {
    let params = new HttpParams();
    params = params.append('name', name);
    if (isNotNullOrUndefined(param)) {
      params = params.append('param', param);
    } else {
      params = params.append('param', 'ru');
    }
    return this.http.get<TextData>(this.baseUrl, {observe: 'response', params})
      .pipe(
        map(response => {
          const textData: TextData = response.body;
          return textData;
        })
      );
  }

  getTextDataFromCache(name: string, param?: string): TextData {
    let result: TextData = null;
    if (!isNotNullOrUndefined(param)) {
      result = this.textDatas.find(x => {
        return (x.name === name && x.param === 'ru');
      });
    } else {
      result = this.textDatas.find(x => {
        return (x.name === name && x.param === param);
      });
    }
    return result;
  }

  getTextData(name: string, param?: string): TextData {
    if (isNotNullOrUndefined(this.textDatas)) {
      return this.getTextDataFromCache(name, param);
    } else {
      this.getTextDatas().subscribe((res: TextData[]) => {
        this.textDatas = res;
        return this.getTextDataFromCache(name, param);
      });
    }
  }

  getTextDataValue(name: string, param?: string): string {
    const result = this.getTextData(name, param);
    if (isNotNullOrUndefined(result)) {
      return result.value;
    } else {
      return name;
    }
  }

  createTextData(textData: TextData) {
    return this.http.post(this.baseUrl, textData);
  }

  updateTextData(textData: TextData) {
    return this.http.put(this.baseUrl + '/' + textData.id, textData);
  }

  deleteTextData(id: number) {
    return this.http.delete(this.baseUrl + '/' + id);
  }

  patchTextData(id: number, patcher: Patcher[]) {
    return this.http.patch(this.baseUrl + '/' + id, patcher);
  }

}
