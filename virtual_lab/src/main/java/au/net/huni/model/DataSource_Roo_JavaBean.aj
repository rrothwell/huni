// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package au.net.huni.model;

import au.net.huni.model.DataSource;
import au.net.huni.model.Project;
import java.util.Calendar;

privileged aspect DataSource_Roo_JavaBean {
    
    public Project DataSource.getOwner() {
        return this.owner;
    }
    
    public void DataSource.setOwner(Project owner) {
        this.owner = owner;
    }
    
    public String DataSource.getName() {
        return this.name;
    }
    
    public void DataSource.setName(String name) {
        this.name = name;
    }
    
    public Calendar DataSource.getImportDate() {
        return this.importDate;
    }
    
    public void DataSource.setImportDate(Calendar importDate) {
        this.importDate = importDate;
    }
    
    public String DataSource.getDescription() {
        return this.description;
    }
    
    public void DataSource.setDescription(String description) {
        this.description = description;
    }
    
}
