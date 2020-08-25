package dataturks.response;

import dataturks.DTypes;

public class ContributorDetails {
    private UserDetails userDetails;
    private long hitsDone;
    private long avrTimeTakenInSec;

    private long dataDeleted;
    private long dataSkipped;
    private long dataEvaluationCorrect;
    private long dataEvaluationInCorrect;

    private long dataDeletedByDate;
    private long dataSkippedByDate;
    private long dataEvaluationCorrectByDate;
    private long dataEvaluationInCorrectByDate;

    private DTypes.Project_User_Role role;

    public ContributorDetails() {

    }

    public ContributorDetails(UserDetails userDetails) {
        this.userDetails = userDetails;
    }

    public UserDetails getUserDetails() {
        return userDetails;
    }

    public void setUserDetails(UserDetails userDetails) {
        this.userDetails = userDetails;
    }

    public long getHitsDone() {
        return hitsDone;
    }

    public void setHitsDone(long hitsDone) {
        this.hitsDone = hitsDone;
    }

    public long getAvrTimeTakenInSec() {
        return avrTimeTakenInSec;
    }

    public void setAvrTimeTakenInSec(long avrTimeTakenInSec) {
        this.avrTimeTakenInSec = avrTimeTakenInSec;
    }

    public DTypes.Project_User_Role getRole() {
        return role;
    }

    public void setRole(DTypes.Project_User_Role role) {
        this.role = role;
    }

    public long getHitsDeleted() {
        return dataDeleted;
    }

    public void setHitsDeleted(long dataDeleted) {
        this.dataDeleted = dataDeleted;
    }

    public long getHitsSkipped() {
        return dataSkipped;
    }

    public void setHitsSkipped(long dataSkipped) {
        this.dataSkipped = dataSkipped;
    }

    public long getEvaluationCorrect() {
        return dataEvaluationCorrect;
    }

    public void setEvaluationCorrect(long dataEvaluationCorrect) {
        this.dataEvaluationCorrect = dataEvaluationCorrect;
    }

    public long getEvaluationInCorrect() {
        return dataEvaluationInCorrect;
    }

    public void setEvaluationInCorrect(long dataEvaluationInCorrect) {
        this.dataEvaluationInCorrect = dataEvaluationInCorrect;
    }

    public long getHitsDeletedByDate() {
        return dataDeletedByDate;
    }

    public void setHitsDeletedByDate(long dataDeletedByDate) {
        this.dataDeletedByDate = dataDeletedByDate;
    }

    public long getHitsSkippedByDate() {
        return dataSkippedByDate;
    }

    public void setHitsSkippedByDate(long dataSkippedByDate) {
        this.dataSkippedByDate = dataSkippedByDate;
    }

    public long getEvaluationCorrectByDate() {
        return dataEvaluationCorrectByDate;
    }

    public void setEvaluationCorrectByDate(long dataEvaluationCorrectByDate) {
        this.dataEvaluationCorrectByDate = dataEvaluationCorrectByDate;
    }

    public long getEvaluationInCorrectByDate() {
        return dataEvaluationInCorrectByDate;
    }

    public void setEvaluationInCorrectByDate(long dataEvaluationInCorrectByDate) {
        this.dataEvaluationInCorrectByDate = dataEvaluationInCorrectByDate;
    }
}
