package com.maqs.apm.products.controllers;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.maqs.apm.products.services.ProductService;
import com.maqs.commons.exceptions.ServiceException;
import com.maqs.commons.model.Document;

@RestController
@RequestMapping(value = "/products", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProductController {
	
	private Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private ProductService productService;
	
	@RequestMapping(value = "", method = RequestMethod.GET)
	public List<Document> listAll(@RequestParam(value="filters", required = false) String[] filters) throws ServiceException {
		logger.debug("listing products...");
		return productService.list(filters);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Document get(@PathVariable("id") String id) throws ServiceException {
		logger.debug("get product..." + id);
		return productService.get(id);
	}
	
	@RequestMapping(value = "", method = RequestMethod.PUT)
	public Map<String, Object> store(
			@RequestBody(required = true) Document order) throws ServiceException {
		logger.debug("storing order...");
		Document stored = productService.store(order);
		logger.info("stored order: " + order.get("_id"));
		return stored;
	}
	
	@RequestMapping(value = "", method = RequestMethod.DELETE)
	public boolean delete(@RequestBody(required = true) Document order) throws ServiceException {
		logger.debug("deleting order... ");
		boolean deleted = productService.delete(order);
		logger.info("deleted order: " + order + "? " + deleted);
		return deleted;
	}
}
