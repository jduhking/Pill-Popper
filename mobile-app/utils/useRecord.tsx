import * as SecureStore from 'expo-secure-store';
import { Record } from '../models/record';
const useRecord = () => {
    const storeData = async (key: string, value: any) => {
        try {
          const jsonValue = JSON.stringify(value);
          await SecureStore.getItemAsync(key, value);
        } catch (e) {
          // saving error
          console.error('error storing value: ', e)
        }
    };
    const getData = async (id: string) => {
        try {
          const jsonValue = await SecureStore.getItemAsync(id);
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
          // error reading value
          console.error('error retrieving value: ', e)
        }
      };

    const getRecord = async (record_id: string): Promise<Record> => {
        console.log('attempting to get record...')
        return await getData(record_id)
    }

    return {
        getRecord,
    }

}

export default useRecord;