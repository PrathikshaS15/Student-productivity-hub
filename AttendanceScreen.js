import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import axios from 'axios';

export default function AttendanceScreen({route}) {
  const user = route.params?.user;
  const [location, setLocation] = useState('');

  const mark = async () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];
    try {
      await axios.post('http://10.0.2.2:5000/api/attendance/mark', {
        user_id: user.id, date, time, location
      });
      alert('Attendance marked');
    } catch (err) {
      alert('Error marking attendance');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>
      <TextInput placeholder="Location (GPS/Address)" value={location} onChangeText={setLocation} style={styles.input} />
      <Button title="Mark" onPress={mark} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:20},
  title:{fontSize:20, marginBottom:10},
  input:{borderWidth:1, padding:8, marginBottom:10, borderRadius:6}
});
