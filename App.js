/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,TouchableOpacity,TextInput
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import SQLite from 'react-native-sqlite-storage'


const db=SQLite.openDatabase({name: 'MainDB', location: 'default'},
()=>{
 console.log('success opening DB')
}, 
()=>{
  console.log('error opening DB')
});


const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [count, setCount] = React.useState(0);
  const onPress = () => setCount(prevCount => prevCount + 1);
  const [name, setName] = React.useState("");
  const [age, setAge] = React.useState(0);
  


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  };

  const createTable=async()=>{

    console.log('inside create table')
    await db.transaction((tx)=>{
       tx.executeSql(
        "CREATE TABLE IF NOT EXISTS "
        +" users "
        +"(Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Age INTEGER);"
      )

    })
    insertData()
  }

  const insertData=async()=>{
    console.log('inside insertData')
    // db.transaction((tx)=>{
    //   tx.executeSql(
    //     "INSERT INTO "
    //     +" users "
    //     +"(Name ,Age) values('shuraif',26);"
    //   )

    // })

    console.log(name)
    console.log(age)
    await db.transaction((tx)=>{
       tx.executeSql(
        "INSERT INTO "
        +" users "
        +"(Name ,Age) VALUES(?,?)",[name,age]
      )

    })
    
  }

  const getData=async()=>{
   await db.transaction((tx)=>{
      tx.executeSql(
        "SELECT * FROM  users ",[],
        (tx,results)=>{
          if(results.rows.length>0){
           // console.log(results)

            // for(var user in results.item){
            //   console.log(user)
            //   //console.log(results.rows.item(0).Age)
            // }
            for(var i=0;i<results.rows.length;i++){

              console.log(results.rows.item(i), i )
            }
           
          }else{
            console.log('no data returnes')
          }
         
        }
        
      )

    })
  }


  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
      keyboardShouldPersistTaps='handled'
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
          <View style={{justifyContent:'center'}}>

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
        placeholder="Ager"
        keyboardType="numeric"
      />

          <TouchableOpacity
        style={styles.button}
        onPress={()=>createTable()}
      >
        <Text>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={()=>getData()}
      >
        <Text>Fetch</Text>
      </TouchableOpacity>
          </View>
        
       

      </ScrollView>
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
    alignItems: "center",
    //backgroundColor: "#DDDDDD",
    padding: 10
  },
  countContainer: {
    alignItems: "center",
    padding: 10
  }
});

export default App;
