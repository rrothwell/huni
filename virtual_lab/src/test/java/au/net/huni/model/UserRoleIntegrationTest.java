package au.net.huni.model;

import org.junit.Test;
import org.springframework.roo.addon.test.RooIntegrationTest;
import org.springframework.test.context.ContextConfiguration;

@ContextConfiguration(locations = {
		"classpath:/META-INF/spring/applicationContext.xml", 
		"classpath:/META-INF/spring-test/applicationContext-test.xml"})
@RooIntegrationTest(entity = UserRole.class)
public class UserRoleIntegrationTest {

    @Test
    public void testMarkerMethod() {
    }
}
