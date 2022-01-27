import React, {createContext, useContext} from "react" ;
import useReducerWithSideEffects , { UpdateWithSideEffect , Update } from 'use-reducer-with-side-effects';
import {getStorageItem , setStorageItem} from "./pages/utils/useLocalStorage";



// 컨텍스트는 컨포넌트들의 최상단에서 데이터를 관리한다 따라서 자식 컴포넌트에게 계속 props를 전달할 필요없도록 
const AppContext = createContext();

// 리듀서는 현재 상태와 액션 객체를 파라미터로 받아와서 새로운 상태를 반환해주는 함수
const reducer = (prevState , action ) => {
    const { type } = action;
    if(type === SET_TOKEN){
        const { payload : jwtToken } = action;
        const newState = {...prevState , jwtToken}
        return UpdateWithSideEffect(newState , (state , dispatch) => {
            // side effect 를 동작시킬 함수
            setStorageItem("jwtToken" , jwtToken);
        }); 
    } else if (type === DELETE_TOKEN) {
        const newState = { ...prevState , jwtToken : ""};
        return UpdateWithSideEffect(newState , (state, dispatch)=>{
            setStorageItem("jwtToken" , "");
        });
    }
    return prevState;
};




// provider 는 리액트 앱에 store를 손쉽게 연동 할 수 있도록 도와주는 컴포넌트
export const AppProvider = ({ children }) => {
    // store 는 컴포넌트에서 사용할 수 있는 상태 , dispatch 는 액션을 발생 시키는 함수 (reducer 함수에 인자를 넣어 사용)
    // useContext로 다른 컴포넌트에서 dispatch 라는 setter 함수를 사용 가능토록 합니다
    const jwtToken = getStorageItem('jwtToken' , "");
    const [store , dispatch] = useReducerWithSideEffects(reducer, {
        jwtToken,
        isAuthenticated : jwtToken.length > 0
    });

    return (
        <AppContext.Provider value = {{ store , dispatch}}>
            {children}
        </AppContext.Provider>
    )
}

// AppContext 에서 관리하는 props 를 다른 컴포넌트에서 사용가능함
export const useAppContext = () => useContext(AppContext);

// Actions
const SET_TOKEN = "APP/SET_TOKEN";
const DELETE_TOKEN = "APP/DELETE_TOKEN";

//  Action creators , payload 는 전송되는 데이터를 뜻 함
export const setToken = token => ({type :SET_TOKEN , payload : token});
export const deleteToken = () => ({type: DELETE_TOKEN});
