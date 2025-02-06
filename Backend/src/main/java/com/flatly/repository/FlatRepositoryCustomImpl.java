package com.flatly.repository;

import com.flatly.model.Flat;
import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

@Repository
public class FlatRepositoryCustomImpl implements FlatRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Flat> filterFlats(String location, Double minPrice, Double maxPrice, Integer roomNumber, Float minDistance, Float maxDistance) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Flat> cq = cb.createQuery(Flat.class);
        Root<Flat> flatRoot = cq.from(Flat.class);

        List<Predicate> predicates = new ArrayList<>();

        if (location != null && !location.isEmpty()) {
            predicates.add(cb.like(cb.lower(flatRoot.get("location")), "%" + location.toLowerCase() + "%"));
        }
        if (minPrice != null) {
            predicates.add(cb.greaterThanOrEqualTo(flatRoot.get("price"), minPrice));
        }
        if (maxPrice != null) {
            predicates.add(cb.lessThanOrEqualTo(flatRoot.get("price"), maxPrice));
        }
        if (roomNumber != null) {
            predicates.add(cb.equal(flatRoot.get("roomNumber"), roomNumber));
        }
        if (minDistance != null) {
            predicates.add(cb.greaterThanOrEqualTo(flatRoot.get("distance"), minDistance));
        }
        if (maxDistance != null) {
            predicates.add(cb.lessThanOrEqualTo(flatRoot.get("distance"), maxDistance));
        }

        cq.where(predicates.toArray(new Predicate[0]));
        return entityManager.createQuery(cq).getResultList();
    }
}
