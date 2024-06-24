type InstancePublic = 'MENU_TABLE' | 'CONFIG_FILTER';
class LocalStoragePublic {
    private instanceName = '_Storage_Public';
    public MENU_TABLE: InstancePublic = 'MENU_TABLE';
    public CONFIG_FILTER: InstancePublic = 'CONFIG_FILTER';
    storedData() {
        const storedData = localStorage.getItem(this.instanceName);
        if (!storedData || (storedData + '').trim() === '') {
          return null;
        }
        return JSON.parse(storedData);
    }
    set(instance: InstancePublic, key: string, val: any) {
        let storedData = this.storedData();
        if (storedData == null) {
          storedData = {};
        }
        const instanceValue = storedData[instance] || {};
        instanceValue[key] = val;
        storedData[instance] = instanceValue;
        storedData = JSON.stringify(storedData);
        localStorage.setItem(this.instanceName, storedData);
    }
    get(instance: InstancePublic, key: string) {
        const storedData = this.storedData();
        if (storedData == null) {
          return null;
        }
        const instanceValue = storedData[instance] || {};
        if (instanceValue.hasOwnProperty(key)) {
          return instanceValue[key];
        }
        return null;
    }
    clear() {
      localStorage.removeItem(this.instanceName);
    }
}
export default new LocalStoragePublic();