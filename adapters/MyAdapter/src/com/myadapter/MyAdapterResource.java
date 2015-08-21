/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

package com.myadapter;

import java.util.logging.Logger;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.worklight.adapters.rest.api.WLServerAPI;
import com.worklight.adapters.rest.api.WLServerAPIProvider;

@Path("/API")
public class MyAdapterResource {
	
		
	
	static Logger logger = Logger.getLogger(MyAdapterResource.class.getName());

    WLServerAPI api = WLServerAPIProvider.getWLServerAPI();

    @GET
    @Path("/convertCurrency/{from}/{to}")
    public String sayHello(
    		@PathParam(value="from")String from,
    		@PathParam(value="to")String to
    		) throws Exception{
    	
    	String url = "http://www.webservicex.net/CurrencyConvertor.asmx/"
    			+ "ConversionRate?FromCurrency=" + from +"&ToCurrency=" + to ;
    	HttpGet request = new HttpGet(url);
    	CloseableHttpClient client = HttpClients.createDefault();
    	CloseableHttpResponse response = client.execute(request);
    	HttpEntity entity = response.getEntity();
    	String responseString = EntityUtils.toString(entity);
    	return responseString;
    	
    	
    	
    	
    }
    
  //  http://169.254.129.197:10080/CustomLoginModul/adapters/MyAdapter/API/sayHello?name=nagashree
    

	
}
