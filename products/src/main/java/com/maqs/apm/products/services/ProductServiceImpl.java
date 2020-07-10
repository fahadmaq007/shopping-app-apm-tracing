package com.maqs.apm.products.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.maqs.commons.dao.IDao;
import com.maqs.commons.exceptions.DataAccessException;
import com.maqs.commons.exceptions.ServiceException;
import com.maqs.commons.model.Document;

@Service
public class ProductServiceImpl implements ProductService {

	@Autowired
	private IDao dao;
	
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
	public Document get(String id) throws ServiceException {
		try {
			return dao.getDocumentById(id);
		} catch (DataAccessException e) {
			throw new ServiceException(e.getMessage(), e);
		}
	}

}
