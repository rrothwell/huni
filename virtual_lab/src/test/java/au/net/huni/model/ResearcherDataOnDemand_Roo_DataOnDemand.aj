// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package au.net.huni.model;

import au.net.huni.model.Institution;
import au.net.huni.model.InstitutionDataOnDemand;
import au.net.huni.model.Researcher;
import au.net.huni.model.ResearcherDataOnDemand;
import au.net.huni.model.ToolLibraryItemDataOnDemand;
import java.util.Calendar;
import java.util.GregorianCalendar;
import org.springframework.beans.factory.annotation.Autowired;

privileged aspect ResearcherDataOnDemand_Roo_DataOnDemand {
    
    @Autowired
    ToolLibraryItemDataOnDemand ResearcherDataOnDemand.toolLibraryItemDataOnDemand;
    
    @Autowired
    InstitutionDataOnDemand ResearcherDataOnDemand.institutionDataOnDemand;
    
    public void ResearcherDataOnDemand.setCreationDate(Researcher obj, int index) {
        Calendar creationDate = Calendar.getInstance();
        obj.setCreationDate(creationDate);
    }
    
    public void ResearcherDataOnDemand.setEmailAddress(Researcher obj, int index) {
        String emailAddress = "foo" + index + "@bar.com";
        obj.setEmailAddress(emailAddress);
    }
    
    public void ResearcherDataOnDemand.setInstitution(Researcher obj, int index) {
        Institution institution = institutionDataOnDemand.getRandomInstitution();
        obj.setInstitution(institution);
    }
    
    public void ResearcherDataOnDemand.setIsAccountEnabled(Researcher obj, int index) {
        Boolean isAccountEnabled = Boolean.TRUE;
        obj.setIsAccountEnabled(isAccountEnabled);
    }
    
    public void ResearcherDataOnDemand.setPassword(Researcher obj, int index) {
        String password = "passwordxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx_" + index;
        if (password.length() > 64) {
            password = password.substring(0, 64);
        }
        obj.setPassword(password);
    }
    
}
