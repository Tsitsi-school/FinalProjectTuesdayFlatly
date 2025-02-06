package com.flatly.dto;

import lombok.Data;
import java.util.List;

@Data
public class FlatDTO {
    private Long id;
    private String name;
    private String location;
    private Double price;
    private String description;
    private Float distance;
    private List<String> amenities;
    private String availability;
    private List<String> images;
    private Integer roomNumber;
}
