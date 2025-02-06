package com.flatly.repository;

import com.flatly.model.Flat;

import java.util.List;

public interface FlatRepositoryCustom {
    List<Flat> filterFlats(String location,
                           Double minPrice,
                           Double maxPrice,
                           Integer roomNumber,
                           Float minDistance,
                           Float maxDistance);
}
