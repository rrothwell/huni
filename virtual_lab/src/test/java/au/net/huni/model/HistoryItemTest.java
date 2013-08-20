package au.net.huni.model;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.Calendar;
import java.util.TimeZone;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import org.springframework.mock.staticmock.MockStaticEntityMethods;

@RunWith(JUnit4.class)
@MockStaticEntityMethods
public class HistoryItemTest {

    @Test
    public void testMethod() {
        int expectedCount = 13;
        HistoryItem.countHistoryItems();
        org.springframework.mock.staticmock.AnnotationDrivenStaticEntityMockingControl.expectReturn(expectedCount);
        org.springframework.mock.staticmock.AnnotationDrivenStaticEntityMockingControl.playback();
        org.junit.Assert.assertEquals(expectedCount, HistoryItem.countHistoryItems());
    }
    
    @Test 
    public void testToJsonProducesCorrectJson() {
    	HistoryItem historyItem = new HistoryItem();
    	historyItem.setToolName("tool1");
    	historyItem.setBackgroundColour("#EEEEEE");
    	Researcher researcher = new Researcher();
    	researcher.setUserName("jbloggs");
		historyItem.setOwner(researcher);
    	Calendar calendar = Calendar.getInstance();
    	calendar.set(2013, 11, 25, 2, 30, 45);
    	TimeZone timeZone = TimeZone.getTimeZone("EST");
		calendar.setTimeZone(timeZone );
		historyItem.setExecutionDate(calendar);
    	
    	String actualJson = historyItem.toJson();
    	
    	assertTrue("JSON toolName is correct", actualJson.contains("\"toolName\":\"tool1\""));
    	assertTrue("JSON backgroundColour is correct", actualJson.contains("\"backgroundColour\":\"#EEEEEE\""));
    	assertTrue("JSON executionDate is correct", actualJson.contains("\"executionDate\":\"25/12/2013 18:30:45 EST\""));
    	assertTrue("JSON tool parameters is correct", actualJson.contains("\"toolParameters\":[]"));
    	//assertTrue("JSON owner is correct", actualJson.contains("\"owner\":\"jbloggs\""));
    	assertFalse("JSON version is not present", actualJson.contains("\"version\":"));
    }

    @Test
    public void testToString() {
    	HistoryItem historyItem = new HistoryItem();
    	historyItem.setToolName("tool0");
    	Calendar today = Calendar.getInstance();
    	today.set(2013, 11, 25, 2, 30, 45);
    	TimeZone timeZone = TimeZone.getTimeZone("EST");
    	today.setTimeZone(timeZone );
    	historyItem.setExecutionDate(today);
    	
    	assertEquals("History item toString is tool name and date of execution.", "tool0(25/12/2013 18:30:45 EST)", historyItem.toString());
    }
}
