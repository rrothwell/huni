// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package au.net.huni.model;

import au.net.huni.model.Registration;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Version;

privileged aspect Registration_Roo_Jpa_Entity {
    
    declare @type: Registration: @Entity;
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long Registration.id;
    
    @Version
    @Column(name = "version")
    private Integer Registration.version;
    
    public Long Registration.getId() {
        return this.id;
    }
    
    public void Registration.setId(Long id) {
        this.id = id;
    }
    
    public Integer Registration.getVersion() {
        return this.version;
    }
    
    public void Registration.setVersion(Integer version) {
        this.version = version;
    }
    
}
