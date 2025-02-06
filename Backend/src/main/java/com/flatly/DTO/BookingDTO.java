package com.flatly.dto;

import com.flatly.model.Booking.BookingStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingDTO {
    private Long id;
    private Long flatId;
    private Long userId;
    private String userEmail;
    private LocalDate startDate;
    private LocalDate endDate;
    private BookingStatus status;
    private String system;
}
