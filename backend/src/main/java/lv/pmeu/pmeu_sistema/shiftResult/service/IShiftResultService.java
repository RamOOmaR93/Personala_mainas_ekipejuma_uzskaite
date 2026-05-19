package lv.pmeu.pmeu_sistema.shiftResult.service;

import java.time.LocalDate;
import java.util.List;

import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultRequestDto;
import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultSummaryDto;
import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultUpdateDto;
import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResult;

public interface IShiftResultService {

    ShiftResult addResult(ShiftResultRequestDto request) throws Exception;

    // Update an existing shift result.
    // Only category, amount and entryDate can be changed.
    ShiftResult updateResult(Long resultId, ShiftResultUpdateDto request) throws Exception;

    ShiftResult getResultById(Long resultId) throws Exception;

    List<ShiftResult> getResultsByShiftId(Long shiftId) throws Exception;

    List<ShiftResultSummaryDto> getShiftSummary(Long shiftId) throws Exception;

    List<ShiftResultSummaryDto> getSummaryByShiftStartDate(LocalDate date) throws Exception;

    // Generates a summary of shift results for a specific user within a given period,
    // based on the shifts whose startTime falls inside that period.
    // The results are grouped by category and summed by amount.
    List<ShiftResultSummaryDto> getUserShiftSummaryByPeriod(Long userId, LocalDate from, LocalDate to);

    // Generates a summary of shift results within a given period,
    // based on ShiftResult entryDate, not shift startTime.
    // The results are grouped by category and summed by amount.
    List<ShiftResultSummaryDto> getSummaryByEntryDatePeriod(LocalDate from, LocalDate to) throws Exception;
}
