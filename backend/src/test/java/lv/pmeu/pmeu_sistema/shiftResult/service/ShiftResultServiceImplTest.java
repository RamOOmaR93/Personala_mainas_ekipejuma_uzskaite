package lv.pmeu.pmeu_sistema.shiftResult.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import lv.pmeu.pmeu_sistema.shift.repo.ShiftRepository;
import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultRequestDto;
import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultSummaryDto;
import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResult;
import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResultCategory;
import lv.pmeu.pmeu_sistema.shiftResult.repo.ShiftResultRepository;

@ExtendWith(MockitoExtension.class)
class ShiftResultServiceImplTest {

    @Mock
    private ShiftResultRepository shiftResultRepository;

    @Mock
    private ShiftRepository shiftRepository;

    @InjectMocks
    private ShiftResultServiceImpl shiftResultService;

    // Checks if report summary correctly groups results by category and sums amounts
    @Test
    void getSummaryByEntryDatePeriod_shouldGroupResultsByCategoryAndSumAmounts() throws Exception {
        LocalDate from = LocalDate.of(2026, 5, 1);
        LocalDate to = LocalDate.of(2026, 5, 31);

        ShiftResult result1 = new ShiftResult();
        result1.setCategory(ShiftResultCategory.IESNIEGUMS);
        result1.setAmount(3);
        result1.setEntryDate(LocalDate.of(2026, 5, 5));

        ShiftResult result2 = new ShiftResult();
        result2.setCategory(ShiftResultCategory.IESNIEGUMS);
        result2.setAmount(2);
        result2.setEntryDate(LocalDate.of(2026, 5, 6));

        ShiftResult result3 = new ShiftResult();
        result3.setCategory(ShiftResultCategory.RISKU_IZVERTESANA);
        result3.setAmount(4);
        result3.setEntryDate(LocalDate.of(2026, 5, 7));

        when(shiftResultRepository.findByEntryDateBetween(from, to))
                .thenReturn(List.of(result1, result2, result3));

        List<ShiftResultSummaryDto> summary =
                shiftResultService.getSummaryByEntryDatePeriod(from, to);

        assertEquals(2, summary.size());

        int iesniegumsTotal = summary.stream()
                .filter(item -> item.getCategory() == ShiftResultCategory.IESNIEGUMS)
                .findFirst()
                .orElseThrow()
                .getTotalAmount();

        int risksTotal = summary.stream()
                .filter(item -> item.getCategory() == ShiftResultCategory.RISKU_IZVERTESANA)
                .findFirst()
                .orElseThrow()
                .getTotalAmount();

        assertEquals(5, iesniegumsTotal);
        assertEquals(4, risksTotal);
    }


    // Checks if exception is thrown when report period start date is after end date
    @Test
    void getSummaryByEntryDatePeriod_shouldThrowExceptionWhenFromDateIsAfterToDate() {
        LocalDate from = LocalDate.of(2026, 5, 31);
        LocalDate to = LocalDate.of(2026, 5, 1);

        Exception exception = org.junit.jupiter.api.Assertions.assertThrows(
                Exception.class,
                () -> shiftResultService.getSummaryByEntryDatePeriod(from, to)
        );

        assertEquals("Perioda sākuma datums nevar būt pēc beigu datuma", exception.getMessage());
    }


    // Checks if exception is thrown when result amount is zero or negative
    @Test
    void addResult_shouldThrowExceptionWhenAmountIsZeroOrLess() {

        ShiftResultRequestDto request = new ShiftResultRequestDto();
        request.setShiftId(1L);
        request.setCategory(ShiftResultCategory.IESNIEGUMS);
        request.setAmount(0);
        request.setEntryDate(LocalDate.of(2026, 5, 19));

        Exception exception = org.junit.jupiter.api.Assertions.assertThrows(
                Exception.class,
                () -> shiftResultService.addResult(request)
        );

        assertEquals("Daudzumam jābūt lielākam par 0", exception.getMessage());
    }


    // Checks if exception is thrown when result category is missing
    @Test
    void addResult_shouldThrowExceptionWhenCategoryIsMissing() {

        ShiftResultRequestDto request = new ShiftResultRequestDto();
        request.setShiftId(1L);
        request.setCategory(null);
        request.setAmount(5);
        request.setEntryDate(LocalDate.of(2026, 5, 19));

        Exception exception = org.junit.jupiter.api.Assertions.assertThrows(
                Exception.class,
                () -> shiftResultService.addResult(request)
        );

        assertEquals("Rezultāta kategorija nav norādīta", exception.getMessage());
    }


