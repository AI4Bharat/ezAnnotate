package dataturks.response;

import bonsai.dropwizard.dao.d.DProjects;

public class ProjectsPerUser {
    private DProjects projectDetails;
    private long hitsDone;
    private long avrTimeTakenInSec;

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
}
