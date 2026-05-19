package lv.pmeu.pmeu_sistema.equipment.service;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import lv.pmeu.pmeu_sistema.equipment.dto.EquipmentAssignmentRequest;
import lv.pmeu.pmeu_sistema.equipment.model.EquipmentItem;
import lv.pmeu.pmeu_sistema.equipment.repo.EquipmentAssignmentRepository;
import lv.pmeu.pmeu_sistema.equipment.repo.EquipmentItemRepository;
import lv.pmeu.pmeu_sistema.user.model.User;
import lv.pmeu.pmeu_sistema.user.repo.UserRepository;

@ExtendWith(MockitoExtension.class)
class EquipmentAssignmentServiceImplTest {

    @Mock
    private EquipmentAssignmentRepository equipmentAssignmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EquipmentItemRepository equipmentItemRepository;

    @InjectMocks
    private EquipmentAssignmentServiceImpl equipmentAssignmentService;


    // Checks if exception is thrown when equipment assignment request is missing
    @Test
    void assignEquipment_shouldThrowExceptionWhenRequestIsNull() {

        Exception exception = org.junit.jupiter.api.Assertions.assertThrows(
                Exception.class,
                () -> equipmentAssignmentService.assignEquipment(null)
        );

        assertEquals("Ekipējuma piešķiršanas dati nav norādīti", exception.getMessage());
    }


    // Checks if exception is thrown when user does not exist
    @Test
    void assignEquipment_shouldThrowExceptionWhenUserDoesNotExist() {

        EquipmentAssignmentRequest request = new EquipmentAssignmentRequest();
        request.setUserId(999L);
        request.setEquipmentItemId(1L);
        request.setIssuedDate(LocalDate.now());

        when(userRepository.findById(999L))
                .thenReturn(Optional.empty());

        Exception exception = org.junit.jupiter.api.Assertions.assertThrows(
                Exception.class,
                () -> equipmentAssignmentService.assignEquipment(request)
        );

        assertEquals("Lietotājs netika atrasts", exception.getMessage());
    }


    // Checks if exception is thrown when equipment item does not exist
    @Test
    void assignEquipment_shouldThrowExceptionWhenEquipmentItemDoesNotExist() {

        EquipmentAssignmentRequest request = new EquipmentAssignmentRequest();
        request.setUserId(1L);
        request.setEquipmentItemId(999L);
        request.setIssuedDate(LocalDate.now());

        User user = new User();
        user.setId(1L);

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(equipmentItemRepository.findById(999L))
                .thenReturn(Optional.empty());

        Exception exception = org.junit.jupiter.api.Assertions.assertThrows(
                Exception.class,
                () -> equipmentAssignmentService.assignEquipment(request)
        );

        assertEquals("Ekipējuma vienība netika atrasta", exception.getMessage());
    }


    // Checks if exception is thrown when equipment is already assigned to the same user
    @Test
    void assignEquipment_shouldThrowExceptionWhenEquipmentAlreadyAssignedToUser() {

        EquipmentAssignmentRequest request = new EquipmentAssignmentRequest();
        request.setUserId(1L);
        request.setEquipmentItemId(1L);
        request.setIssuedDate(LocalDate.now());

        User user = new User();
        user.setId(1L);

        EquipmentItem item = new EquipmentItem();
        item.setId(1L);

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(equipmentItemRepository.findById(1L))
                .thenReturn(Optional.of(item));

        when(equipmentAssignmentRepository.existsByUserIdAndEquipmentItemIdAndActive(1L, 1L, true))
                .thenReturn(true);

        Exception exception = org.junit.jupiter.api.Assertions.assertThrows(
                Exception.class,
                () -> equipmentAssignmentService.assignEquipment(request)
        );

        assertEquals("Šis ekipējums jau ir aktīvi piešķirts šim darbiniekam", exception.getMessage());
    }



}
