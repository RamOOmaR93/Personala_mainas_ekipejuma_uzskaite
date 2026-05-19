package lv.pmeu.pmeu_sistema.shift.controller;

import java.time.LocalDateTime;
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
import lv.pmeu.pmeu_sistema.user.model.User;
import lv.pmeu.pmeu_sistema.user.repo.UserRepository;

@ExtendWith(MockitoExtension.class)
class ShiftControllerTest {

    @Mock
    private Authentication authentication;


    @Mock
    private IShiftService shiftService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ShiftController shiftController;



    // Checks if worker cannot view another user's shifts
    @Test
    void getUserShifts_shouldReturnForbiddenWhenWorkerTriesToViewAnotherUsersShifts() throws Exception {

        User currentUser = new User();
        currentUser.setId(1L);
        currentUser.setUsername("worker1");
        currentUser.setRole("DARBINIEKS");

        when(authentication.getName()).thenReturn("worker1");

        when(userRepository.findByUsername("worker1"))
                .thenReturn(Optional.of(currentUser));

        ResponseEntity<?> response =
                shiftController.getUserShifts(2L, authentication);

        assertEquals(403, response.getStatusCode().value());
        assertEquals("Nav atļauts skatīt cita darbinieka maiņas", response.getBody());
    }


    // Checks if worker cannot view another user's shift
    @Test
    void getShiftById_shouldReturnForbiddenWhenWorkerTriesToViewAnotherUsersShift() throws Exception {

        User currentUser = new User();
        currentUser.setId(1L);
        currentUser.setUsername("worker1");
        currentUser.setRole("DARBINIEKS");

        User shiftOwner = new User();
        shiftOwner.setId(2L);
        shiftOwner.setUsername("worker2");

        Shift shift = new Shift();
        shift.setId(10L);
        shift.setUser(shiftOwner);
        shift.setStartTime(LocalDateTime.now());
        shift.setEndTime(LocalDateTime.now().plusDays(1));

        when(authentication.getName()).thenReturn("worker1");

        when(userRepository.findByUsername("worker1"))
                .thenReturn(Optional.of(currentUser));

        when(shiftService.getShiftById(10L))
                .thenReturn(shift);

        ResponseEntity<?> response =
                shiftController.getShiftById(10L, authentication);

        assertEquals(403, response.getStatusCode().value());

        assertEquals(
                "Nav atļauts skatīt cita darbinieka maiņu",
                response.getBody()
        );
    }


    // Checks if manager can view another user's shifts
    @Test
    void getUserShifts_shouldAllowManagerToViewAnotherUsersShifts() throws Exception {

        User manager = new User();
        manager.setId(1L);
        manager.setUsername("manager1");
        manager.setRole("PRIEKSNIEKS");

        when(authentication.getName()).thenReturn("manager1");

        when(userRepository.findByUsername("manager1"))
                .thenReturn(Optional.of(manager));

        when(shiftService.getUserShifts(2L))
                .thenReturn(java.util.List.of());

        ResponseEntity<?> response =
                shiftController.getUserShifts(2L, authentication);

        assertEquals(200, response.getStatusCode().value());
    }


    // Checks if manager can view another user's shift
    @Test
    void getShiftById_shouldAllowManagerToViewAnotherUsersShift() throws Exception {

        User manager = new User();
        manager.setId(1L);
        manager.setUsername("manager1");
        manager.setRole("PRIEKSNIEKS");

        User worker = new User();
        worker.setId(2L);
        worker.setUsername("worker1");
        worker.setFirstName("Janis");
        worker.setLastName("Berzins");

        Shift shift = new Shift();
        shift.setId(10L);
        shift.setUser(worker);
        shift.setStartTime(LocalDateTime.now());
        shift.setEndTime(LocalDateTime.now().plusDays(1));
        shift.setComment("Test shift");

        when(authentication.getName()).thenReturn("manager1");

        when(userRepository.findByUsername("manager1"))
                .thenReturn(Optional.of(manager));

        when(shiftService.getShiftById(10L))
                .thenReturn(shift);

        ResponseEntity<?> response =
                shiftController.getShiftById(10L, authentication);

        assertEquals(200, response.getStatusCode().value());
    }



}
