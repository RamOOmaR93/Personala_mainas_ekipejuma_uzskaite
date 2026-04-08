package lv.pmeu.pmeu_sistema.shift.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShiftReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int iesniegums;
    private int apstasanasStavesanasNoteikumi;
    private int riskuIzvertesana;
    private int lemumsParNoskirsanu;

    private int apasAlkoholaLietosanaAtrasanas;
    private int apasMieraTraucesana;
    private int apasCeluSatiksmesLikums;
    private int apasDzivesvietasDeklaresanasLikums;
    private int apasSmekesanasNoteikumuNeieverosana;
    private int apasDzivniekuAizsardzibasLikums;
    private int apasSaistosoNoteikumuIeverosana;
    private int apasAtkritumuApsaimniekosanasLikums;
    private int apasBernuTiesibuAizsardzibasLikums;
    private int apasMakskeresanasNoteikumuIeverosana;
    private int apasAtteikumsUzsaktProcesu;
    private int apasUzdevumsCitaiIestadei;

    private int licencetasMakskeresanasParbaude;

    @OneToOne
    @JoinColumn(name = "shift_id")
    private Shift shift;
}
