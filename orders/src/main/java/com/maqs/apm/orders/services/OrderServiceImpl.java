package com.maqs.apm.orders.services;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.maqs.commons.Util;
import com.maqs.commons.dao.IDao;
import com.maqs.commons.exceptions.DataAccessException;
import com.maqs.commons.exceptions.ServiceException;
import com.maqs.commons.model.Document;

import co.elastic.apm.api.ElasticApm;

@Service
public class OrderServiceImpl implements OrderService {

	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private IDao dao;
	
	@Autowired
	private ProductsServiceHelper productsServiceHelper;
	
	private static final String TOPIC = "confirmed_orders";
	
	@Autowired
	private KafkaTemplate<String, Document> kafkaTemplate;
	
	@Override
	public List<Document> list(String[] filters) throws ServiceException {
		try {
			return dao.listDocuments(filters);
		} catch (DataAccessException e) {
			throw new ServiceException(e.getMessage(), e);
		}
	}

	@Override
	public Document store(Document document) throws ServiceException {
		try {
			document = dao.upsert(document);
			return document;
		} catch (DataAccessException e) {
			throw new ServiceException(e.getMessage(), e);
		}
	}

	@Override
	public boolean delete(Document document) throws ServiceException {
		try {
			return dao.delete(document);
		} catch (DataAccessException e) {
			throw new ServiceException(e.getMessage(), e);
		}
	}

	@Override
	public Document placeOrder(Document order) throws ServiceException {
		order.put("type", "order");
		List<Document> products = (List<Document>) order.get("products");
		if (Util.nullOrEmpty(products)) {
			throw new IllegalArgumentException("to place an order, one or more products required.");
		}
		logger.info(products.getClass().toString());
		for (Map product : products) {
			String productId = (String) product.get("_id");
			Document p = productsServiceHelper.getProduct(productId);
			if (p == null) {
				throw new ServiceException(productId + " doesn't exists");
			}
		}
		ElasticApm.currentTransaction().addLabel("status", (String) order.get("status"));
		order = store(order);
		try {
			logger.debug("publishing to kafka... " + order);
			kafkaTemplate.send(TOPIC, order);
			ElasticApm.currentTransaction().startSpan("request", "kafka", "published " + order.getId()).end();
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}
		
		return order;
	}

}
