package lv.pmeu.pmeu_sistema.shift.service;

import java.util.List;

import lv.pmeu.pmeu_sistema.shift.dto.ShiftRequestDto;
import lv.pmeu.pmeu_sistema.shift.model.Shift;

public interface IShiftService {

    Shift createShift(ShiftRequestDto request) throws Exception;

    List<Shift> getUserShifts(Long userId) throws Exception;

    Shift getShiftById(Long id) throws Exception;
}
