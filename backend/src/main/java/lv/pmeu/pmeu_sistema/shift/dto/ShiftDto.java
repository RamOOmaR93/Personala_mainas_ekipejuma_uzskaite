package lv.pmeu.pmeu_sistema.shift.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ShiftDto {

    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String comment;

    private Long userId;
    private String username;
    private String firstName;
    private String lastName;
}
