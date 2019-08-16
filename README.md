# shopping-app-apm-tracing

This is a mocked shopping web application, demonstrates the server requests tracing in a micro-service architecture using Elastic APM.

Components Architecture:
![Shopping App Components Architecture](ShoppingAppMicroservices-APMTestDiagram.svg?sanitize=true)

* Shopping App (For Buyers): Developed in Angular, allows the customers to select the products & place an order.

* Orders App (For Sellers): Developed in Angular, allows the sellers to confirm & dispatch the product depending upon the availability of the product(s).

The above client applications are merged into one since the intension here is to demonstrate the tracing across the micro-services.

* Products Service: A SpringBoot application to list the available products.

* Orders Service: A SpringBoot application to manage the orders.

* Courier Service: A Kafka Consumer SpringBoot application - Consumes the order from confirmed_orders topic & notifies the respective courier to dispatch the product(s).

* CouchDB: The NoSQL database to store the products & the orders.

* Kafka & Zookeeper: The service to produce & consume documents.

* APM Server: The APM Server is hosted along with the Elasticsearch & Kibana Dashboard. It consumes the transactions / events data from various agents running in the services.

* APM Agent: There are two agents being used in this architecture, the apm-java-agent & the apm-javascript-agent. The agent runs along with the application to send the events data to the APM-server on regular intervals.
