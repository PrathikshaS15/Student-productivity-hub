import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Picker} from 'react-native';
import axios from 'axios';

export default function RegisterScreen({navigation}) {
  const [name,setName]=useState(''); const [email,setEmail]=useState('');
  const [phone,setPhone]=useState(''); const [roll,setRoll]=useState('');
  const [password,setPassword]=useState(''); const [role,setRole]=useState('student');

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://10.0.2.2:5000/api/auth/register', {
        name,email,phone,roll,password,role
      });
      alert('Registered');
      navigation.navigate('Login');
    } catch (err) {
      alert('Register failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput placeholder="Full name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={styles.input} />
      <TextInput placeholder="Roll number" value={roll} onChangeText={setRoll} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <View style={{marginBottom:10}}>
        <Button title={role==='student' ? 'Role: Student' : 'Role: Teacher'} onPress={() => setRole(role==='student'?'teacher':'student')} />
      </View>
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:20, justifyContent:'center'},
  title:{fontSize:22, textAlign:'center', marginBottom:20},
  input:{borderWidth:1, padding:8, marginBottom:10, borderRadius:6}
});
