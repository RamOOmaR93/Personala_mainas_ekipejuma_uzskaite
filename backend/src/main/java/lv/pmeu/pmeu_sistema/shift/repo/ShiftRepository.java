package lv.pmeu.pmeu_sistema.shift.repo;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import lv.pmeu.pmeu_sistema.shift.model.Shift;

public interface ShiftRepository extends JpaRepository<Shift, Long> {

    List<Shift> findByUserId(Long userId);


    // Find all shifts within a given date range (used for reports)
    List<Shift> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);

    // Retrieves all shifts for a specific user within a given time period,
    // based on the shift start time (startTime).
    // This is used for reports that are calculated per shift, not by result entryDate.
    List<Shift> findByUserIdAndStartTimeBetween(Long userId, LocalDateTime start, LocalDateTime end);

    
}
