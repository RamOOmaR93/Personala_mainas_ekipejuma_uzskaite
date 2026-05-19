package lv.pmeu.pmeu_sistema.shiftResult.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lv.pmeu.pmeu_sistema.shift.model.Shift;
import lv.pmeu.pmeu_sistema.shift.service.IShiftService;
import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultDto;
import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultRequestDto;
import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultSummaryDto;
import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultUpdateDto;
import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResult;
import lv.pmeu.pmeu_sistema.shiftResult.service.IShiftResultService;
import lv.pmeu.pmeu_sistema.user.model.User;
import lv.pmeu.pmeu_sistema.user.repo.UserRepository;




@RestController
@RequestMapping("/shift-results")
public class ShiftResultController {

    private final IShiftResultService shiftResultService;
    private final IShiftService shiftService;
    private final UserRepository userRepository;


    public ShiftResultController(IShiftResultService shiftResultService, IShiftService shiftService, UserRepository userRepository) {
        this.shiftResultService = shiftResultService;
        this.shiftService = shiftService;
        this.userRepository = userRepository;
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
    public ResponseEntity<?> addResult(@RequestBody ShiftResultRequestDto request, Authentication authentication) {
        try {

            User currentUser = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Lietotājs netika atrasts"));

            Shift shift = shiftService.getShiftById(request.getShiftId());

            boolean isManager = currentUser.getRole().equals("PRIEKSNIEKS")
                || currentUser.getRole().equals("VIETNIEKS");

            if (!isManager && !shift.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("Nav atļauts pievienot rezultātus citas maiņas");
            }

            ShiftResult result = shiftResultService.addResult(request);

            return ResponseEntity.ok(toDto(result));


        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }




    @GetMapping("/shift/{shiftId}")
    public ResponseEntity<?> getResultsByShiftId(@PathVariable Long shiftId, Authentication authentication) {
        try {

            User currentUser = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Lietotājs netika atrasts"));



            Shift shift = shiftService.getShiftById(shiftId);

            boolean isManager = currentUser.getRole().equals("PRIEKSNIEKS")
                || currentUser.getRole().equals("VIETNIEKS");

            if (!isManager && !shift.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("Nav atļauts skatīt citas maiņas rezultātus");
            }


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
    public ResponseEntity<?> getShiftSummary(@PathVariable Long shiftId, Authentication authentication) {
        try {

            User currentUser = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Lietotājs netika atrasts"));

            Shift shift = shiftService.getShiftById(shiftId);

            boolean isManager = currentUser.getRole().equals("PRIEKSNIEKS")
                || currentUser.getRole().equals("VIETNIEKS");

            if (!isManager && !shift.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("Nav atļauts skatīt kārtējo datu kopsavilkumu");
            }

            return ResponseEntity.ok(shiftResultService.getShiftSummary(shiftId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }





    // Return summary for all shifts started on selected date
    // Collect all results from shifts on selected date
    // Group results by category and sum totals
    @GetMapping("/summary/by-shift-date")
    public ResponseEntity<?> getSummaryByShiftStartDate(@RequestParam LocalDate date, Authentication authentication) {
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


    // Returns a summary of results within a selected period,
    // based on ShiftResult entryDate instead of shift startTime.
    // Only PRIEKSNIEKS and VIETNIEKS can access this report.
    @GetMapping("/report/by-entry-date")
    public ResponseEntity<?> getSummaryByEntryDatePeriod(
            @RequestParam LocalDate from,
            @RequestParam LocalDate to,
            Authentication authentication) {

        try {
            User currentUser = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("Lietotājs netika atrasts"));

            boolean isManager = currentUser.getRole().equals("PRIEKSNIEKS")
                    || currentUser.getRole().equals("VIETNIEKS");

            if (!isManager) {
                return ResponseEntity.status(403).body("Nav atļauts skatīt atskaites");
            }

            return ResponseEntity.ok(
                    shiftResultService.getSummaryByEntryDatePeriod(from, to)
            );

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Update an existing shift result.
    // Workers can edit only their own active shift results.
    // Managers can edit any shift result.
    @PutMapping("/{resultId}")
    public ResponseEntity<?> updateResult(
            @PathVariable Long resultId,
            @RequestBody ShiftResultUpdateDto request,
            Authentication authentication) {

        try {

            User currentUser = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("Lietotājs netika atrasts"));

            ShiftResult existingResult = shiftResultService.getResultById(resultId);

            Shift shift = existingResult.getShift();

            boolean isManager = currentUser.getRole().equals("PRIEKSNIEKS")
                    || currentUser.getRole().equals("VIETNIEKS");

            boolean isOwner = shift.getUser().getId().equals(currentUser.getId());

            //boolean shiftStillActive = LocalDateTime.now().isBefore(shift.getEndTime())
            //        || LocalDateTime.now().isEqual(shift.getEndTime());
            boolean shiftStillActive =
                !LocalDate.now().isAfter(shift.getEndTime().toLocalDate());

            if (!isManager) {

                if (!isOwner) {
                    return ResponseEntity.status(403)
                            .body("Nav atļauts rediģēt citas maiņas rezultātus");
                }

                if (!shiftStillActive) {
                    return ResponseEntity.status(403)
                            .body("Maiņu vairs nevar rediģēt");
                }
            }

            ShiftResult updatedResult = shiftResultService.updateResult(resultId, request);

            return ResponseEntity.ok(toDto(updatedResult));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
