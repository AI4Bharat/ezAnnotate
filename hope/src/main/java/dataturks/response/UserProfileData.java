package dataturks.response;

import java.util.List;
import bonsai.config.AppConfig;

public class UserProfileData {

    public UserDetails userDetails;
    public List<ProjectsPerUser> projectStats;

    public UserProfileData(String userId) {
        userDetails = new UserDetails(AppConfig.getInstance().getdUsersDAO().findByIdInternal(userId));
    }

    public UserDetails getUserDetails() {
        return userDetails;
    }

    public List<ProjectsPerUser> getProjectStats() {
        return projectStats;
    }

    public void setProjectStats(List<ProjectsPerUser> projectStats) {
        this.projectStats = projectStats;
    }
}