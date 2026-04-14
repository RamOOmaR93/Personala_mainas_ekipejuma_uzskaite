package lv.pmeu.pmeu_sistema.shift.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import lv.pmeu.pmeu_sistema.shift.model.Shift;

public interface ShiftRepository extends JpaRepository<Shift, Long> {

    List<Shift> findByUserId(Long userId);
}
