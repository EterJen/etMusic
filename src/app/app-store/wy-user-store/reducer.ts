import {Action, createReducer, on} from '@ngrx/store';
import LoginInfo from '../../data-types/results/LoginInfo';
import {flexSetUserState} from './action';
import {CellphoneLoginParams} from '../../services/bz/member.service';


export type FlexWyUserState = {
  loginInfo?: LoginInfo | null;
  cellphoneLoginParams?: CellphoneLoginParams | null;
};
export type WyUserState = {
  loginInfo: LoginInfo | null;
  cellphoneLoginParams: CellphoneLoginParams | null;
};

export const initialState: WyUserState = {
  loginInfo: null,
  cellphoneLoginParams: null
};

const reducer = createReducer(
  initialState,
  on(flexSetUserState, (state, {...args}) => {
    // console.log(args.type, args);
    return ({...state, ...args});
  }),
);

export function wyUserStateReducer(state: WyUserState | undefined, action: Action): WyUserState {
  return reducer(state, action);
}
