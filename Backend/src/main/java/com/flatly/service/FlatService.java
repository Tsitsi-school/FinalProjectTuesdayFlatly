package com.flatly.service;

import org.springframework.web.multipart.MultipartFile;
import com.flatly.dto.FlatDTO;
import com.flatly.model.Flat;
import com.flatly.repository.FlatRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class FlatService {

    private final FlatRepository flatRepository;
    private final S3Service s3Service;

    public FlatService(FlatRepository flatRepository, S3Service s3Service) {
        this.flatRepository = flatRepository;
        this.s3Service = s3Service;
    }

    // Other CRUD methods remain unchanged:
    public List<FlatDTO> getAllFlats() {
        return flatRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public FlatDTO getFlatById(Long id) {
        Flat flat = flatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flat not found with id: " + id));
        return convertToDTO(flat);
    }

    public FlatDTO createFlat(FlatDTO flatDTO) {
        Flat flat = convertToEntity(flatDTO);
        Flat savedFlat = flatRepository.save(flat);
        return convertToDTO(savedFlat);
    }

    public FlatDTO updateFlat(Long id, FlatDTO flatDTO) {
        Flat flat = flatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flat not found with id: " + id));
        // Update fields
        flat.setName(flatDTO.getName());
        flat.setLocation(flatDTO.getLocation());
        flat.setPrice(flatDTO.getPrice());
        flat.setDescription(flatDTO.getDescription());
        flat.setDistance(flatDTO.getDistance());
        flat.setAmenities(flatDTO.getAmenities());
        flat.setAvailability(flatDTO.getAvailability());
        flat.setImages(flatDTO.getImages());
        flat.setRoomNumber(flatDTO.getRoomNumber());
        Flat updatedFlat = flatRepository.save(flat);
        return convertToDTO(updatedFlat);
    }

    public List<String> uploadFlatImages(Long flatId, MultipartFile[] files) {
      Flat flat = flatRepository.findById(flatId)
              .orElseThrow(() -> new RuntimeException("Flat not found with id: " + flatId));

      List<String> imageUrls = new ArrayList<>();
      // Upload each file to S3 and collect its URL
      for (MultipartFile file : files) {
          String imageUrl = s3Service.uploadFile(file);
          imageUrls.add(imageUrl);
      }
      // If the flat already has images, add new ones; otherwise, set the list
      if (flat.getImages() != null) {
          flat.getImages().addAll(imageUrls);
      } else {
          flat.setImages(imageUrls);
      }
      flatRepository.save(flat);
      return imageUrls;
    }

    public List<String> getFlatImages(Long flatId) {
        Flat flat = flatRepository.findById(flatId)
                .orElseThrow(() -> new RuntimeException("Flat not found with id: " + flatId));
        return flat.getImages();
    }

    public void deleteFlat(Long id) {
        flatRepository.deleteById(id);
    }

    public FlatDTO deleteFlatImage(Long flatId, String imageUrl) {
        Flat flat = flatRepository.findById(flatId)
                .orElseThrow(() -> new RuntimeException("Flat not found with id: " + flatId));

        // Remove the image URL from the flat's image list, if present
        if (flat.getImages() != null && flat.getImages().remove(imageUrl)) {
            // Optionally delete the file from S3
            s3Service.deleteFile(imageUrl);
            flatRepository.save(flat);
        } else {
            throw new RuntimeException("Image URL not found for flat id: " + flatId);
        }
        
        return convertToDTO(flat);
    }
    // Unified dynamic filtering method:
    public List<FlatDTO> filterFlats(String location,
                                     Double minPrice,
                                     Double maxPrice,
                                     Integer roomNumber,
                                     Float minDistance,
                                     Float maxDistance) {
        List<Flat> flats = flatRepository.filterFlats(location, minPrice, maxPrice, roomNumber, minDistance, maxDistance);
        return flats.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Conversion methods:
    private FlatDTO convertToDTO(Flat flat) {
        FlatDTO dto = new FlatDTO();
        dto.setId(flat.getId());
        dto.setName(flat.getName());
        dto.setLocation(flat.getLocation());
        dto.setPrice(flat.getPrice());
        dto.setDescription(flat.getDescription());
        dto.setDistance(flat.getDistance());
        dto.setAmenities(flat.getAmenities());
        dto.setAvailability(flat.getAvailability());
        dto.setImages(flat.getImages());
        dto.setRoomNumber(flat.getRoomNumber());
        return dto;
    }

    private Flat convertToEntity(FlatDTO flatDTO) {
        Flat flat = new Flat();
        flat.setId(flatDTO.getId());
        flat.setName(flatDTO.getName());
        flat.setLocation(flatDTO.getLocation());
        flat.setPrice(flatDTO.getPrice());
        flat.setDescription(flatDTO.getDescription());
        flat.setDistance(flatDTO.getDistance());
        flat.setAmenities(flatDTO.getAmenities());
        flat.setAvailability(flatDTO.getAvailability());
        flat.setImages(flatDTO.getImages());
        flat.setRoomNumber(flatDTO.getRoomNumber());
        return flat;
    }
}
