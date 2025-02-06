package com.flatly.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.flatly.model.Booking;
import com.flatly.repository.BookingRepository;
import com.flatly.repository.FlatRepository;
import com.flatly.repository.UserRepository;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final FlatRepository flatRepository;

    public DashboardController(BookingRepository bookingRepository, UserRepository userRepository, FlatRepository flatRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.flatRepository = flatRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalFlats", flatRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalBookings", bookingRepository.count());
        stats.put("activeBookings", bookingRepository.countByStatus(Booking.BookingStatus.ACTIVE));
        stats.put("cancelledBookings", bookingRepository.countByStatus(Booking.BookingStatus.CANCELLED));

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent-activities")
    public ResponseEntity<?> getRecentActivities() {
        List<Booking> recentBookings = bookingRepository.findTop10ByOrderByCreatedAtDesc();

        List<Map<String, Object>> activities = recentBookings.stream().map(booking -> {
            Map<String, Object> activity = new HashMap<>();

            // Ensure user and flat exist before accessing their properties
            String userName = (booking.getUser() != null) ? 
                            booking.getUser().getFirstName() + " " + booking.getUser().getLastName() 
                            : "Unknown User";

            String flatId = (booking.getFlat() != null) ? 
                            "Flat: " + booking.getFlat().getName() 
                            : "Unknown Flat";

            activity.put("description", "User " + userName + " booked " + flatId);
            activity.put("timestamp", booking.getCreatedAt());

            return activity;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(activities);
    }


    @GetMapping("/most-active-user")
    public ResponseEntity<?> getMostActiveUser() {
        try {
            Object result = bookingRepository.findMostActiveUser();

            // Debugging: Print the query result
            System.out.println("Raw Query Result: " + result);

            if (result == null) {
                return ResponseEntity.ok().body(Map.of("message", "No active user found"));
            }

            // Ensure result is treated as an array
            Object[] row = (Object[]) result;

            // Print length of row for debugging
            System.out.println("Row Length: " + row.length);

            if (row.length < 2) {
                return ResponseEntity.status(500).body(Map.of("error", "Query result does not contain enough data", "details", "Expected at least 2 values, but got " + row.length));
            }

            // Extract values correctly
            String name = (String) row[0];  // First Name
            Long bookings = ((Number) row[1]).longValue(); // Convert count to Long

            // Store values in the response map
            Map<String, Object> userData = new HashMap<>();
            userData.put("name", name);
            userData.put("bookings", bookings);

            return ResponseEntity.ok(userData);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch most active user", "details", e.getMessage()));
        }
    }



    

}
