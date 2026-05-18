package lv.pmeu.pmeu_sistema.shiftResult.repo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResult;


public interface ShiftResultRepository extends JpaRepository<ShiftResult, Long> {

    List<ShiftResult> findByShiftId(Long shiftId);

    List<ShiftResult> findByEntryDateBetween(LocalDate from, LocalDate to);
}
