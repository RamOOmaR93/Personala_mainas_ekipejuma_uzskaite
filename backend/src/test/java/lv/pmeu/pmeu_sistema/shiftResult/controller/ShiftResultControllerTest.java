package lv.pmeu.pmeu_sistema.shiftResult.controller;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import lv.pmeu.pmeu_sistema.shift.model.Shift;
import lv.pmeu.pmeu_sistema.shift.service.IShiftService;
import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultRequestDto;
import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResult;
import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResultCategory;
import lv.pmeu.pmeu_sistema.shiftResult.service.IShiftResultService;
import lv.pmeu.pmeu_sistema.user.model.User;
import lv.pmeu.pmeu_sistema.user.repo.UserRepository;


@ExtendWith(MockitoExtension.class)
class ShiftResultControllerTest {

    @Mock
    private IShiftResultService shiftResultService;

    @Mock
    private IShiftService shiftService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ShiftResultController shiftResultController;


    // Checks if worker cannot add result to another user's shift
    @Test
    void addResult_shouldReturnForbiddenWhenWorkerTriesToAddResultToAnotherUsersShift() throws Exception {

        User currentUser = new User();
        currentUser.setId(1L);
        currentUser.setUsername("worker1");
        currentUser.setRole("DARBINIEKS");

        User shiftOwner = new User();
        shiftOwner.setId(2L);
        shiftOwner.setUsername("worker2");
        shiftOwner.setRole("DARBINIEKS");

        Shift shift = new Shift();
        shift.setId(10L);
        shift.setUser(shiftOwner);

        ShiftResultRequestDto request = new ShiftResultRequestDto();
        request.setShiftId(10L);
        request.setCategory(ShiftResultCategory.IESNIEGUMS);
        request.setAmount(5);
        request.setEntryDate(LocalDate.of(2026, 5, 19));

        when(authentication.getName()).thenReturn("worker1");
        when(userRepository.findByUsername("worker1")).thenReturn(Optional.of(currentUser));
        when(shiftService.getShiftById(10L)).thenReturn(shift);

        ResponseEntity<?> response = shiftResultController.addResult(request, authentication);

        assertEquals(403, response.getStatusCode().value());
        assertEquals("Nav atļauts pievienot rezultātus citas maiņas", response.getBody());
    }


    // Checks if worker cannot edit another user's shift result
    @Test
    void updateResult_shouldReturnForbiddenWhenWorkerTriesToEditAnotherUsersResult() throws Exception {

        User currentUser = new User();
        currentUser.setId(1L);
        currentUser.setUsername("worker1");
        currentUser.setRole("DARBINIEKS");

        User shiftOwner = new User();
        shiftOwner.setId(2L);
        shiftOwner.setUsername("worker2");
        shiftOwner.setRole("DARBINIEKS");

        Shift shift = new Shift();
        shift.setId(10L);
        shift.setUser(shiftOwner);
        shift.setEndTime(java.time.LocalDateTime.now().plusDays(1));

        ShiftResult result = new ShiftResult();
        result.setId(100L);
        result.setShift(shift);

        lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultUpdateDto request =
                new lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultUpdateDto();

        when(authentication.getName()).thenReturn("worker1");

        when(userRepository.findByUsername("worker1"))
                .thenReturn(Optional.of(currentUser));

        when(shiftResultService.getResultById(100L))
                .thenReturn(result);

        ResponseEntity<?> response =
                shiftResultController.updateResult(100L, request, authentication);

        assertEquals(403, response.getStatusCode().value());

        assertEquals(
                "Nav atļauts rediģēt citas maiņas rezultātus",
                response.getBody()
        );
    }


    // Checks if worker cannot delete another user's shift result
    @Test
    void deleteResult_shouldReturnForbiddenWhenWorkerTriesToDeleteAnotherUsersResult() throws Exception {

        User currentUser = new User();
        currentUser.setId(1L);
        currentUser.setUsername("worker1");
        currentUser.setRole("DARBINIEKS");

        User shiftOwner = new User();
        shiftOwner.setId(2L);
        shiftOwner.setUsername("worker2");
        shiftOwner.setRole("DARBINIEKS");

        Shift shift = new Shift();
        shift.setId(10L);
        shift.setUser(shiftOwner);
        shift.setEndTime(java.time.LocalDateTime.now().plusDays(1));

        ShiftResult result = new ShiftResult();
        result.setId(100L);
        result.setShift(shift);

        when(authentication.getName()).thenReturn("worker1");

        when(userRepository.findByUsername("worker1"))
                .thenReturn(Optional.of(currentUser));

        when(shiftResultService.getResultById(100L))
                .thenReturn(result);

        ResponseEntity<?> response =
                shiftResultController.deleteResult(100L, authentication);

        assertEquals(403, response.getStatusCode().value());

        assertEquals(
                "Nav atļauts dzēst citas maiņas rezultātus",
                response.getBody()
        );
    }


