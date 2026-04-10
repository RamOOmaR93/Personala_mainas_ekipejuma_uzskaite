package lv.pmeu.pmeu_sistema.user.service;

import java.util.List;

import lv.pmeu.pmeu_sistema.user.model.User;

public interface IUserService {

    List<User> getAllUsers() throws Exception;

    User getUserById(Long id) throws Exception;

    User createUser(User user) throws Exception;

    User updateUser(Long id, User user) throws Exception;

    void deleteUser(Long id) throws Exception;
}
