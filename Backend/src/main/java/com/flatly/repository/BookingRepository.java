package com.flatly.repository;

import com.flatly.model.Booking;
import com.flatly.model.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Existing methods
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByUserEmailAndStatus(String userEmail, BookingStatus status);

    // New method: Count bookings by status
    long countByStatus(BookingStatus status);

    // New method: Get top 10 most recent bookings based on the createdAt field
    List<Booking> findTop10ByOrderByCreatedAtDesc();

    // New method: Find the most active user (the one with the most bookings)
    // Note: Since the user table is named "users", we join with "users"
    @Query(value = "SELECT CONCAT(u.first_name, ' ', u.last_name) AS fullName, COUNT(b.id) AS bookingCount " +
                   "FROM booking b JOIN users u ON b.user_id = u.id " +
                   "GROUP BY u.id " +
                   "ORDER BY bookingCount DESC LIMIT 1", nativeQuery = true)
    Object findMostActiveUser();
}
