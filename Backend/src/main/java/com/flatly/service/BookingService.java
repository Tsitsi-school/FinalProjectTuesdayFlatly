package com.flatly.service;

import com.flatly.dto.BookingDTO;
import com.flatly.model.Booking;
import com.flatly.model.Flat;
import com.flatly.model.User;
import com.flatly.repository.BookingRepository;
import com.flatly.repository.FlatRepository;
import com.flatly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FlatRepository flatRepository;

    @Autowired
    private UserRepository userRepository;

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        return convertToDTO(booking);
    }

    public BookingDTO createBooking(BookingDTO bookingDTO) {
        Booking booking = convertToEntity(bookingDTO);
        Booking savedBooking = bookingRepository.save(booking);
        return convertToDTO(savedBooking);
    }

    public BookingDTO updateBooking(Long id, BookingDTO bookingDTO) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        booking.setUserEmail(bookingDTO.getUserEmail());
        booking.setStartDate(bookingDTO.getStartDate());
        booking.setEndDate(bookingDTO.getEndDate());
        booking.setStatus(bookingDTO.getStatus());
        booking.setSystem(bookingDTO.getSystem());

        Booking updatedBooking = bookingRepository.save(booking);
        return convertToDTO(updatedBooking);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    // New method to get active bookings by user email
    public List<BookingDTO> getActiveBookingsByUserEmail(String userEmail) {
        return bookingRepository.findByUserEmailAndStatus(userEmail, Booking.BookingStatus.ACTIVE).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setFlatId(booking.getFlat().getId());
        dto.setUserId(booking.getUser() != null ? booking.getUser().getId() : null);
        dto.setUserEmail(booking.getUserEmail());
        dto.setStartDate(booking.getStartDate());
        dto.setEndDate(booking.getEndDate());
        dto.setStatus(booking.getStatus());
        dto.setSystem(booking.getSystem());
        return dto;
    }

    private Booking convertToEntity(BookingDTO bookingDTO) {
        Booking booking = new Booking();
        booking.setId(bookingDTO.getId());
        booking.setUserEmail(bookingDTO.getUserEmail());
        booking.setStartDate(bookingDTO.getStartDate());
        booking.setEndDate(bookingDTO.getEndDate());
        booking.setStatus(bookingDTO.getStatus());
        booking.setSystem(bookingDTO.getSystem());

        Flat flat = flatRepository.findById(bookingDTO.getFlatId())
                .orElseThrow(() -> new RuntimeException("Flat not found with id: " + bookingDTO.getFlatId()));
        booking.setFlat(flat);

        if (bookingDTO.getUserId() != null) {
            User user = userRepository.findById(bookingDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + bookingDTO.getUserId()));
            booking.setUser(user);
        }

        return booking;
    }
}
