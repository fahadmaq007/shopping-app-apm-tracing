package com.maqs.apm.orders.controllers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.maqs.apm.orders.services.OrderService;
import com.maqs.commons.exceptions.ServiceException;
import com.maqs.commons.model.Document;

@RestController
@RequestMapping(value = "/orders", produces = MediaType.APPLICATION_JSON_VALUE)
public class OrderController {
	
	private Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private OrderService orderService;
	
	@RequestMapping(value = "", method = RequestMethod.GET)
	public List<Document> listAll(@RequestParam(value="filters", required = false) String[] filters) throws ServiceException {
		logger.debug("listing orders...");
		return orderService.list(filters);
	}
	
	@RequestMapping(value = "", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
	public Document placeOrder(
			@RequestBody(required = true) Document order) throws ServiceException {
		logger.debug("placing order...");
		Document stored = orderService.placeOrder(order);
		logger.info("stored order: " + order.get("_id"));
		return stored;
	}
	
	@RequestMapping(value = "", method = RequestMethod.DELETE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public boolean delete(@RequestBody(required = true) Document order) throws ServiceException {
		logger.debug("deleting order... ");
		boolean deleted = orderService.delete(order);
		logger.info("deleted order: " + order + "? " + deleted);
		return deleted;
	}
}
