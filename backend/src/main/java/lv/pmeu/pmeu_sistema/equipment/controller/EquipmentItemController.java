package lv.pmeu.pmeu_sistema.equipment.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lv.pmeu.pmeu_sistema.equipment.model.EquipmentItem;
import lv.pmeu.pmeu_sistema.equipment.repo.EquipmentItemRepository;

@RestController
public class EquipmentItemController {

    private final EquipmentItemRepository equipmentItemRepository;

    public EquipmentItemController(EquipmentItemRepository equipmentItemRepository) {
        this.equipmentItemRepository = equipmentItemRepository;
    }

    @GetMapping("/equipment-items")
    public List<EquipmentItem> getAllEquipmentItems() {
        return equipmentItemRepository.findAll();
    }
}
