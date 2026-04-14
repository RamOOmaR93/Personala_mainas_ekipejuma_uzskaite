package lv.pmeu.pmeu_sistema.shiftResult.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResult;

public interface ShiftResultRepository extends JpaRepository<ShiftResult, Long> {

    List<ShiftResult> findByShiftId(Long shiftId);
}
