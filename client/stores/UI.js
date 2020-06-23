import { BaseStore, getOrCreateStore } from 'next-mobx-wrapper';
import { observable, action } from 'mobx';

class Store extends BaseStore {
  @observable showPopup = {
    login: false,
    cocktails: false,
    parties: true,
  };

  @action togglePopUp = (key, val) => (this.showPopup[key] = val);

  @action getPopUpState = (key) => this.showPopup[key];

  @action getAllPopUpStates = () => this.showPopup;
}

// Make sure the store’s unique name
// AND must be same formula
// Example: getUserStore => userStore
// Example: getProductStore => productStore
export const getInterfaceStore = getOrCreateStore('interfaceStore', Store);
