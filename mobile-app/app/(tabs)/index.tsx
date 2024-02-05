import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useState } from 'react';
import { screenHeight, screenWidth } from '@/utils/dimensions';
import Separator from '@/components/separator';
import ActionButton from '@/components/buttons/action-button';
import { useRouter } from 'expo-router';


export default function TabOneScreen() {

  const router = useRouter();
  const today: Date = new Date();
  type PillInfo = {
    id: string; // string representing the id of the pill
    name: string; // name of the pill
    dosage: number; // measurement of that specific dose e.g 500mg, its always in mg
    dose: number; // how much is taken at a time e.g twice a day
    times: string[]; // an array of time strings representing the times to take the pill
  }
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };
  // Format the date using Intl.DateTimeFormat
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(today);

  // Split the formatted date into an array of strings
  const dateParts = formattedDate.split(' ');

  const todaysPills: PillInfo[] = [{ id: '1', name: 'Xanax', dose: 1, dosage:  0.5, times: ['12PM']}, 
  { id: '2', name: 'Ibuprofen', dose: 2, dosage:  0.2, times: ['10AM', '12PM', '6PM']}, { id: '3', name: 'Cocaine', dose: 1, dosage:  0.5, times: ['12PM']},] 

  const renderItem = ({item, index} : { item: PillInfo, index: number }) => {
    return (
      <View style={styles.pillInfo}>
        <Text style={[styles.headerSmall, { color: 'white'}]}>{item.name}</Text>
        <Text style={[{ fontSize: 18, fontWeight: 'bold', color: 'white'}]}>{item.dose} { item.dose > 1 ? 'times' : 'time' } a day</Text>
        <Text style={[{ fontSize: 18, fontWeight: 'bold',  color: 'white'}]}>{item.dosage} mg</Text>
        <Text numberOfLines={1}
        ellipsizeMode='tail'
        style={{
        fontSize: 18, fontWeight: 'bold',  color: 'white'
        }}>{
          item.times.map((time) => `${time} `)
        }</Text>
      </View>
    )
  }

  

  
  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', paddingVertical: '5%'}}>
        <Text style={styles.headerLarge}>Todays Pills</Text>
        <Separator separation={15}/>
        <Text style={[styles.headerMedium, {textAlign: 'center',
      width: '45%'}]}>{dateParts[0]} {dateParts[1]}, {dateParts[2]}</Text>
      </View>
      <Separator  separation={10}/>
      <View>
        {
          <FlatList
          horizontal
          data={todaysPills}
          showsHorizontalScrollIndicator={false}
    
          contentContainerStyle={{ paddingLeft: '5%', alignItems: 'center'}}
          keyExtractor={(item) => { return item.id}}
          renderItem={renderItem}
          />
        }
      </View>
      <Separator  separation={30}/>
      <View
      style={{ paddingHorizontal: '25%'}}>
        <ActionButton
        onPress={() => router.push('/(add-medication)/add-medication')}>
          Add Pills
        </ActionButton>
        <Separator separation={20} />
        <ActionButton
        onPress={() => router.push('/calendar')}>
          View Schedule
      </ActionButton>
      </View>
      
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
 
  },
  headerLarge: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  headerMedium: {
    fontSize: 26,
    fontWeight: 'bold'
  },
  headerSmall: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  pillInfo: {
    width: screenWidth * 0.45, 
    height: screenWidth * 0.45, 
    borderRadius: 20, 
    backgroundColor: '#A14A76',
    padding: '5%', 
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  }
});
