package lv.pmeu.pmeu_sistema.equipment.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import lv.pmeu.pmeu_sistema.equipment.model.EquipmentAssignment;

public interface EquipmentAssignmentRepository extends JpaRepository<EquipmentAssignment, Long> {

    List<EquipmentAssignment> findByUserId(Long userId);
}
