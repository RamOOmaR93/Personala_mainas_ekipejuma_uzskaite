package lv.pmeu.pmeu_sistema.shift.dto;

import java.time.LocalDateTime;


public class ShiftByDateDto {

    private Long shiftId;
    private Long userId;
    private String username;
    private String firstName;
    private String lastName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public ShiftByDateDto() {
    }

    public ShiftByDateDto(Long shiftId, Long userId, String username, String firstName, String lastName, LocalDateTime startTime, LocalDateTime endTime) {
        this.shiftId = shiftId;
        this.userId = userId;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getShiftId() {
        return shiftId;
    }

    public void setShiftId(Long shiftId) {
        this.shiftId = shiftId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
}
