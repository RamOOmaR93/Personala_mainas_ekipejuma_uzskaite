package lv.pmeu.pmeu_sistema.shiftResult.service;

import java.time.LocalDate;
import java.util.List;

import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultRequestDto;
import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultSummaryDto;
import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResult;

public interface IShiftResultService {

    ShiftResult addResult(ShiftResultRequestDto request) throws Exception;

    List<ShiftResult> getResultsByShiftId(Long shiftId) throws Exception;

    List<ShiftResultSummaryDto> getShiftSummary(Long shiftId) throws Exception;

    List<ShiftResultSummaryDto> getSummaryByShiftStartDate(LocalDate date) throws Exception;
}
