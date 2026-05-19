package lv.pmeu.pmeu_sistema.shift.service;

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

import lv.pmeu.pmeu_sistema.shift.dto.ShiftRequestDto;
import lv.pmeu.pmeu_sistema.shift.model.Shift;
import lv.pmeu.pmeu_sistema.shift.repo.ShiftRepository;
import lv.pmeu.pmeu_sistema.user.model.User;
import lv.pmeu.pmeu_sistema.user.repo.UserRepository;


@ExtendWith(MockitoExtension.class)
class ShiftServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ShiftRepository shiftRepository;

    @InjectMocks
    private ShiftServiceImpl shiftService;


    // Checks if shift is returned successfully by id
    @Test
    void getShiftById_shouldReturnShiftWhenShiftExists() throws Exception {

        Shift shift = new Shift();
        shift.setId(1L);

        when(shiftRepository.findById(1L))
                .thenReturn(Optional.of(shift));

        Shift result = shiftService.getShiftById(1L);

        assertEquals(1L, result.getId());
    }


    // Checks if exception is thrown when shift does not exist
    @Test
    void getShiftById_shouldThrowExceptionWhenShiftDoesNotExist() {

        when(shiftRepository.findById(999L))
                .thenReturn(Optional.empty());

        Exception exception = org.junit.jupiter.api.Assertions.assertThrows(
                Exception.class,
                () -> shiftService.getShiftById(999L)
        );

        assertEquals("Maiņa netika atrasta", exception.getMessage());
    }


    // Checks if user shifts are returned successfully
    @Test
    void getUserShifts_shouldReturnUserShifts() throws Exception {

        Shift shift1 = new Shift();
        shift1.setId(1L);

        Shift shift2 = new Shift();
        shift2.setId(2L);

        when(shiftRepository.findByUserId(1L))
                .thenReturn(List.of(shift1, shift2));

        List<Shift> result = shiftService.getUserShifts(1L);

        assertEquals(2, result.size());
    }


    // Checks if exception is thrown when user id is invalid
    @Test
    void getUserShifts_shouldThrowExceptionWhenUserIdIsNegative() {

        Exception exception = org.junit.jupiter.api.Assertions.assertThrows(
                Exception.class,
                () -> shiftService.getUserShifts(-1L)
        );

        assertEquals("Nepareizs lietotāja ID", exception.getMessage());
    }



    // Checks if exception is thrown when shift date is not today or yesterday
    @Test
    void createShift_shouldThrowExceptionWhenShiftDateIsInvalid() {

        ShiftRequestDto request = new ShiftRequestDto();

        request.setUserId(1L);

        // Vecs datums
        request.setShiftDate(LocalDate.now().minusDays(5));

        Exception exception = org.junit.jupiter.api.Assertions.assertThrows(
                Exception.class,
                () -> shiftService.createShift(request)
        );

        assertEquals(
                "Maiņu var izveidot tikai šodienas vai vakardienas datumam",
                exception.getMessage()
        );
    }



    // Checks if exception is thrown when shift already exists for the same date
    @Test
    void createShift_shouldThrowExceptionWhenShiftAlreadyExistsForDate() {

        ShiftRequestDto request = new ShiftRequestDto();

        request.setUserId(1L);
        request.setShiftDate(LocalDate.now());

        when(shiftRepository.existsByUserIdAndStartTimeBetween(
                org.mockito.ArgumentMatchers.eq(1L),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any()
        )).thenReturn(true);

        Exception exception = org.junit.jupiter.api.Assertions.assertThrows(
                Exception.class,
                () -> shiftService.createShift(request)
        );

        assertEquals(
                "Šim darbiniekam šajā datumā maiņa jau ir izveidota",
                exception.getMessage()
        );
    }


    // Checks if shift is successfully created with valid data
    @Test
    void createShift_shouldCreateShiftSuccessfully() throws Exception {

        ShiftRequestDto request = new ShiftRequestDto();

        request.setUserId(1L);
        request.setShiftDate(LocalDate.now());
        request.setComment("Test shift");

        User user = new User();
        user.setId(1L);

        when(shiftRepository.existsByUserIdAndStartTimeBetween(
                org.mockito.ArgumentMatchers.eq(1L),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any()
        )).thenReturn(false);

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        Shift savedShift = new Shift();
        savedShift.setId(100L);
        savedShift.setUser(user);

        when(shiftRepository.save(org.mockito.ArgumentMatchers.any(Shift.class)))
                .thenReturn(savedShift);

        Shift result = shiftService.createShift(request);

        assertEquals(100L, result.getId());
    }

}