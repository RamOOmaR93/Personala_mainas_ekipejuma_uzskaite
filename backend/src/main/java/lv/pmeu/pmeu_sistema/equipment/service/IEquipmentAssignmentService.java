package lv.pmeu.pmeu_sistema.equipment.service;

import java.util.List;

import lv.pmeu.pmeu_sistema.equipment.dto.EquipmentAssignmentRequest;
import lv.pmeu.pmeu_sistema.equipment.model.EquipmentAssignment;

public interface IEquipmentAssignmentService {

    List<EquipmentAssignment> getUserEquipment(Long userId) throws Exception;

    EquipmentAssignment assignEquipment(EquipmentAssignmentRequest request) throws Exception;

    EquipmentAssignment updateAssignment(Long id, EquipmentAssignmentRequest request) throws Exception;
}
