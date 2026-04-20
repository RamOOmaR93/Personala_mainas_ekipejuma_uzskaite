package lv.pmeu.pmeu_sistema.shift.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import lv.pmeu.pmeu_sistema.shift.dto.ShiftByDateDto;
import lv.pmeu.pmeu_sistema.shift.dto.ShiftRequestDto;
import lv.pmeu.pmeu_sistema.shift.model.Shift;
import lv.pmeu.pmeu_sistema.shift.repo.ShiftRepository;
import lv.pmeu.pmeu_sistema.user.model.User;
import lv.pmeu.pmeu_sistema.user.repo.UserRepository;

@Service
public class ShiftServiceImpl implements IShiftService {

    private final ShiftRepository shiftRepository;
    private final UserRepository userRepository;

    public ShiftServiceImpl(ShiftRepository shiftRepository, UserRepository userRepository) {
        this.shiftRepository = shiftRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Shift createShift(ShiftRequestDto request) throws Exception {
        if (request == null) {
            throw new Exception("Maiņas dati nav norādīti");
        }

        if (request.getUserId() == null) {
            throw new Exception("Lietotājs nav norādīts");
        }

        if (request.getShiftDate() == null) {
            throw new Exception("Maiņas datums nav norādīts");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new Exception("Lietotājs netika atrasts"));

        Shift shift = new Shift();
        shift.setUser(user);
        shift.setComment(request.getComment());
        shift.setStartTime(request.getShiftDate().atTime(8, 30));
        shift.setEndTime(request.getShiftDate().plusDays(1).atTime(8, 30));

        return shiftRepository.save(shift);
    }

    @Override
    public List<Shift> getUserShifts(Long userId) throws Exception {
        if (userId < 0) {
            throw new Exception("Nepareizs lietotāja ID");
        }

        return shiftRepository.findByUserId(userId);
    }

    @Override
    public Shift getShiftById(Long id) throws Exception {
        return shiftRepository.findById(id)
                .orElseThrow(() -> new Exception("Maiņa netika atrasta"));
    }


    @Override
        public List<ShiftByDateDto> getShiftsByDate(LocalDate date) {

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();

        List<Shift> shifts = shiftRepository.findByStartTimeBetween(startOfDay, endOfDay);

        return shifts.stream()
                .map(shift -> new ShiftByDateDto(
                        shift.getId(),
                        shift.getUser().getId(),
                        shift.getUser().getUsername(),
                        shift.getUser().getFirstName(),
                        shift.getUser().getLastName()
                ))
                .toList();
    }
}
