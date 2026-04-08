package lv.pmeu.pmeu_sistema;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import lv.pmeu.pmeu_sistema.equipment.model.EquipmentItem;
import lv.pmeu.pmeu_sistema.equipment.repo.EquipmentItemRepository;
import lv.pmeu.pmeu_sistema.user.model.User;
import lv.pmeu.pmeu_sistema.user.repo.UserRepository;

@SpringBootApplication
public class PmeuUzskaitesSistemaApplication {

    @Bean
    CommandLineRunner testData(EquipmentItemRepository equipmentItemRepo, UserRepository userRepo) {
        return args -> {

            if (equipmentItemRepo.count() == 0) {
                equipmentItemRepo.save(new EquipmentItem(null, "Identifikācijas zīme"));
                equipmentItemRepo.save(new EquipmentItem(null, "Policijas zīme"));
                equipmentItemRepo.save(new EquipmentItem(null, "Pašvaldības policijas emblēma"));
                equipmentItemRepo.save(new EquipmentItem(null, "Amata pakāpju atšķirības zīme-uzpleči"));
                equipmentItemRepo.save(new EquipmentItem(null, "Ziemas virsjaka"));
                equipmentItemRepo.save(new EquipmentItem(null, "Starpsezonas virsjaka"));
                equipmentItemRepo.save(new EquipmentItem(null, "Ziemas bikses(puskombinezons)"));
                equipmentItemRepo.save(new EquipmentItem(null, "Virskrekls ar īsajām piedurknēm"));
                equipmentItemRepo.save(new EquipmentItem(null, "Vīriešu uzvalks"));
                equipmentItemRepo.save(new EquipmentItem(null, "Svārki"));
                equipmentItemRepo.save(new EquipmentItem(null, "Kaklasaite"));
                equipmentItemRepo.save(new EquipmentItem(null, "Džemperis"));
                equipmentItemRepo.save(new EquipmentItem(null, "Plānais džemperis ar augsto apkakli"));
                equipmentItemRepo.save(new EquipmentItem(null, "Flīša jaka"));
                equipmentItemRepo.save(new EquipmentItem(null, "Vasaras cepure"));
                equipmentItemRepo.save(new EquipmentItem(null, "Ziemas cepure"));
                equipmentItemRepo.save(new EquipmentItem(null, "Šalle"));
                equipmentItemRepo.save(new EquipmentItem(null, "Polo krekls(melns un balts)"));
                equipmentItemRepo.save(new EquipmentItem(null, "Veste operatīvā ar atstarojošiem elementiem"));
                equipmentItemRepo.save(new EquipmentItem(null, "Lietusmētelis"));
                equipmentItemRepo.save(new EquipmentItem(null, "Operatīvās formas bikses"));
                equipmentItemRepo.save(new EquipmentItem(null, "Vīriešu kurpes"));
                equipmentItemRepo.save(new EquipmentItem(null, "Vīriešu zābaki"));
                equipmentItemRepo.save(new EquipmentItem(null, "Gumijas zābaki"));
                equipmentItemRepo.save(new EquipmentItem(null, "Sieviešu kurpes"));
                equipmentItemRepo.save(new EquipmentItem(null, "Sieviešu zābaki"));
                equipmentItemRepo.save(new EquipmentItem(null, "Bikses(taktiskās)"));
                equipmentItemRepo.save(new EquipmentItem(null, "Atstarojoša veste(taktiskā)"));
                equipmentItemRepo.save(new EquipmentItem(null, "Siksna"));
                equipmentItemRepo.save(new EquipmentItem(null, "Operatīvā siksna"));
                equipmentItemRepo.save(new EquipmentItem(null, "Cimdi(ziemas)"));
                equipmentItemRepo.save(new EquipmentItem(null, "Cimdi dūrienu aizsardzībai(taktiskie)"));
                equipmentItemRepo.save(new EquipmentItem(null, "Roku dzelžu maks"));
                equipmentItemRepo.save(new EquipmentItem(null, "Gāzes baloniņa maks"));
                equipmentItemRepo.save(new EquipmentItem(null, "Haki/aizsargkrāsas vējjaka ar identifikācijas zīmēm"));
                equipmentItemRepo.save(new EquipmentItem(null, "Virsnieka cepure"));
            }

            if (userRepo.count() == 0) {
                userRepo.save(new User(null, "prieksnieks1", "test123", "PRIEKSNIEKS", true,
                        "Jānis", "Vadītājs", "111111-11111", "20000001"));

                userRepo.save(new User(null, "vietnieks1", "test123", "VIETNIEKS", true,
                        "Andris", "Vietnieks", "222222-22222", "20000002"));

                userRepo.save(new User(null, "darbinieks1", "test123", "DARBINIEKS", true,
                        "Pēteris", "Ozols", "333333-33333", "20000003"));

                userRepo.save(new User(null, "darbinieks2", "test123", "DARBINIEKS", true,
                        "Mārtiņš", "Bērziņš", "444444-44444", "20000004"));

                userRepo.save(new User(null, "darbinieks3", "test123", "DARBINIEKS", true,
                        "Edgars", "Liepa", "555555-55555", "20000005"));
            }
        };
    }

    public static void main(String[] args) {
        SpringApplication.run(PmeuUzskaitesSistemaApplication.class, args);
    }
}
