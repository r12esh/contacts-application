import * as types from "../action/action.types";
const initialState = {
  user:null,
  updateContact:false,
  contactUpdateInfo:null,
  contactUpdateKey:null,
}

const reducer = (state =initialState, action) =>{
  switch (action.type) {
    case types.SET_USER:
      return {
        ...state,
        user:action.user
      }
    case types.SET_UPDATE_CONTACT:
      return{
        ...state,
        updateContact:action.updateContact
      }
    case types.SET_UPDATE_CONTACT_INFO:
      return{
        ...state,
        contactUpdateInfo:action.contactUpdateInfo
      }
    case types.SET_UPDATE_CONTACT_KEY:
      return{
        ...state,
        contactUpdateKey:action.contactUpdateKey
      }
  
    default:
      return state;
  }
}

export default reducer;