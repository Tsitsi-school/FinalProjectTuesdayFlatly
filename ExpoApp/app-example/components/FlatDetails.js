import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FlatDetails({ flat }) {
  return (
    <View>
      <Text style={styles.location}>{flat.location}</Text>
      <Text style={styles.price}>{flat.price}</Text>
      <Text style={styles.description}>Spacious 2-bedroom apartment</Text>
      <Text style={styles.amenities}>Amenities: WiFi, AC, Parking</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  location: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 20,
    color: '#666',
  },
  description: {
    fontSize: 16,
    marginTop: 8,
  },
  amenities: {
    fontSize: 16,
    marginTop: 8,
    color: '#888',
  },
});
