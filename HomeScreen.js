import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

export default function HomeScreen({route, navigation}) {
  const user = route.params?.user;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {user?.name || 'User'}</Text>
      <Button title="Mark Attendance" onPress={() => navigation.navigate('Attendance', {user})} />
      <Button title="Assignments" onPress={() => navigation.navigate('Assignments', {user})} />
      <Button title="Notes" onPress={() => navigation.navigate('Notes', {user})} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:20, justifyContent:'center'},
  title:{fontSize:20, textAlign:'center', marginBottom:20}
});
