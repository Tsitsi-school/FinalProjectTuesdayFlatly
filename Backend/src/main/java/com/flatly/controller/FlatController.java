package com.flatly.controller;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import com.flatly.dto.FlatDTO;
import com.flatly.service.FlatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flats")
public class FlatController {

    private final FlatService flatService;

    public FlatController(FlatService flatService) {
        this.flatService = flatService;
    }

    // Retrieve all flats
    @GetMapping
    public ResponseEntity<List<FlatDTO>> getAllFlats() {
        List<FlatDTO> flats = flatService.getAllFlats();
        return ResponseEntity.ok(flats);
    }

    // Retrieve a single flat by its ID
    @GetMapping("/{id}")
    public ResponseEntity<FlatDTO> getFlatById(@PathVariable Long id) {
        FlatDTO flatDTO = flatService.getFlatById(id);
        return ResponseEntity.ok(flatDTO);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FlatDTO> createFlat(
            @RequestPart("flat") FlatDTO flatDTO,
            @RequestPart(value = "files", required = false) MultipartFile[] files) {

        // Create the flat without images first
        FlatDTO createdFlat = flatService.createFlat(flatDTO);

        // If files were sent, upload them and update the flat's images
        if (files != null && files.length > 0) {
            List<String> imageUrls = flatService.uploadFlatImages(createdFlat.getId(), files);
            createdFlat.setImages(imageUrls);
        }

        return ResponseEntity.ok(createdFlat);
    }

    // Update an existing flat with optional image uploads
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FlatDTO> updateFlat(
            @PathVariable Long id,
            @RequestPart("flat") FlatDTO flatDTO,
            @RequestPart(value = "files", required = false) MultipartFile[] files) {

        // Update the flat data (excluding images)
        FlatDTO updatedFlat = flatService.updateFlat(id, flatDTO);

        // If new image files are provided, upload them and update the flat's images
        if (files != null && files.length > 0) {
            List<String> imageUrls = flatService.uploadFlatImages(id, files);
            updatedFlat.setImages(imageUrls);
        }

        return ResponseEntity.ok(updatedFlat);
    }

    // Delete a flat by its ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlat(@PathVariable Long id) {
        flatService.deleteFlat(id);
        return ResponseEntity.noContent().build();
    }

    // Delete a specific image from a flat
    @DeleteMapping("/{id}/images")
    public ResponseEntity<FlatDTO> deleteFlatImage(
            @PathVariable Long id,
            @RequestParam String imageUrl) {
        FlatDTO updatedFlat = flatService.deleteFlatImage(id, imageUrl);
        return ResponseEntity.ok(updatedFlat);
    }

    // Any combination of query parameters can be provided.
    @GetMapping("/filter")
    public ResponseEntity<List<FlatDTO>> filterFlats(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer roomNumber,
            @RequestParam(required = false) Float minDistance,
            @RequestParam(required = false) Float maxDistance) {
        List<FlatDTO> flats = flatService.filterFlats(location, minPrice, maxPrice, roomNumber, minDistance, maxDistance);
        return ResponseEntity.ok(flats);
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<List<String>> uploadFlatImages(@PathVariable Long id,
                                                         @RequestParam("files") MultipartFile[] files) {
        List<String> imageUrls = flatService.uploadFlatImages(id, files);
        return ResponseEntity.ok(imageUrls);
    }

    /**
     * Endpoint to retrieve image URLs associated with a flat.
     *
     * @param id The ID of the flat.
     * @return A list of image URLs for the flat.
     */
    @GetMapping("/{id}/images")
    public ResponseEntity<List<String>> getFlatImages(@PathVariable Long id) {
        List<String> imageUrls = flatService.getFlatImages(id);
        return ResponseEntity.ok(imageUrls);
    }

}
