package lv.pmeu.pmeu_sistema.shiftResult.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lv.pmeu.pmeu_sistema.shift.model.Shift;
import lv.pmeu.pmeu_sistema.shift.repo.ShiftRepository;
import lv.pmeu.pmeu_sistema.shiftResult.dto.ShiftResultRequestDto;
import lv.pmeu.pmeu_sistema.shiftResult.model.ShiftResult;
import lv.pmeu.pmeu_sistema.shiftResult.repo.ShiftResultRepository;

@Service
public class ShiftResultServiceImpl implements IShiftResultService {

    private final ShiftResultRepository shiftResultRepository;
    private final ShiftRepository shiftRepository;

    public ShiftResultServiceImpl(ShiftResultRepository shiftResultRepository,
                                  ShiftRepository shiftRepository) {
        this.shiftResultRepository = shiftResultRepository;
        this.shiftRepository = shiftRepository;
    }

    @Override
    public ShiftResult addResult(ShiftResultRequestDto request) throws Exception {
        if (request == null) {
            throw new Exception("Rezultāta dati nav norādīti");
        }

        if (request.getShiftId() == null) {
            throw new Exception("Maiņa nav norādīta");
        }

        if (request.getCategory() == null) {
            throw new Exception("Rezultāta kategorija nav norādīta");
        }

        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new Exception("Daudzumam jābūt lielākam par 0");
        }

        if (request.getEntryDate() == null) {
            throw new Exception("Datums nav norādīts");
        }

        Shift shift = shiftRepository.findById(request.getShiftId())
                .orElseThrow(() -> new Exception("Maiņa netika atrasta"));

        ShiftResult result = new ShiftResult();
        result.setShift(shift);
        result.setCategory(request.getCategory());
        result.setAmount(request.getAmount());
        result.setEntryDate(request.getEntryDate());

        return shiftResultRepository.save(result);
    }

   @Override
    public List<ShiftResult> getResultsByShiftId(Long shiftId) throws Exception {
        return shiftResultRepository.findByShiftId(shiftId);
    }
}
