package lv.pmeu.pmeu_sistema.equipment.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EquipmentAssignmentRequest {

    private Long userId;
    private Long equipmentItemId;
    private LocalDate issuedDate;
    private String notes;
    private boolean active;
}
