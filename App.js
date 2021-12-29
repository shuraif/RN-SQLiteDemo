import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,Button
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import SQLite from 'react-native-sqlite-storage';
import DBService from './src/services/DBService'

const db = SQLite.openDatabase(
  {name: 'MainDB', location: 'default'},
  () => {
    console.log('success opening DB');
  },
  () => {
    console.log('error opening DB');
  },
);

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [count, setCount] = React.useState(0);
  const onPress = () => setCount(prevCount => prevCount + 1);
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState('');
  const [data, setData] = React.useState([]);

  React.useEffect(()=>{
    getData();
  },[])

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const createTable = async () => {
    console.log('inside create table');
    await db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          ' users ' +
          '(Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Age INTEGER);',
      );
    });
    insertData();
  };

  const insertData = async () => {
    console.log('inside insertData');
    // db.transaction((tx)=>{
    //   tx.executeSql(
    //     "INSERT INTO "
    //     +" users "
    //     +"(Name ,Age) values('shuraif',26);"
    //   )

    // })

    console.log(name);
    console.log(age);
    await db.transaction(tx => {
      tx.executeSql('INSERT INTO ' + ' users ' + '(Name ,Age) VALUES(?,?)', [
        name,
        age,
      ]);
    });
  };

  const getData = async() => {

    // const _data =  DBService.fetchData();
    //   setData(_data);

    let _data = [];
    await db.transaction(tx => {
      tx.executeSql('SELECT * FROM  users ', [], (tx, results) => {
        if (results.rows.length > 0) {
         
          for (var i = 0; i < results.rows.length; i++) {
           // console.log(results.rows.item(i), i);
            let item = results.rows.item(i);
            //console.log(item)
            _data.push({Id: item.Id, Name: item.Name, Age: item.Age});
            
          }
          console.log(_data)
          setData(_data);
        
        }
      });
    });
  
  
  };



   
  

 const renderItem=({item})=>{

  return(
    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
      <Text style={{color:'red'}}>{item.Id}</Text>
      <Text style={{color:'red'}}>{item.Name}</Text>
      <Text style={{color:'red'}}>{item.Age}</Text>
    </View>
  )
 }
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* <ScrollView
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}> */}
        <View style={{justifyContent: 'center'}}>
          <TextInput
            style={styles.input}
            onChangeText={setName}
            placeholder="Name"
            value={name}
          />
          <TextInput
            style={styles.input}
            onChangeText={setAge}
            value={age}
            placeholder="Age"
            keyboardType="numeric"
          />

          <Button title="Save" onPress={() => createTable()}/>

          <Button title="Submit"  onPress={() => DBService.fetchData()}/>
           

          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.Id}
          />
        </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    alignItems: 'center',
    //backgroundColor: "#DDDDDD",
    padding: 10,
  },
  countContainer: {
    alignItems: 'center',
    padding: 10,
  },
});

export default App;
