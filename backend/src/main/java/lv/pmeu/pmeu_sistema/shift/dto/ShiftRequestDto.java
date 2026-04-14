package lv.pmeu.pmeu_sistema.shift.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ShiftRequestDto {

    private Long userId;
    private LocalDate shiftDate;
    private String comment;
}
