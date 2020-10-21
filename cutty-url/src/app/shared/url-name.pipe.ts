import { Pipe, PipeTransform } from '@angular/core';
import { DbURL } from './database-url.model';

@Pipe({
    name: 'url'
})
export class UrlNamePipe implements PipeTransform{
    // tslint:disable-next-line: typedef
    transform(value: DbURL, property: string){
        if (!value){
            return '';
        }
        if (property === 'long'){
            return value.longUrl;
        }else if (property === 'short'){
            return 'http://localhost:4103/' + value.shortUrl;
        }else {
            return '';
        }
    }
}
