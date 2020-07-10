package com.maqs.apm.orders.services;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import com.maqs.commons.exceptions.ServiceException;
import com.maqs.commons.model.Document;
import com.maqs.commons.web.RestApiHelper;

import co.elastic.apm.api.CaptureSpan;

@Service
public class ProductsServiceHelper {

	private Logger logger = LoggerFactory.getLogger(getClass());

	@Value("#{'${products.base.url}'}")
    private String baseUrl;
	
	@Autowired
	private RestApiHelper restApiHelper;
	
	@PostConstruct
	public void initIt() throws Exception {
		Assert.notNull(baseUrl, "products.base.url is not set");
		logger.info("CouchDao client instance is getting created... " + baseUrl);
	}

	@CaptureSpan
	public Document getProduct(String productId) throws ServiceException {
		String url = baseUrl + productId;
		return restApiHelper.get(url, Document.class);
	}
}
