import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BookingSummary({ flat }) {
  return (
    <View>
      <Text style={styles.title}>Booking Summary</Text>
      <Text style={styles.flatName}>{flat.location}</Text>
      <Text style={styles.dates}>Booking Dates: 01/01/2024 - 01/31/2024</Text>
      <Text style={styles.price}>{flat.price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  flatName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dates: {
    fontSize: 16,
    color: '#666',
  },
  price: {
    fontSize: 18,
    color: '#007BFF',
  },
});
