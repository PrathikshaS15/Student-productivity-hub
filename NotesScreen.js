import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import axios from 'axios';

export default function NotesScreen({route}) {
  const user = route.params?.user;
  const [note, setNote] = useState('');
  const [reminder, setReminder] = useState('');

  const save = async () => {
    try {
      const res = await axios.post('http://10.0.2.2:5000/api/notes/add', {
        user_id: user.id, note, reminder
      });
      alert('Saved');
    } catch (err) {
      alert('Save failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Note</Text>
      <TextInput placeholder="Note" value={note} onChangeText={setNote} style={styles.input} multiline />
      <TextInput placeholder="Reminder (YYYY-MM-DD HH:MM)" value={reminder} onChangeText={setReminder} style={styles.input} />
      <Button title="Save Note" onPress={save} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:20},
  title:{fontSize:20, marginBottom:10},
  input:{borderWidth:1, padding:8, marginBottom:10, borderRadius:6}
});
