package com.flatly.controller;

import com.flatly.dto.FlatDTO;
import com.flatly.dto.BookingDTO;
import com.flatly.service.BookingService;
import com.flatly.service.FlatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;
import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private final BookingService bookingService;
    private final FlatService flatService;

    public BookingController(BookingService bookingService, FlatService flatService) {
        this.bookingService = bookingService;
        this.flatService = flatService;
    }

    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        List<BookingDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        BookingDTO bookingDTO = bookingService.getBookingById(id);
        return ResponseEntity.ok(bookingDTO);
    }

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO bookingDTO) {
        BookingDTO createdBooking = bookingService.createBooking(bookingDTO);
        return ResponseEntity.ok(createdBooking);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingDTO> updateBooking(
            @PathVariable Long id,
            @RequestBody BookingDTO bookingDTO) {
        BookingDTO updatedBooking = bookingService.updateBooking(id, bookingDTO);
        return ResponseEntity.ok(updatedBooking);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/active")
    public ResponseEntity<List<BookingDTO>> getActiveBookingsByUserEmail(@RequestParam String userEmail) {
        List<BookingDTO> activeBookings = bookingService.getActiveBookingsByUserEmail(userEmail);
        return ResponseEntity.ok(activeBookings);
    }

    @GetMapping("/active/flats")
    public ResponseEntity<List<Map<String, Object>>> getActiveBookingFlatsByUserEmail(@RequestParam String userEmail) {
        // Get active bookings for the user.
        List<BookingDTO> activeBookings = bookingService.getActiveBookingsByUserEmail(userEmail);

        // Map each booking to a JSON object containing booking_id and flat details.
        List<Map<String, Object>> result = activeBookings.stream().map(booking -> {
            Map<String, Object> map = new HashMap<>();
            map.put("booking_id", booking.getId());
            // Retrieve the flat details for the given flatId.
            map.put("flat", flatService.getFlatById(booking.getFlatId()));
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