    // Checks if worker cannot edit shift result after shift period has ended
    @Test
    void updateResult_shouldReturnForbiddenWhenShiftIsNoLongerEditable() throws Exception {

        User currentUser = new User();
        currentUser.setId(1L);
        currentUser.setUsername("worker1");
        currentUser.setRole("DARBINIEKS");

        Shift shift = new Shift();
        shift.setId(10L);
        shift.setUser(currentUser);

        // If the shift has already ended, worker should not be able to edit results
        shift.setEndTime(java.time.LocalDateTime.now().minusDays(1));

        ShiftResult result = new ShiftResult();
        result.setId(100L);
        result.setShift(shift);

        lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultUpdateDto request =
                new lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultUpdateDto();

        when(authentication.getName()).thenReturn("worker1");

        when(userRepository.findByUsername("worker1"))
                .thenReturn(Optional.of(currentUser));

        when(shiftResultService.getResultById(100L))
                .thenReturn(result);

        ResponseEntity<?> response =
                shiftResultController.updateResult(100L, request, authentication);

        assertEquals(403, response.getStatusCode().value());

        assertEquals(
                "Maiņu vairs nevar rediģēt",
                response.getBody()
        );
    }


    // Checks if worker cannot delete shift result after shift period has ended
    @Test
    void deleteResult_shouldReturnForbiddenWhenShiftIsNoLongerEditable() throws Exception {

        User currentUser = new User();
        currentUser.setId(1L);
        currentUser.setUsername("worker1");
        currentUser.setRole("DARBINIEKS");

        Shift shift = new Shift();
        shift.setId(10L);
        shift.setUser(currentUser);

        // If the shift has already ended, worker should not be able to delete results
        shift.setEndTime(java.time.LocalDateTime.now().minusDays(1));

        ShiftResult result = new ShiftResult();
        result.setId(100L);
        result.setShift(shift);

        when(authentication.getName()).thenReturn("worker1");

        when(userRepository.findByUsername("worker1"))
                .thenReturn(Optional.of(currentUser));

        when(shiftResultService.getResultById(100L))
                .thenReturn(result);

        ResponseEntity<?> response =
                shiftResultController.deleteResult(100L, authentication);

        assertEquals(403, response.getStatusCode().value());

        assertEquals(
                "Maiņas rezultātus vairs nevar dzēst",
                response.getBody()
        );
    }


    // Checks if manager can edit another user's shift result
    @Test
    void updateResult_shouldAllowManagerToEditAnyResult() throws Exception {

        User manager = new User();
        manager.setId(1L);
        manager.setUsername("manager1");
        manager.setRole("PRIEKSNIEKS");

        User worker = new User();
        worker.setId(2L);
        worker.setUsername("worker1");
        worker.setRole("DARBINIEKS");

        Shift shift = new Shift();
        shift.setId(10L);
        shift.setUser(worker);

        // If the shift has already ended, manager should still be able to edit results
        shift.setEndTime(java.time.LocalDateTime.now().minusDays(5));

        ShiftResult existingResult = new ShiftResult();
        existingResult.setId(100L);
        existingResult.setShift(shift);

        lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultUpdateDto request =
                new lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultUpdateDto();

        ShiftResult updatedResult = new ShiftResult();
        updatedResult.setId(100L);
        updatedResult.setShift(shift);

        when(authentication.getName()).thenReturn("manager1");

        when(userRepository.findByUsername("manager1"))
                .thenReturn(Optional.of(manager));

        when(shiftResultService.getResultById(100L))
                .thenReturn(existingResult);

        when(shiftResultService.updateResult(100L, request))
                .thenReturn(updatedResult);

        ResponseEntity<?> response =
                shiftResultController.updateResult(100L, request, authentication);

        assertEquals(200, response.getStatusCode().value());
    }


    // Checks if manager can access report endpoint
    @Test
    void getSummaryByEntryDatePeriod_shouldAllowManagerAccess() throws Exception {

        User manager = new User();
        manager.setId(1L);
        manager.setUsername("manager1");
        manager.setRole("PRIEKSNIEKS");

        when(authentication.getName()).thenReturn("manager1");

        when(userRepository.findByUsername("manager1"))
                .thenReturn(Optional.of(manager));

        when(shiftResultService.getSummaryByEntryDatePeriod(
                LocalDate.of(2026, 5, 1),
                LocalDate.of(2026, 5, 31)
        )).thenReturn(java.util.List.of());

        ResponseEntity<?> response =
                shiftResultController.getSummaryByEntryDatePeriod(
                        LocalDate.of(2026, 5, 1),
                        LocalDate.of(2026, 5, 31),
                        authentication
                );

        assertEquals(200, response.getStatusCode().value());
    }


    // Checks if worker cannot access report endpoint
    @Test
    void getSummaryByEntryDatePeriod_shouldReturnForbiddenForWorker() throws Exception {

        User worker = new User();
        worker.setId(1L);
        worker.setUsername("worker1");
        worker.setRole("DARBINIEKS");

        when(authentication.getName()).thenReturn("worker1");

        when(userRepository.findByUsername("worker1"))
                .thenReturn(Optional.of(worker));

        ResponseEntity<?> response =
                shiftResultController.getSummaryByEntryDatePeriod(
                        LocalDate.of(2026, 5, 1),
                        LocalDate.of(2026, 5, 31),
                        authentication
                );

        assertEquals(403, response.getStatusCode().value());
        assertEquals("Nav atļauts skatīt atskaites", response.getBody());
    }
}