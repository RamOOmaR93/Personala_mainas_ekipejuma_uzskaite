package lv.pmeu.pmeu_sistema.equipment.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lv.pmeu.pmeu_sistema.equipment.model.EquipmentAssignment;
import lv.pmeu.pmeu_sistema.equipment.repo.EquipmentAssignmentRepository;

@RestController
@RequestMapping("/users")
public class EquipmentAssignmentController {

    private final EquipmentAssignmentRepository equipmentAssignmentRepository;

    public EquipmentAssignmentController(EquipmentAssignmentRepository equipmentAssignmentRepository) {
        this.equipmentAssignmentRepository = equipmentAssignmentRepository;
    }

    @GetMapping("/{userId}/equipment")
    public List<EquipmentAssignment> getUserEquipment(@PathVariable Long userId) {
        return equipmentAssignmentRepository.findByUserId(userId);
    }
}
