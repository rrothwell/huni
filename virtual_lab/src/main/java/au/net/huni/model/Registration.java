package au.net.huni.model;

import java.util.Calendar;
import javax.persistence.Column;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.json.RooJson;
import org.springframework.roo.addon.tostring.RooToString;
import org.springframework.roo.addon.web.mvc.controller.json.RooWebJson;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
@RooJson
@RooWebJson(jsonObject = Institution.class)
public class Registration {

    @NotNull
    @Column(unique = true)
    @Size(min = 5, max = 10)
    private String userName;

    @NotNull
    @Size(min = 1, max = 60)
    private String givenName;

    @NotNull
    @Size(min = 1, max = 60)
    private String familyName;

    @NotNull
    @Pattern(regexp = "^([0-9a-zA-Z]([-.\\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9})$")
    private String emailAddress;

    @NotNull
    @ManyToOne
    private Institution institution;

    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "S-")
    private Calendar applicationDate;

    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "S-")
    private Calendar approvalDate;
}