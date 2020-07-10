package com.maqs.apm.products.services;

import java.util.List;

import com.maqs.commons.exceptions.ServiceException;
import com.maqs.commons.model.Document;

public interface ProductService {

	List<Document> list(String[] filters) throws ServiceException;

	Document store(Document document) throws ServiceException;

	boolean delete(Document document) throws ServiceException;

	Document get(String id) throws ServiceException;
	
}
