package com.flatly.repository;

import com.flatly.model.Flat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlatRepository extends JpaRepository<Flat, Long>, FlatRepositoryCustom {
    // You can remove individual filtering methods as they are now handled by the custom repository.
}
