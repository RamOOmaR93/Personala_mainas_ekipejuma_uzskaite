package lv.pmeu.pmeu_sistema.equipment.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lv.pmeu.pmeu_sistema.equipment.dto.EquipmentAssignmentRequest;
import lv.pmeu.pmeu_sistema.equipment.model.EquipmentAssignment;
import lv.pmeu.pmeu_sistema.equipment.model.EquipmentItem;
import lv.pmeu.pmeu_sistema.equipment.repo.EquipmentAssignmentRepository;
import lv.pmeu.pmeu_sistema.equipment.repo.EquipmentItemRepository;
import lv.pmeu.pmeu_sistema.user.model.User;
import lv.pmeu.pmeu_sistema.user.repo.UserRepository;

@RestController
@RequestMapping("/users")
public class EquipmentAssignmentController {

    private final EquipmentAssignmentRepository equipmentAssignmentRepository;
    private final UserRepository userRepository;
    private final EquipmentItemRepository equipmentItemRepository;

   public EquipmentAssignmentController(EquipmentAssignmentRepository equipmentAssignmentRepository,
                                        UserRepository userRepository, EquipmentItemRepository equipmentItemRepository) {
        this.equipmentAssignmentRepository = equipmentAssignmentRepository;
        this.userRepository = userRepository;
        this.equipmentItemRepository = equipmentItemRepository;
    }

    @GetMapping("/{userId}/equipment")
    public List<EquipmentAssignment> getUserEquipment(@PathVariable Long userId) {
        return equipmentAssignmentRepository.findByUserId(userId);
    }


    @PostMapping("/assignments")
    public EquipmentAssignment assignEquipment(@RequestBody EquipmentAssignmentRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        EquipmentItem item = equipmentItemRepository.findById(request.getEquipmentItemId())
            .orElseThrow(() -> new RuntimeException("Equipment item not found"));

        EquipmentAssignment assignment = new EquipmentAssignment();
        assignment.setIssuedDate(request.getIssuedDate());
        assignment.setNotes(request.getNotes());
        assignment.setActive(request.isActive());
        assignment.setUser(user);
        assignment.setEquipmentItem(item);

        return equipmentAssignmentRepository.save(assignment);
    }

}
