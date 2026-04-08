package lv.pmeu.pmeu_sistema.equipment.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lv.pmeu.pmeu_sistema.equipment.dto.EquipmentAssignmentRequest;
import lv.pmeu.pmeu_sistema.equipment.model.EquipmentAssignment;
import lv.pmeu.pmeu_sistema.equipment.service.IEquipmentAssignmentService;



@RestController
@RequestMapping("/users")
public class EquipmentAssignmentController {

    
    private final IEquipmentAssignmentService equipmentAssignmentService;

    public EquipmentAssignmentController(IEquipmentAssignmentService equipmentAssignmentService) {
        this.equipmentAssignmentService = equipmentAssignmentService;
    }

    @GetMapping("/{userId}/equipment")
    public List<EquipmentAssignment> getUserEquipment(@PathVariable Long userId) throws Exception {
        return equipmentAssignmentService.getUserEquipment(userId);
    }


    @PostMapping("/assignments")
    public ResponseEntity<?> assignEquipment(@RequestBody EquipmentAssignmentRequest request) {
        try {
            return ResponseEntity.ok(equipmentAssignmentService.assignEquipment(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
