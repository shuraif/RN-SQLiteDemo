import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {name: 'MainDB', location: 'default'},
  () => {
    console.log('success opening DB');
  },
  () => {
    console.log('error opening DB');
  },
);

class DBService {

    fetchData =async ()=>{
      
    const _data = [];
    await db.transaction(tx => {
       tx.executeSql('SELECT * FROM  users ', [], (tx, results) => {
        if (results.rows.length > 0) {
          for (var i = 0; i < results.rows.length; i++) {
            let item = results.rows.item(i);
            _data.push({Id: item.Id, Name: item.Name, Age: item.Age});
          }
         
        }
      });
    });

    console.log(_data);
    return _data;
    
  };
}
export default new DBService();
