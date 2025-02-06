import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FlatCard({ flat }) {
  return (
    <View style={styles.card}>
      <Text style={styles.location}>{flat.location}</Text>
      <Text style={styles.price}>{flat.price}</Text>
      <Text style={styles.availability}>{flat.availability}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  location: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#666',
  },
  availability: {
    fontSize: 14,
    color: '#888',
  },
});
