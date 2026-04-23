package lv.pmeu.pmeu_sistema.shiftResult.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lv.pmeu.pmeu_sistema.shift.model.Shift;
import lv.pmeu.pmeu_sistema.shift.repo.ShiftRepository;
import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultRequestDto;
import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultSummaryDto;
import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResult;
import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResultCategory;
import lv.pmeu.pmeu_sistema.shiftResult.repo.ShiftResultRepository;

@Service
public class ShiftResultServiceImpl implements IShiftResultService {

    // Repository for saving and loading shift results
    private final ShiftResultRepository shiftResultRepository;  

    // Repository for loading shifts to link results to specific shifts
    private final ShiftRepository shiftRepository;

    public ShiftResultServiceImpl(ShiftResultRepository shiftResultRepository,
                                  ShiftRepository shiftRepository) {
        this.shiftResultRepository = shiftResultRepository;
        this.shiftRepository = shiftRepository;
    }

    
    @Override
    // Create and save a new result entry for a shift
    public ShiftResult addResult(ShiftResultRequestDto request) throws Exception {

        // Validate incoming request data before saving

        if (request == null) {
            throw new Exception("Rezultāta dati nav norādīti");
        }

        if (request.getShiftId() == null) {
            throw new Exception("Maiņa nav norādīta");
        }

        if (request.getCategory() == null) {
            throw new Exception("Rezultāta kategorija nav norādīta");
        }

        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new Exception("Daudzumam jābūt lielākam par 0");
        }

        if (request.getEntryDate() == null) {
            throw new Exception("Datums nav norādīts");
        }


        //SHIFT
        // Find shift in database using ID received from frontend
        Shift shift = shiftRepository.findById(request.getShiftId())
                .orElseThrow(() -> new Exception("Maiņa netika atrasta"));

        ShiftResult result = new ShiftResult();
        result.setShift(shift); // Link this result to the specific shift
        result.setCategory(request.getCategory()); // Set result details received from frontend
        result.setAmount(request.getAmount()); // Set result details received from frontend
        result.setEntryDate(request.getEntryDate()); // Set result details received from frontend

        // Save the new result entry in the database
        return shiftResultRepository.save(result);
    }

   @Override

    // Get all result entries for a specific shift
    public List<ShiftResult> getResultsByShiftId(Long shiftId) throws Exception {
        return shiftResultRepository.findByShiftId(shiftId);
    }

    @Override
    public List<ShiftResultSummaryDto> getShiftSummary(Long shiftId) throws Exception {
        // Load all results for the specified shift
        List<ShiftResult> results = shiftResultRepository.findByShiftId(shiftId);

        return results.stream()
                // Group results by category and sum the amounts for each category
                .collect(java.util.stream.Collectors.groupingBy(
                        ShiftResult::getCategory,
                        java.util.stream.Collectors.summingInt(ShiftResult::getAmount)
                ))
                .entrySet()
                .stream()
                .map(entry -> new ShiftResultSummaryDto(entry.getKey(), entry.getValue())) // Convert the grouped results into a list of summary DTOs
                .toList();
    }

    @Override
    public List<ShiftResultSummaryDto> getSummaryByShiftStartDate(LocalDate date) throws Exception {

        // Find all shifts that started on the selected date
        // Collect all result entries from shifts that started on the selected date
        List<Shift> shifts = shiftRepository.findByStartTimeBetween(
                date.atStartOfDay(),
                date.plusDays(1).atStartOfDay()
        );

        // Group all collected results by category and calculate totals for each category
        List<ShiftResult> allResults = shifts.stream()
                .flatMap(shift -> shiftResultRepository.findByShiftId(shift.getId()).stream())
                .toList();

        return allResults.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        ShiftResult::getCategory,
                        java.util.stream.Collectors.summingInt(ShiftResult::getAmount)
                ))
                .entrySet()
                .stream()
                .map(entry -> new ShiftResultSummaryDto(entry.getKey(), entry.getValue()))
                .toList();
    }


    @Override
    public List<ShiftResultSummaryDto> getUserShiftSummaryByPeriod(Long userId, LocalDate from, LocalDate to) {

        // Validate input parameters
        if (userId == null) {
            throw new IllegalArgumentException("Darbinieks nav izvēlēts");
        }
        if (from == null || to == null) {
            throw new IllegalArgumentException("Perioda sākuma un beigu datumi nedrīkst būt tukši");
        }
        if (from.isAfter(to)) {
            throw new IllegalArgumentException("Perioda sākuma datums nedrīkst būt pēc beigu datuma");
        }

        // Convert LocalDate period into LocalDateTime range for shift startTime filtering
        LocalDateTime startDateTime = from.atStartOfDay();
        LocalDateTime endDateTime = to.plusDays(1).atStartOfDay();

        // Retrieve all shifts for the selected user within the selected period,
        // based on shift start time
        List<Shift> shifts = shiftRepository.findByUserIdAndStartTimeBetween(userId, startDateTime, endDateTime);

        // Extract all results from those shifts
        List<ShiftResult> results = shifts.stream()
                .flatMap(shift -> shiftResultRepository.findByShiftId(shift.getId()).stream())
                .toList();

        // Group results by category and sum their amounts
        Map<ShiftResultCategory, Integer> groupedResults = results.stream()
                .collect(Collectors.groupingBy(
                        ShiftResult::getCategory,
                        Collectors.summingInt(ShiftResult::getAmount)
                ));

        // Convert grouped results into summary DTO list
        return groupedResults.entrySet().stream()
                .map(entry -> new ShiftResultSummaryDto(entry.getKey(), entry.getValue()))
                .toList();
    }

}
