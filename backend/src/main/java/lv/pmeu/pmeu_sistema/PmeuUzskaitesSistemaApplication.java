package lv.pmeu.pmeu_sistema;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import lv.pmeu.pmeu_sistema.equipment.model.EquipmentItem;
import lv.pmeu.pmeu_sistema.equipment.repo.EquipmentItemRepository;
import lv.pmeu.pmeu_sistema.shift.model.Shift;
import lv.pmeu.pmeu_sistema.shift.repo.ShiftRepository;
import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResult;
import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResultCategory;
import lv.pmeu.pmeu_sistema.shiftResult.repo.ShiftResultRepository;
import lv.pmeu.pmeu_sistema.user.model.User;
import lv.pmeu.pmeu_sistema.user.repo.UserRepository;

@SpringBootApplication
public class PmeuUzskaitesSistemaApplication {

    @Bean
    CommandLineRunner testData(EquipmentItemRepository equipmentItemRepo, 
                                UserRepository userRepo, 
                                ShiftRepository shiftRepo, 
                                ShiftResultRepository shiftResultRepo,
                                org.springframework.security.crypto.password.PasswordEncoder passwordEncoder,
                                @Value("${demo.user.password}") String demoUserPassword){

        // Equipment items are stored in database so they can be managed as separate records
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


            


                // Demo users for testing and presentation purposes only.
                // In production, users should be created through the application UI,
                // and passwords should not be stored in source code.

                if (userRepo.count() == 0) {
                        userRepo.save(new User(null, "prieksnieks1", passwordEncoder.encode(demoUserPassword), "PRIEKSNIEKS", true,
                                "Jānis", "Vadītājs", "111111-11111", "20000001"));

                        userRepo.save(new User(null, "vietnieks1", passwordEncoder.encode(demoUserPassword), "VIETNIEKS", true,
                                "Andris", "Vietnieks", "222222-22222", "20000002"));

                        userRepo.save(new User(null, "darbinieks1", passwordEncoder.encode(demoUserPassword), "DARBINIEKS", true,
                                "Pēteris", "Ozols", "333333-33333", "20000003"));

                        userRepo.save(new User(null, "darbinieks2", passwordEncoder.encode(demoUserPassword), "DARBINIEKS", true,
                                "Mārtiņš", "Bērziņš", "444444-44444", "20000004"));

                        userRepo.save(new User(null, "darbinieks3", passwordEncoder.encode(demoUserPassword), "DARBINIEKS", true,
                                "Edgars", "Liepa", "555555-55555", "20000005"));

                        userRepo.save(new User(null, "darbinieks4", passwordEncoder.encode(demoUserPassword), "DARBINIEKS", true,
                                "Kaspars", "Kalniņš", "666666-66666", "20000006"));

                        userRepo.save(new User(null, "darbinieks5", passwordEncoder.encode(demoUserPassword), "DARBINIEKS", true,
                                "Artūrs", "Krūmiņš", "777777-77777", "20000007"));

                        userRepo.save(new User(null, "darbinieks6", passwordEncoder.encode(demoUserPassword), "DARBINIEKS", true,
                                "Rihards", "Eglītis", "888888-88888", "20000008"));

                        userRepo.save(new User(null, "darbinieks7", passwordEncoder.encode(demoUserPassword), "DARBINIEKS", true,
                                "Toms", "Avotiņš", "999999-99999", "20000009"));

                        userRepo.save(new User(null, "darbinieks8", passwordEncoder.encode(demoUserPassword), "DARBINIEKS", true,
                                "Mikus", "Zariņš", "101010-10101", "20000010"));
                }



                // Automatically inserts test data when the application starts

                // Random generator for creating test data
                // Get all possible result categories from enum
                Random random = new Random();
                ShiftResultCategory[] categories = ShiftResultCategory.values();

                // Generate sample shifts for test users and random results for those shifts

                // Generate test data only if no shifts exist in database
                if (shiftRepo.count() == 0) {

                        // Load all users from database
                        // Filter only users with role "DARBINIEKS"
                        List<User> allUsers = userRepo.findAll();

                        List<User> workers = allUsers.stream()
                                .filter(u -> "DARBINIEKS".equals(u.getRole()))
                                .toList();

                        // Define date range for generating shifts
                        LocalDate startDate = LocalDate.of(2026, 1, 1);
                        LocalDate endDate = LocalDate.now().plusDays(1);

                        // Loop through each day and generate shifts
                        for (LocalDate date = startDate; date.isBefore(endDate); date = date.plusDays(1)) {

                        // Calculate index based on day number
                        // Rotate worker pairs every day
                        // Select two workers for this shift day
                        int dayIndex = (int) (date.toEpochDay() - startDate.toEpochDay());
                        int pairIndex = dayIndex % 4;

                        User worker1 = workers.get(pairIndex * 2);
                        User worker2 = workers.get(pairIndex * 2 + 1);

                        // Create and save first shift for the day
                        Shift shift1 = shiftRepo.save(new Shift(
                                null,
                                date.atTime(8, 30),
                                date.plusDays(1).atTime(8, 30),
                                "Testa maiņa",
                                worker1
                        ));

                        // Generate random result entries for this shift
                        for (int i = 0; i < 2; i++) {
                                ShiftResultCategory category = categories[random.nextInt(categories.length)];
                                int amount = random.nextInt(5) + 1;

                                LocalDate entryDate = random.nextBoolean()
                                        ? date
                                        : date.plusDays(1);

                                shiftResultRepo.save(new ShiftResult(
                                        null,
                                        category,
                                        amount,
                                        entryDate,
                                        shift1
                                ));
                        }

                        Shift shift2 = shiftRepo.save(new Shift(
                                null,
                                date.atTime(8, 30),
                                date.plusDays(1).atTime(8, 30),
                                "Testa maiņa",
                                worker2
                        ));

                        for (int i = 0; i < 2; i++) {
                                // Pick random result category and amount for this result entry
                                ShiftResultCategory category = categories[random.nextInt(categories.length)];
                                int amount = random.nextInt(5) + 1;

                                // Randomly assign result to shift start date or next day
                                LocalDate entryDate = random.nextBoolean()
                                        ? date
                                        : date.plusDays(1);

                                // Save generated result linked to this shift
                                shiftResultRepo.save(new ShiftResult(
                                        null,
                                        category,
                                        amount,
                                        entryDate,
                                        shift2
                                ));
                        }
                        }
                }


        };
        
    }

    public static void main(String[] args) {
        SpringApplication.run(PmeuUzskaitesSistemaApplication.class, args);
    }
}