    // Checks if exception is thrown when result entry date is missing
    @Test
    void addResult_shouldThrowExceptionWhenEntryDateIsMissing() {

        ShiftResultRequestDto request = new ShiftResultRequestDto();
        request.setShiftId(1L);
        request.setCategory(ShiftResultCategory.IESNIEGUMS);
        request.setAmount(5);
        request.setEntryDate(null);

        Exception exception = org.junit.jupiter.api.Assertions.assertThrows(
                Exception.class,
                () -> shiftResultService.addResult(request)
        );

        assertEquals("Datums nav norādīts", exception.getMessage());
    }


    // Checks if exception is thrown when shift for the result does not exist
    @Test
    void addResult_shouldThrowExceptionWhenShiftDoesNotExist() {

        ShiftResultRequestDto request = new ShiftResultRequestDto();
        request.setShiftId(999L);
        request.setCategory(ShiftResultCategory.IESNIEGUMS);
        request.setAmount(5);
        request.setEntryDate(LocalDate.of(2026, 5, 19));

        when(shiftRepository.findById(999L))
                .thenReturn(java.util.Optional.empty());

        Exception exception = org.junit.jupiter.api.Assertions.assertThrows(
                Exception.class,
                () -> shiftResultService.addResult(request)
        );

        assertEquals("Maiņa netika atrasta", exception.getMessage());
    }


    // Checks if result is saved successfully when valid data is provided
    @Test
    void addResult_shouldSaveResultSuccessfully() throws Exception {

        ShiftResultRequestDto request = new ShiftResultRequestDto();
        request.setShiftId(1L);
        request.setCategory(ShiftResultCategory.IESNIEGUMS);
        request.setAmount(5);
        request.setEntryDate(LocalDate.of(2026, 5, 19));

        lv.pmeu.pmeu_sistema.shift.model.Shift shift =
                new lv.pmeu.pmeu_sistema.shift.model.Shift();

        shift.setId(1L);
        shift.setStartTime(java.time.LocalDateTime.of(2026, 5, 19, 8, 30));
        shift.setEndTime(java.time.LocalDateTime.of(2026, 5, 20, 8, 30));

        when(shiftRepository.findById(1L))
                .thenReturn(Optional.of(shift));

        ShiftResult savedResult = new ShiftResult();
        savedResult.setCategory(ShiftResultCategory.IESNIEGUMS);
        savedResult.setAmount(5);
        savedResult.setEntryDate(LocalDate.of(2026, 5, 19));

        when(shiftResultRepository.save(org.mockito.ArgumentMatchers.any(ShiftResult.class)))
                .thenReturn(savedResult);

        ShiftResult result = shiftResultService.addResult(request);

        assertEquals(5, result.getAmount());
        assertEquals(ShiftResultCategory.IESNIEGUMS, result.getCategory());
    }


    // Checks if exception is thrown when result entry date is outside of the shift period
    @Test
    void addResult_shouldThrowExceptionWhenEntryDateIsOutsideShiftPeriod() {

        ShiftResultRequestDto request = new ShiftResultRequestDto();
        request.setShiftId(1L);
        request.setCategory(ShiftResultCategory.IESNIEGUMS);
        request.setAmount(5);

        // Date out of time zone for shift start and end time
        request.setEntryDate(LocalDate.of(2026, 5, 25));

        lv.pmeu.pmeu_sistema.shift.model.Shift shift =
                new lv.pmeu.pmeu_sistema.shift.model.Shift();

        shift.setId(1L);

        shift.setStartTime(java.time.LocalDateTime.of(2026, 5, 19, 8, 30));
        shift.setEndTime(java.time.LocalDateTime.of(2026, 5, 20, 8, 30));

        when(shiftRepository.findById(1L))
                .thenReturn(Optional.of(shift));

        Exception exception = org.junit.jupiter.api.Assertions.assertThrows(
                Exception.class,
                () -> shiftResultService.addResult(request)
        );

        assertEquals(
                "Rezultāta datums drīkst būt tikai maiņas sākuma diena vai nākamā diena",
                exception.getMessage()
        );
    }



}