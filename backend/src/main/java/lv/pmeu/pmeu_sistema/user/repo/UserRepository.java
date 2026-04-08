package lv.pmeu.pmeu_sistema.user.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import lv.pmeu.pmeu_sistema.user.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
