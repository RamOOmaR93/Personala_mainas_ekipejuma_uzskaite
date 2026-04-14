package lv.pmeu.pmeu_sistema.shiftResult.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResultCategory;

@Getter
@Setter
@NoArgsConstructor
public class ShiftResultDto {

    private Long id;
    private ShiftResultCategory category;
    private Integer amount;
    private LocalDate entryDate;
    private Long shiftId;
}
