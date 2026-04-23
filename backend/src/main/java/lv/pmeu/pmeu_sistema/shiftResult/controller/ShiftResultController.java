package lv.pmeu.pmeu_sistema.shiftResult.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultDto;
import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultRequestDto;
import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultSummaryDto;
import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResult;
import lv.pmeu.pmeu_sistema.shiftResult.service.IShiftResultService;




@RestController
@RequestMapping("/shift-results")
public class ShiftResultController {

    private final IShiftResultService shiftResultService;

    public ShiftResultController(IShiftResultService shiftResultService) {
        this.shiftResultService = shiftResultService;
    }

    private ShiftResultDto toDto(ShiftResult result) {
        ShiftResultDto dto = new ShiftResultDto();
        dto.setId(result.getId());
        dto.setCategory(result.getCategory());
        dto.setAmount(result.getAmount());
        dto.setEntryDate(result.getEntryDate());
        dto.setShiftId(result.getShift().getId());
        return dto;
    }


    @PostMapping
    public ResponseEntity<?> addResult(@RequestBody ShiftResultRequestDto request) {
        try {
            ShiftResult result = shiftResultService.addResult(request);
            return ResponseEntity.ok(toDto(result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/shift/{shiftId}")
    public ResponseEntity<?> getResultsByShiftId(@PathVariable Long shiftId) {
        try {
            return ResponseEntity.ok(
                    shiftResultService.getResultsByShiftId(shiftId).stream()
                            .map(this::toDto)
                            .toList()
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Return summarized results for one specific shift
    // Group one shift's result entries by category
    @GetMapping("/shift/{shiftId}/summary")
    public ResponseEntity<?> getShiftSummary(@PathVariable Long shiftId) {
        try {
            return ResponseEntity.ok(shiftResultService.getShiftSummary(shiftId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Return summary for all shifts started on selected date
    // Collect all results from shifts on selected date
    // Group results by category and sum totals
    @GetMapping("/summary/by-shift-date")
    public ResponseEntity<?> getSummaryByShiftStartDate(@RequestParam LocalDate date) {
        try {
            return ResponseEntity.ok(shiftResultService.getSummaryByShiftStartDate(date));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Returns a summary of results for a specific employee within a selected period,
    // based on shifts whose startTime falls inside that period.
    @GetMapping("/summary/user-by-period")
    public List<ShiftResultSummaryDto> getUserShiftSummaryByPeriod(
            @RequestParam Long userId,
            @RequestParam LocalDate from,
            @RequestParam LocalDate to) {
        return shiftResultService.getUserShiftSummaryByPeriod(userId, from, to);
    }

}
