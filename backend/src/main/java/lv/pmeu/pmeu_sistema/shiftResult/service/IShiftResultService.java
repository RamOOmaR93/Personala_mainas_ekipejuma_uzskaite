package lv.pmeu.pmeu_sistema.shiftResult.service;

import java.util.List;

import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultRequestDto;
import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResult;

public interface IShiftResultService {

    ShiftResult addResult(ShiftResultRequestDto request) throws Exception;

    List<ShiftResult> getResultsByShiftId(Long shiftId) throws Exception;
}
