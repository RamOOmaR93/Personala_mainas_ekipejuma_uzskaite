package lv.pmeu.pmeu_sistema.shift.controller;

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

import lv.pmeu.pmeu_sistema.shift.dto.ShiftByDateDto;
import lv.pmeu.pmeu_sistema.shift.dto.ShiftDto;
import lv.pmeu.pmeu_sistema.shift.dto.ShiftRequestDto;
import lv.pmeu.pmeu_sistema.shift.model.Shift;
import lv.pmeu.pmeu_sistema.shift.service.IShiftService;


@RestController
@RequestMapping("/shifts")
public class ShiftController {

    private final IShiftService shiftService;

    public ShiftController(IShiftService shiftService) {
            this.shiftService = shiftService;
        }

    private ShiftDto toDto(Shift shift) {
        ShiftDto dto = new ShiftDto();
        dto.setId(shift.getId());
        dto.setStartTime(shift.getStartTime());
        dto.setEndTime(shift.getEndTime());
        dto.setComment(shift.getComment());

        dto.setUserId(shift.getUser().getId());
        dto.setUsername(shift.getUser().getUsername());
        dto.setFirstName(shift.getUser().getFirstName());
        dto.setLastName(shift.getUser().getLastName());

        return dto;
    }

    

    @PostMapping
    public ResponseEntity<?> createShift(@RequestBody ShiftRequestDto request) {
        try {
            Shift createdShift = shiftService.createShift(request);
            return ResponseEntity.ok(toDto(createdShift));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserShifts(@PathVariable Long userId) {
        try {
            List<ShiftDto> shifts = shiftService.getUserShifts(userId).stream()
                    .map(this::toDto)
                    .toList();

            return ResponseEntity.ok(shifts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getShiftById(@PathVariable Long id) {
        try {
            Shift shift = shiftService.getShiftById(id);
            return ResponseEntity.ok(toDto(shift));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/by-date")
    public List<ShiftByDateDto> getShiftsByDate(@RequestParam LocalDate date) {
        return shiftService.getShiftsByDate(date);
    }

}
