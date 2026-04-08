package lv.pmeu.pmeu_sistema.equipment.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import lv.pmeu.pmeu_sistema.equipment.model.EquipmentItem;

public interface EquipmentItemRepository extends JpaRepository<EquipmentItem, Long> {
}
