package com.maqs.apm.courier.service;

import java.util.List;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.maqs.commons.dao.IDao;
import com.maqs.commons.exceptions.DataAccessException;
import com.maqs.commons.exceptions.ServiceException;
import com.maqs.commons.model.Document;

import co.elastic.apm.api.CaptureTransaction;
import co.elastic.apm.api.ElasticApm;

@Service
public class OrderApprovalService {

    private static final Logger log = LoggerFactory.getLogger(OrderApprovalService.class);

    private static final String APPROVED = "APPROVED";
    
    private static final String DISPATCHED = "DISPATCHED";
    
    @Autowired
    private IDao dao;
    
    @Value("#{T(java.util.Arrays).asList('${document.attributes.required:}')}")
    private List<String> REQUIRED_ATTRIBUTES_CRITERIA;

    @PostConstruct
    public void initIt() throws Exception {
        log.info("REQUIRED_ATTRIBUTES_CRITERIA " + REQUIRED_ATTRIBUTES_CRITERIA);
    }

    
    @KafkaListener(topics = "#{'${spring.kafka.topics}'.split(',')}", groupId = "#{'${spring.kafka.consumer.group-id}'}")
    @CaptureTransaction
    public void consume(Document d) throws ServiceException {
    	if (d.present(REQUIRED_ATTRIBUTES_CRITERIA)) {
            try {
            	String status = (String) d.get("status");
        		log.info("consumed " + d.getId() + " status" + status);
            	if (APPROVED.equalsIgnoreCase(status)) {
            		status = DISPATCHED;
            		d.put("status", DISPATCHED);
            		log.info("updating db " + d.getId() + " status" + status);
            		d = dao.upsert(d);
            		ElasticApm.currentTransaction().addLabel("documentId", d.getId());
            		ElasticApm.currentTransaction().addLabel("status", (String) d.get("status"));
            		// create courier object to notify courier service provider
//            		Document courier = (Document) Util.clone(d);
//            		courier.remove("_id");courier.remove("_rev");
//            		
//            		courier.put("type", "courier");
            	}
            	
				
			} catch (DataAccessException e) {
				throw new ServiceException(e.getMessage(), e);
			}
        } else {
        	throw new ServiceException("Order doesn't have required data... " + REQUIRED_ATTRIBUTES_CRITERIA);
        }
    }
}
