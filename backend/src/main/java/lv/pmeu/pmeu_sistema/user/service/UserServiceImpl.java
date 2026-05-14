package lv.pmeu.pmeu_sistema.user.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lv.pmeu.pmeu_sistema.user.model.User;
import lv.pmeu.pmeu_sistema.user.repo.UserRepository;

@Service
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public List<User> getAllUsers() throws Exception {
        if (userRepository.count() == 0) {
            throw new Exception("Nav neviena lietotāja");
        }

        return userRepository.findAll();
    }


   @Override
    public User getUserById(Long id) throws Exception {
        if (id < 0) {
            throw new Exception("Nepareizs lietotāja ID");
        }

        return userRepository.findById(id)
                .orElseThrow(() -> new Exception("Lietotājs netika atrasts"));
    }


    @Override
    public User createUser(User user) throws Exception {
        if (user == null) {
            throw new Exception("Lietotāja dati nav norādīti");
        }

        if (user.getUsername() == null || user.getUsername().isBlank()) {
            throw new Exception("Lietotājvārdam jābūt aizpildītam");
        }

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new Exception("Lietotājvārds jau eksistē");
        }

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new Exception("Parolei jābūt aizpildītai");
        }

        if (user.getRole() == null || user.getRole().isBlank()) {
            throw new Exception("Lomai jābūt aizpildītai");
        }

        if (!user.getRole().equals("DARBINIEKS")
                && !user.getRole().equals("PRIEKSNIEKS")
                && !user.getRole().equals("VIETNIEKS")) {
            throw new Exception("Nepareiza lietotāja loma");
        }

        if (user.getFirstName() == null || user.getFirstName().isBlank()) {
            throw new Exception("Vārdam jābūt aizpildītam");
        }

        if (user.getLastName() == null || user.getLastName().isBlank()) {
            throw new Exception("Uzvārdam jābūt aizpildītam");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword())); // Hash the password before saving

        return userRepository.save(user);
    }


    @Override
    public User updateUser(Long id, User user) throws Exception {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new Exception("Lietotājs netika atrasts"));

        if (user.getUsername() != null) {
            existingUser.setUsername(user.getUsername());
        }

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }




        if (user.getRole() != null) {

            if (!user.getRole().equals("DARBINIEKS")
                    && !user.getRole().equals("PRIEKSNIEKS")
                    && !user.getRole().equals("VIETNIEKS")) {
                throw new Exception("Nepareiza lietotāja loma");
            }


            existingUser.setRole(user.getRole());
        }



        if (user.getFirstName() != null) {
            existingUser.setFirstName(user.getFirstName());
        }

        if (user.getLastName() != null) {
            existingUser.setLastName(user.getLastName());
        }

        if (user.getPersonalCode() != null) {
            existingUser.setPersonalCode(user.getPersonalCode());
        }

        if (user.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(user.getPhoneNumber());
        }

        existingUser.setActive(user.isActive());

        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) throws Exception {
        if (!userRepository.existsById(id)) {
            throw new Exception("Lietotājs netika atrasts");
        }

        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new Exception("Lietotājs netika atrasts"));

        user.setActive(false);
        userRepository.save(user);
    }
}
