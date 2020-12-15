import { ActionReducerMap } from '@ngrx/store';
import * as fromUrls from '../shared/Url-store/url.reducer';

export interface AppState {
    urls: fromUrls.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    urls: fromUrls.UrlReducer
};
