import { DbURL } from '../database-url.model';
import * as UrlActions from '../Url-store/url.actions';

export interface State {
    urls: DbURL[];
    error: string;
}

const intialState: State = {
    urls: [],
    error: null
};

export function UrlReducer(state: State = intialState, action: UrlActions.UrlActions): State{
    switch (action.type){
        case UrlActions.INFLATE_URL:
            return {
                ...state
            };
        case UrlActions.SHORTEN_URL:
            return {
                ...state
            };
        case UrlActions.SET_URL:
            state.urls.forEach(dburl =>{
                if (dburl.shortUrl === action.payload.shortUrl)
                {
                    return {...state};
                }
            });
            return {
                ...state,
                urls: [...state.urls, action.payload]
            };
        case UrlActions.CONVERSION_FAILED:
            return{
                ...state,
                error: action.payload
            };
        case UrlActions.CLEAR_ERROR:
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
}
