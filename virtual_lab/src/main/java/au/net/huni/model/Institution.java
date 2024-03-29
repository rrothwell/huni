package au.net.huni.model;

import java.util.Collection;

import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.apache.commons.lang3.RandomStringUtils;
import org.hibernate.proxy.HibernateProxyHelper;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.json.RooJson;
import org.springframework.roo.addon.tostring.RooToString;

import flexjson.JSONSerializer;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
@RooJson
public class Institution {

    @NotNull
    @Column(unique = true)
    private String code = RandomStringUtils.random(10);

    @NotNull
    @Column(unique = false)
    @Size(min = 5, max = 60)
    private String name;

    public Institution() {
        this("?", "UNKNOWN");
    }

    public Institution(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public static String toJsonArray(Collection<au.net.huni.model.Institution> collection) {
        return new JSONSerializer().exclude("*.class").serialize(collection);
    }

    public String toJson() {
        return new JSONSerializer().exclude("*.class").serialize(this);
    }

    @Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append(getCode())
		.append(" (").append(getName()).append(")");
        return builder.toString();
    }
    
    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        } else if (!(HibernateProxyHelper.getClassWithoutInitializingProxy(obj).equals(Institution.class))) {
            return false;
        }

        Institution candidate = (Institution) obj;

        return this.getCode().equals(candidate.getCode())
            ;
    }
    
    @Override
    public int hashCode() {
        return this.getCode().hashCode()
             ;
    }
}
