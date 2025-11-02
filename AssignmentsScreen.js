import React, {useState} from 'react';
import {View, Text, Button, StyleSheet, TextInput} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

export default function AssignmentsScreen({route}) {
  const user = route.params?.user;
  const [comment, setComment] = useState('');

  const pickAndUpload = async () => {
    const res = await DocumentPicker.getDocumentAsync({});
    if(res.type === 'success') {
      const form = new FormData();
      const fileUri = res.uri;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      const fileName = res.name || fileUri.split('/').pop();
      const fileType = res.mimeType || 'application/octet-stream';
      form.append('file', { uri: fileUri, name: fileName, type: fileType });
      form.append('user_id', String(user.id));
      form.append('comment', comment || '');
      try {
        const r = await fetch('http://10.0.2.2:5000/api/assignments/upload', {
          method: 'POST',
          body: form,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const j = await r.json();
        alert('Uploaded');
      } catch (err) {
        alert('Upload failed');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assignments</Text>
      <TextInput placeholder="Comment (optional)" value={comment} onChangeText={setComment} style={styles.input} />
      <Button title="Pick & Upload File" onPress={pickAndUpload} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:20},
  title:{fontSize:20, marginBottom:10},
  input:{borderWidth:1, padding:8, marginBottom:10, borderRadius:6}
});
