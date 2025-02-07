#!/bin/bash

# Function to send a POST request to the flats endpoint
test_flats_endpoint() {
    API_URL="http://localhost:8080/api/flats"
    JSON_DATA='{
      "name": "Luxury Apartment",
      "location": "Warsaw, Poland",
      "price": 1200.0,
      "description": "A cozy apartment in the city center.",
      "distance": 2.5,
      "amenities": ["WiFi", "Parking", "Air Conditioning"],
      "availability": "Available",
      "images": ["image1.jpg", "image2.jpg"],
      "roomNumber": 3
    }'

    echo "Sending POST request to /api/flats..."
    curl -X POST "$API_URL" \
         -H "Content-Type: application/json" \
         -d "$JSON_DATA"
    echo
}

# Function to send a POST request to the bookings endpoint
test_bookings_endpoint() {
    API_URL="http://localhost:8080/api/bookings"
    JSON_DATA='{
      "flatId": 1,
      "userId": 1,
      "userEmail": "user@example.com",
      "startDate": "2025-02-01",
      "endDate": "2025-02-05",
      "status": "CANCELLED",
      "system": "Online"
    }'

    echo "Sending POST request to /api/bookings..."
    curl -X POST "$API_URL" \
         -H "Content-Type: application/json" \
         -d "$JSON_DATA"
    echo
}

# Function to send a POST request to the users endpoint
test_users_endpoint() {
    API_URL="http://localhost:8080/api/users"
    JSON_DATA='{
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "password": "securepassword123",
      "roles": "USER"
    }'

    echo "Sending POST request to /api/users..."
    curl -X POST "$API_URL" \
         -H "Content-Type: application/json" \
         -d "$JSON_DATA"
    echo
}

# Display menu
echo "Choose an endpoint to test:"
echo "1. Flats (/api/flats)"
echo "2. Bookings (/api/bookings)"
echo "3. Users (/api/users)"
read -p "Enter your choice (1, 2, or 3): " choice

# Handle user choice
case $choice in
    1)
        test_flats_endpoint
        ;;
    2)
        test_bookings_endpoint
        ;;
    3)
        test_users_endpoint
        ;;
    *)
        echo "Invalid choice. Please run the script again and select 1, 2, or 3."
        ;;
esac
