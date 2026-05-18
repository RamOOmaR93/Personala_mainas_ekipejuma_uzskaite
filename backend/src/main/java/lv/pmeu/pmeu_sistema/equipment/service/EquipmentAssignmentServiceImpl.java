package lv.pmeu.pmeu_sistema.equipment.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lv.pmeu.pmeu_sistema.equipment.dto.EquipmentAssignmentRequest;
import lv.pmeu.pmeu_sistema.equipment.model.EquipmentAssignment;
import lv.pmeu.pmeu_sistema.equipment.model.EquipmentItem;
import lv.pmeu.pmeu_sistema.equipment.repo.EquipmentAssignmentRepository;
import lv.pmeu.pmeu_sistema.equipment.repo.EquipmentItemRepository;
import lv.pmeu.pmeu_sistema.user.model.User;
import lv.pmeu.pmeu_sistema.user.repo.UserRepository;

@Service
public class EquipmentAssignmentServiceImpl implements IEquipmentAssignmentService {

    private final EquipmentAssignmentRepository equipmentAssignmentRepository;
    private final UserRepository userRepository;
    private final EquipmentItemRepository equipmentItemRepository;

    public EquipmentAssignmentServiceImpl(EquipmentAssignmentRepository equipmentAssignmentRepository,
                                          UserRepository userRepository, EquipmentItemRepository equipmentItemRepository) {
        this.equipmentAssignmentRepository = equipmentAssignmentRepository;
        this.userRepository = userRepository;
        this.equipmentItemRepository = equipmentItemRepository;
    }

    @Override
    public EquipmentAssignment assignEquipment(EquipmentAssignmentRequest request) throws Exception {

        if (request == null) {
            throw new Exception("Ekipējuma piešķiršanas dati nav norādīti");
        }

        if (request.getUserId() == null) {
            throw new Exception("Lietotājs nav norādīts");
        }

        if (request.getEquipmentItemId() == null) {
            throw new Exception("Ekipējuma vienība nav norādīta");
        }


        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new Exception("Lietotājs netika atrasts"));

        EquipmentItem item = equipmentItemRepository.findById(request.getEquipmentItemId())
                .orElseThrow(() -> new Exception("Ekipējuma vienība netika atrasta"));

        if (equipmentAssignmentRepository.existsByUserIdAndEquipmentItemIdAndActive(
                request.getUserId(), request.getEquipmentItemId(), true)) {
            throw new Exception("Šis ekipējums jau ir aktīvi piešķirts šim darbiniekam");
        }

        EquipmentAssignment assignment = new EquipmentAssignment();
        assignment.setIssuedDate(request.getIssuedDate());
        assignment.setNotes(request.getNotes());
        assignment.setActive(request.isActive());
        assignment.setUser(user);
        assignment.setEquipmentItem(item);

        return equipmentAssignmentRepository.save(assignment);
    }

    @Override
    public List<EquipmentAssignment> getUserEquipment(Long userId) throws Exception {
        return equipmentAssignmentRepository.findByUserId(userId);
    }


    @Override
    public EquipmentAssignment updateAssignment(Long id, EquipmentAssignmentRequest request) throws Exception {

        if (request == null) {
            throw new Exception("Ekipējuma piešķīruma dati nav norādīti");
        }

        EquipmentAssignment assignment = equipmentAssignmentRepository.findById(id)
                .orElseThrow(() -> new Exception("Ekipējuma piešķīrums netika atrasts"));

        assignment.setIssuedDate(request.getIssuedDate());
        assignment.setNotes(request.getNotes());
        assignment.setActive(request.isActive());

        return equipmentAssignmentRepository.save(assignment);
    }
    

}
