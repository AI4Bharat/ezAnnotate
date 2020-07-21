package dataturks.response;

import bonsai.dropwizard.dao.d.DProjects;

public class ProjectsPerUser {
    private DProjects projectDetails;
    private long hitsDone;
    private long avrTimeTakenInSec;

    private long dataDeleted;
    private long dataEvaluationCorrect;
    private long dataEvaluationInCorrect;

    private long dataDeletedByDate;
    private long dataEvaluationCorrectByDate;
    private long dataEvaluationInCorrectByDate;

    public ProjectsPerUser() {
        
    }

    public ProjectsPerUser(DProjects projectDetails) {
        this.projectDetails = projectDetails;
    }

    public DProjects getProjectDetails() {
        return projectDetails;
    }

    public void setProjectDetails(DProjects projectDetails) {
        this.projectDetails = projectDetails;
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

    public long getHitsDeleted() {
        return dataDeleted;
    }

    public void setHitsDeleted(long dataDeleted) {
        this.dataDeleted = dataDeleted;
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
