package lv.pmeu.pmeu_sistema.shiftResult.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;
import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResultCategory;

@Getter
@Setter
public class ShiftResultUpdateDto {

    private ShiftResultCategory category;

    private Integer amount;

    private LocalDate entryDate;
}
