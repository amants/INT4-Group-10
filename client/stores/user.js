import { BaseStore, getOrCreateStore } from 'next-mobx-wrapper';
import { observable, action } from 'mobx';
 
class Store extends BaseStore {
  @observable auth = false;
  @observable user = null;
 
  @action setAuth = val => this.auth = val;
  
  @action getAuth = () => this.auth;

  @action setUser = val => this.user = val;

  @action getUserValue = key => this.user[key];

  @action getUser = () => this.user;
}
 
// Make sure the store’s unique name
// AND must be same formula
// Example: getUserStore => userStore
// Example: getProductStore => productStore
export const getUserStore = getOrCreateStore('userStore', Store);