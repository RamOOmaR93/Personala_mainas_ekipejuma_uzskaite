package lv.pmeu.pmeu_sistema.shiftResult.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResultCategory;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShiftResultSummaryDto {

    private ShiftResultCategory category;
    private Integer totalAmount;
}