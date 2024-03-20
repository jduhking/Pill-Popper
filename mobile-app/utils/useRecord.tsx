import * as SecureStore from 'expo-secure-store';
import { Record } from '../models/record';
const useRecord = () => {
    const storeData = async (key: string, value: any) => {
          const jsonValue = JSON.stringify(value);
          await SecureStore.setItemAsync(key, value);
    };
    const getData = async (id: string) => {
          const jsonValue = await SecureStore.getItemAsync(id);
          if(!jsonValue){
            throw new Error("value is null");
          }
          return JSON.parse(jsonValue)
      };

    const getRecord = async (record_id: string): Promise<Record> => {
        console.log('attempting to get record...')
        let record = null
        record = await getData(record_id)
        console.log('got record from secure store: ', record)
        return record
    }

    const initRecord = async (record_id: string): Promise<Record> => {
      // create a record
      console.log('initializing record')
      const record : Record = {
        id: record_id,
        pills: []
      }
      await storeData(record_id, JSON.stringify(record))
      return record
    }



    return {
        getRecord,
        initRecord
    }

}

export default useRecord;