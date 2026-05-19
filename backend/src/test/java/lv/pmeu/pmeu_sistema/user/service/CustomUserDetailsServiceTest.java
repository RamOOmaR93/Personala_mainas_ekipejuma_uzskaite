package lv.pmeu.pmeu_sistema.user.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import lv.pmeu.pmeu_sistema.user.model.User;
import lv.pmeu.pmeu_sistema.user.repo.UserRepository;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    // Checks if inactive user is loaded as disabled for Spring Security
    @Test
    void loadUserByUsername_shouldReturnDisabledUserWhenUserIsInactive() {

        User user = new User();
        user.setUsername("worker1");
        user.setPassword("password");
        user.setRole("DARBINIEKS");
        user.setActive(false);

        when(userRepository.findByUsername("worker1"))
                .thenReturn(Optional.of(user));

        UserDetails result =
                customUserDetailsService.loadUserByUsername("worker1");

        assertFalse(result.isEnabled());
    }



    // Checks if active user is enabled for Spring Security login
    @Test
    void loadUserByUsername_shouldReturnEnabledUserWhenUserIsActive() {

        User user = new User();
        user.setUsername("worker1");
        user.setPassword("password");
        user.setRole("DARBINIEKS");
        user.setActive(true);

        when(userRepository.findByUsername("worker1"))
                .thenReturn(Optional.of(user));

        UserDetails result =
                customUserDetailsService.loadUserByUsername("worker1");

        org.junit.jupiter.api.Assertions.assertTrue(result.isEnabled());
    }





}
