package lv.pmeu.pmeu_sistema.shiftResult.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lv.pmeu.pmeu_sistema.shift.model.Shift;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShiftResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ShiftResultCategory category;

    private Integer amount;

    private LocalDate entryDate;

    // Many results can belong to one shift
    @ManyToOne
    @JoinColumn(name = "shift_id")
    private Shift shift;
}
