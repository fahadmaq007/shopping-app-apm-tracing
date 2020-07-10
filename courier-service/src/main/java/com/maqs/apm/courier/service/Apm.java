package com.maqs.apm.courier.service;

import co.elastic.apm.api.ElasticApm;
import co.elastic.apm.api.Span;
import co.elastic.apm.api.Transaction;

public class Apm {

	public static void createTransaction(String name) {
//		Tracer tracer = new ElasticApmTracer();
//		tracer.buildSpan("creating transaction");
//		ElasticApmTracer tracer = ElasticApmTracer.builder().build();
		Transaction transaction = ElasticApm.startTransaction();
		transaction.setName(name);
		transaction.setType(Transaction.TYPE_REQUEST);
		transaction.activate();
		System.out.println(transaction.getId() + " " + transaction.getTraceId() + " is created");
	}

	public static void createSpan(String message) {
		Transaction t = ElasticApm.currentTransaction();
		Span s = t.startSpan();
		s.setName(message);
		s.end();
	}

	public static void endTransaction() {
		Transaction t = ElasticApm.currentTransaction();
		if (t != null) {
			t.setResult("success");
			t.end();
		}
	}
}
