package com.maqs.apm.orders.services;

import java.util.List;

import com.maqs.commons.exceptions.ServiceException;
import com.maqs.commons.model.Document;

public interface OrderService {

	List<Document> list(String[] filters) throws ServiceException;

	Document store(Document document) throws ServiceException;

	boolean delete(Document document) throws ServiceException;

	Document placeOrder(Document order) throws ServiceException;	
}
